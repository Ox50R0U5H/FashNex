import time
from django.contrib.auth import login
from django.contrib.auth.views import LoginView
from django.shortcuts import redirect, render
from .forms import CustomerSignUpForm, SellerSignUpForm, LoginForm
from django.shortcuts import redirect
from django.views.generic import FormView
from django.urls import reverse_lazy
from django.contrib.auth.forms import SetPasswordForm
from .forms import RequestOTPForm, VerifyOTPForm
from .models import User



def signup_customer(request):
    if request.method == "POST":
        form = CustomerSignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("/")
    else:
        form = CustomerSignUpForm()
    return render(request, "auth/signup_customer.html", {"form": form})


def signup_seller(request):
    if request.method == "POST":
        form = SellerSignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("/seller/")
    else:
        form = SellerSignUpForm()
    return render(request, "auth/signup_seller.html", {"form": form})


class UserLoginView(LoginView):
    template_name = "auth/login.html"
    authentication_form = LoginForm

    def get_success_url(self):
        user = self.request.user
        if getattr(user, "role", "") == "seller":
            return "/seller/"
        return "/"
class RequestOTPView(FormView):
    """ مرحله ۱: دریافت ایمیل از کاربر """
    template_name = "auth/request_otp.html"
    form_class = RequestOTPForm
    success_url = reverse_lazy("users:password_reset_otp_verify")

    def form_valid(self, form):
        email = form.cleaned_data['email']
        # اطلاعات را در سشن ذخیره می‌کنیم
        self.request.session['reset_email'] = email
        self.request.session['otp_expiry'] = int(time.time()) + 60  # ۶۰ ثانیه زمان
        self.request.session['otp_attempts'] = 0
        return super().form_valid(form)


class VerifyOTPView(FormView):
    """ مرحله ۲: تایید کد OTP """
    template_name = "auth/verify_otp.html"
    form_class = VerifyOTPForm
    success_url = reverse_lazy("users:password_reset_otp_set")

    def dispatch(self, request, *args, **kwargs):
        # اگر کاربر از مرحله قبل نیامده بود، او را به ابتدای فرآیند برگردان
        if 'reset_email' not in request.session:
            return redirect("users:password_reset_otp_request")
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        expiry_time = self.request.session.get('otp_expiry', 0)
        context['remaining_time'] = max(0, expiry_time - int(time.time()))
        return context

    def form_valid(self, form):
        otp_code = form.cleaned_data['otp_code']
        attempts = self.request.session.get('otp_attempts', 0)
        expiry_time = self.request.session.get('otp_expiry', 0)

        # چک کردن زمان انقضا
        if time.time() > expiry_time:
            form.add_error(None, "زمان ۶۰ ثانیه به پایان رسیده است. لطفا دوباره تلاش کنید.")
            # پاک کردن سشن و بازگشت به مرحله اول
            self.request.session.flush()
            return self.form_invalid(form)
            
        # چک کردن تعداد تلاش‌ها
        if attempts >= 3:
            form.add_error(None, "شما بیش از ۳ بار تلاش کرده‌اید. لطفا فرآیند را از ابتدا شروع کنید.")
            self.request.session.flush()
            return self.form_invalid(form)

        # چک کردن کد (برای MVP)
        if otp_code != "00000":
            self.request.session['otp_attempts'] = attempts + 1
            remaining_attempts = 3 - (attempts + 1)
            form.add_error('otp_code', f"کد وارد شده اشتباه است. {remaining_attempts} تلاش دیگر باقیست.")
            return self.form_invalid(form)
        
        # اگر همه چیز درست بود
        self.request.session['otp_verified'] = True
        return super().form_valid(form)


class ResetPasswordView(FormView):
    """ مرحله ۳: تنظیم رمز عبور جدید """
    template_name = "auth/set_new_password.html"
    form_class = SetPasswordForm
    success_url = reverse_lazy("users:login")

    def dispatch(self, request, *args, **kwargs):
        # اگر کاربر مراحل قبل را طی نکرده، او را به ابتدا برگردان
        if not request.session.get('otp_verified'):
            return redirect("users:password_reset_otp_request")
        return super().dispatch(request, *args, **kwargs)

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        email = self.request.session.get('reset_email')
        kwargs['user'] = User.objects.get(email=email)
        return kwargs

    def form_valid(self, form):
        form.save()
        # پاک کردن تمام اطلاعات سشن بعد از اتمام کار
        self.request.session.flush()
        return super().form_valid(form)