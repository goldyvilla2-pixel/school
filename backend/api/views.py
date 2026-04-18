from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    return Response({
        "status": "healthy",
        "message": "OpenEduCat ERP Backend is running",
        "version": "1.0.0"
    })
