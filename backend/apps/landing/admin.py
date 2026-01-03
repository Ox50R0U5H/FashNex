from django.contrib import admin
from .models import HomeStyle, HomeVendor, HomeBestSeller


@admin.register(HomeStyle)
class HomeStyleAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "price", "is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("title", "slug", "description")
    ordering = ("order", "-id")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(HomeVendor)
class HomeVendorAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "rating", "satisfaction_percent", "is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    ordering = ("order", "-id")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(HomeBestSeller)
class HomeBestSellerAdmin(admin.ModelAdmin):
    list_display = ("title", "price", "is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("title",)
    ordering = ("order", "-id")