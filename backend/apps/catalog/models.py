from django.db import models

class Vendor(models.Model):
    name = models.CharField(max_length=120)
    is_popular = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Product(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="products")
    title = models.CharField(max_length=200)
    price = models.PositiveIntegerField()  # تومان
    image = models.ImageField(upload_to="products/", blank=True, null=True)

    is_best_seller = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    

class Style(models.Model):
    title = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    description = models.CharField(blank=True, max_length=255)
    badge = models.CharField(blank=True, max_length=40)
    price = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to="styles/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
