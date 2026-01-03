from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import HomeStyle, HomeVendor, HomeBestSeller
from .serializers import HomeStyleSerializer, HomeVendorSerializer, HomeBestSellerSerializer


class HomeStylesAPI(ListAPIView):
    serializer_class = HomeStyleSerializer

    def get_queryset(self):
        return HomeStyle.objects.filter(is_active=True).order_by("order", "-id")


class HomeVendorsAPI(ListAPIView):
    serializer_class = HomeVendorSerializer

    def get_queryset(self):
        return HomeVendor.objects.filter(is_active=True).order_by("order", "-id")


class HomeBestSellersAPI(ListAPIView):
    serializer_class = HomeBestSellerSerializer

    def get_queryset(self):
        # ✅ چون product نداریم
        return HomeBestSeller.objects.filter(is_active=True).order_by("order", "-id")


class HomeAggregateAPI(APIView):
    def get(self, request):
        styles = HomeStyle.objects.filter(is_active=True).order_by("order", "-id")
        vendors = HomeVendor.objects.filter(is_active=True).order_by("order", "-id")
        best = HomeBestSeller.objects.filter(is_active=True).order_by("order", "-id")  # ✅

        return Response({
            "styles": HomeStyleSerializer(styles, many=True, context={"request": request}).data,
            "vendors": HomeVendorSerializer(vendors, many=True, context={"request": request}).data,
            "best_sellers": HomeBestSellerSerializer(best, many=True, context={"request": request}).data,
        })
