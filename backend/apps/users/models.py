from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    """
    مدل سفارشی کاربر.
    از فیلدهای first_name و last_name خود جنگو استفاده می‌کنیم.
    """

    # --- نقش کاربر ---
    class Role(models.TextChoices):
        ADMIN = "ADMIN", _("ادمین")
        CUSTOMER = "CUSTOMER", _("مشتری")
        SELLER = "SELLER", _("فروشنده")

    email = models.EmailField(_('email address'), unique=True)
    
    role = models.CharField(
        max_length=50, 
        choices=Role.choices, 
        default=Role.CUSTOMER, 
        verbose_name=_("نقش")
    )

    # --- فیلدهای اختصاصی فروشنده ---
    # فیلد full_name حذف شد. از first_name و last_name خود AbstractUser استفاده می‌کنیم.
    
    store_name = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        verbose_name=_("نام فروشگاه/برند")
    )
    national_id = models.CharField(
        max_length=10, 
        blank=True, 
        null=True, 
        unique=True,
        verbose_name=_("کد ملی")
    )
    phone_number = models.CharField(
        max_length=15, 
        blank=True, 
        null=True, 
        verbose_name=_("شماره تلفن تماس")
    )
    sheba_number = models.CharField(
        max_length=26,
        blank=True, 
        null=True, 
        unique=True,
        verbose_name=_("شماره شبا")
    )
    store_address = models.TextField(
        blank=True, 
        null=True, 
        verbose_name=_("آدرس فروشگاه/محل کار")
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
