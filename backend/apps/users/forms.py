from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User

class CustomerSignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email", "password1", "password2")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = User.Role.CUSTOMER
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user


class SellerSignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)

    # MVP: فعلاً فقط فروشنده بودن رو ذخیره می‌کنیم
    # بعداً می‌تونیم فیلدهای "نام فروشگاه" و ... رو به VendorProfile اضافه کنیم

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email", "password1", "password2")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = User.Role.SELLER
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user


class LoginForm(AuthenticationForm):
    username = forms.CharField(label="نام کاربری یا ایمیل")
