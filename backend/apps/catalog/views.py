from django.shortcuts import render
from django.http import JsonResponse
from .models import Style

# Create your views here.

def styles_api(request):
    """Return a JSON list of styles with image URLs."""
    styles = Style.objects.order_by("-created_at")
    data = []
    for s in styles:
        data.append({
            "id": s.pk,
            "name": s.title,
            "description": s.description,
            "price": s.price,
            "image": s.image.url if s.image else None,
        })
    return JsonResponse({"styles": data})
