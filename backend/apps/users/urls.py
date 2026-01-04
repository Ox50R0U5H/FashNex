from django.urls import path
from .views import signup_customer, signup_seller, UserLogoutView, RequestOTPView, VerifyOTPView, ResetPasswordView, UserLoginView

app_name = "users"

urlpatterns = [
    path("login/", UserLoginView.as_view(), name="login"),
    path("signup/", signup_customer, name="signup_customer"),
    path("signup/seller/", signup_seller, name="signup_seller"),
    path("logout/", UserLogoutView.as_view(), name="logout"),
    path(
        "password-reset/request/", 
        RequestOTPView.as_view(), 
        name="password_reset_otp_request"
    ),
    path(
        "password-reset/verify/", 
        VerifyOTPView.as_view(), 
        name="password_reset_otp_verify"
    ),
    path(
        "password-reset/set-new/", 
        ResetPasswordView.as_view(), 
        name="password_reset_otp_set"
    ),
]
