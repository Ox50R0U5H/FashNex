from django.db import models


class HomeStyle(models.Model):
    title = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)

    image = models.ImageField(upload_to="home/styles/")
    
    # 🔴 جدید
    description = models.CharField(
        max_length=255,
        help_text="مثال: شامل: لباس ورزشی، کفش"
    )
    price = models.PositiveIntegerField(help_text="قیمت به تومان")

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title


class HomeVendor(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)

    logo = models.ImageField(upload_to="home/vendors/")

    rating = models.FloatField(help_text="مثال: 4.6")
    
    # 🔴 جدید
    satisfaction_percent = models.PositiveIntegerField(
        help_text="مثال: 92 (درصد رضایت)"
    )

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
    
class HomeBestSeller(models.Model):
    title = models.CharField(max_length=120)
    image = models.ImageField(upload_to="home/best_sellers/")
    price = models.PositiveIntegerField(help_text="قیمت به تومان")

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-id"]
        
    def __str__(self) -> str:
        return f"BestSeller: {self.title}"

class SupportEmail(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email