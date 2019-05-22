from google.cloud import automl_v1beta1
from django.conf import settings
import numpy as np
import base64
import cv2


def read_base64_image(base64_string):
    encoded_data = base64_string.split(',')[1]
    img_array = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return img


def get_face_from_image(image):
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(
        image,
        scaleFactor=1.3,
        minNeighbors=3,
        minSize=(48, 48)
    )

    if len(faces) == 0:
        return 0

    print("[INFO] Found face")
    (x, y, w, h) = faces[0]
    roi_color = image[y:y + h, x:x + w]
    gray_image = cv2.cvtColor(roi_color, cv2.COLOR_BGR2GRAY)
    status = cv2.imwrite('face_expression.jpg', gray_image)

    print("[INFO] Face expression image file save: ", status)
    return 1


def get_prediction(content, project_id, model_id):
    prediction_client = automl_v1beta1.PredictionServiceClient()

    name = 'projects/{}/locations/us-central1/models/{}'.format(
        project_id, model_id)
    payload = {'image': {'image_bytes': content}}
    params = {}
    request = prediction_client.predict(name, payload, params)
    return request  # waits till request is returned


def get_expression_from_amv():
    file_path = 'face_expression.jpg'
    with open(file_path, 'rb') as file:
        content = file.read()

    expression = get_prediction(content, settings.PROJECT_ID,  settings.MODEL_ID)
    print(expression)
    if expression is not None and expression.payload is not None \
            and len(expression.payload) > 0:
        return expression.payload[0].display_name
    return "Unknown"
