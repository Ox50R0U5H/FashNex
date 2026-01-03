from django.urls import path
from .views import HomeAggregateAPI, HomeStylesAPI, HomeVendorsAPI, HomeBestSellersAPI

urlpatterns = [
    path("home/", HomeAggregateAPI.as_view(), name="api-home"),
    path("home/styles/", HomeStylesAPI.as_view(), name="api-home-styles"),
    path("home/vendors/", HomeVendorsAPI.as_view(), name="api-home-vendors"),
    path("home/best-sellers/", HomeBestSellersAPI.as_view(), name="api-home-best-sellers"),
]
