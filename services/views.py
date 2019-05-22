from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import read_base64_image, get_face_from_image, get_expression_from_amv


# Create your views here.
def home(request):
    render(request, 'build/index.html')


@api_view(['POST'])
def retrieve_expression(request):
    data_string = request.data.get("data")
    image = read_base64_image(data_string)
    has_face = get_face_from_image(image)

    if has_face == 0:
        return Response({"expression": "None"})

    expression = get_expression_from_amv()
    return Response({"expression": expression})
