from django.contrib import admin
from .models import Vendor, Product


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ("name", "is_popular")
    list_filter = ("is_popular",)
    search_fields = ("name",)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "vendor", "price", "is_best_seller", "created_at")
    list_filter = ("is_best_seller", "vendor")
    search_fields = ("title",)

from .models import Style
from django.utils.safestring import mark_safe

@admin.register(Style)
class StyleAdmin(admin.ModelAdmin):
    list_display = ("title", "price", "created_at", "image_preview")
    search_fields = ("title",)
    list_filter = ("created_at",)
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" style="height:40px;" />')
        return ""
    image_preview.short_description = "Preview"    
