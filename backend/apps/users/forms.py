from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.core.exceptions import ValidationError

from .models import User

# --- فرم ثبت‌نام مشتری اصلاح می‌شود ---
class CustomerSignUpForm(UserCreationForm):
    # فیلدهای جدید را برای مشتری هم اضافه می‌کنیم
    first_name = forms.CharField(max_length=150, label="نام")
    last_name = forms.CharField(max_length=150, label="نام خانوادگی")

    class Meta(UserCreationForm.Meta):
        model = User
        # فیلدهای جدید را به لیست اضافه می‌کنیم
        fields = ("username", "email", "first_name", "last_name")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = User.Role.CUSTOMER
        # اطلاعات جدید را در مدل ذخیره می‌کنیم
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        if commit:
            user.save()
        return user


# فرم ثبت‌نام فروشنده بدون تغییر باقی می‌ماند
class SellerSignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=150, label="نام")
    last_name = forms.CharField(max_length=150, label="نام خانوادگی")
    store_name = forms.CharField(max_length=255, label="نام فروشگاه/برند")
    national_id = forms.CharField(max_length=10, label="کد ملی")
    phone_number = forms.CharField(max_length=15, label="شماره تلفن تماس")
    sheba_number = forms.CharField(max_length=26, label="شماره شبا (با IR)")
    store_address = forms.CharField(widget=forms.Textarea, label="آدرس فروشگاه/محل کار", required=False)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = (
            "username", "email", 
            "first_name", "last_name", 
            "store_name", 
            "national_id", "phone_number", 
            "sheba_number", "store_address"
        )
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = User.Role.SELLER
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.store_name = self.cleaned_data['store_name']
        user.national_id = self.cleaned_data['national_id']
        user.phone_number = self.cleaned_data['phone_number']
        user.sheba_number = self.cleaned_data['sheba_number']
        user.store_address = self.cleaned_data['store_address']
        if commit:
            user.save()
        return user

    def clean_national_id(self):
        national_id = self.cleaned_data.get('national_id')
        if not national_id.isdigit() or len(national_id) != 10:
            raise ValidationError("کد ملی باید یک عدد ۱۰ رقمی باشد.")
        return national_id

    def clean_sheba_number(self):
        sheba_number = self.cleaned_data.get('sheba_number')
        if not sheba_number.startswith("IR") or len(sheba_number) != 26 or not sheba_number[2:].isdigit():
            raise ValidationError("شماره شبا باید با IR شروع شده و شامل ۲۴ عدد باشد.")
        return sheba_number


# فرم لاگین بدون تغییر
class LoginForm(AuthenticationForm):
    # فیلد username را به EmailField تغییر می‌دهیم
    username = forms.EmailField(label="ایمیل", widget=forms.EmailInput(attrs={'autofocus': True}))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.error_messages["invalid_login"] = "ایمیل یا رمز عبور اشتباه است."

class RequestOTPForm(forms.Form):
    email = forms.EmailField(label="ایمیل", widget=forms.EmailInput(attrs={'placeholder': 'ایمیل خود را وارد کنید'}))

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not User.objects.filter(email__iexact=email).exists():
            raise ValidationError("کاربری با این ایمیل یافت نشد.")
        return email

class VerifyOTPForm(forms.Form):
    otp_code = forms.CharField(label="کد تایید", max_length=5, widget=forms.TextInput(attrs={'placeholder': 'کد ۵ رقمی'}))
