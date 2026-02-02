from django import forms
from .models import SupportEmail

class SupportEmailForm(forms.ModelForm):
    class Meta:
        model = SupportEmail
        fields = ["email"]

    def clean_email(self):
        email = self.cleaned_data["email"].lower().strip()
        if SupportEmail.objects.filter(email=email).exists():
            raise forms.ValidationError("این ایمیل قبلاً ثبت شده است.")
        return email