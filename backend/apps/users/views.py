from django.contrib.auth import login
from django.contrib.auth.views import LoginView
from django.shortcuts import redirect, render

from .forms import CustomerSignUpForm, SellerSignUpForm, LoginForm

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
