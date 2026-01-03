"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from django.conf import settings
from django.conf.urls.static import static

from apps.catalog.models import Vendor, Product  # اگر مسیرت apps.catalog بود بگو تا درستش کنم

def home_view(request):
    best_sellers = Product.objects.filter(is_best_seller=True).select_related("vendor").order_by("-created_at")[:10]
    vendors = Vendor.objects.filter(is_popular=True).order_by("name")[:10]

    context = {
        "best_sellers": best_sellers,
        "vendors": vendors,
    }
    return render(request, "home/index.html", context)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home_view, name="home"),
    path("auth/", include(("apps.users.urls", "users"), namespace="users")),
    path("api/", include("apps.landing.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



