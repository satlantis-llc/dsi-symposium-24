import bentoml
import torch
import os
import yaml
from fastapi import FastAPI
import requests
from PIL import Image

processor_runner = bentoml.transformers.get("clip_processor").to_runner()
model_runner = bentoml.transformers.get("clip_model").to_runner()

svc = bentoml.Service("clip_service", runners=[processor_runner, model_runner])

@bentoml.api(input=bentoml.io.JSON(), output=bentoml.io.Text(), route='/predict/image_url')
async def image_url_inference(self, body: dict) -> str:
    image_url = body.get("image_url")
    input_labels = body.get("labels")

    try:
        image = Image.open(requests.get(image_url, stream=True).raw)
    except Exception as e:
        return "Error loading the image"

    try:
        inputs = processor_runner(text=[f"a photo of a {l}" for l in input_labels], images=image, return_tensors="pt",
                           padding=True)
        outputs = model_runner(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1).tolist()[0]
        predicted_label_index = probs.index(max(probs))
        predicted_label = input_labels[predicted_label_index]
        return predicted_label
    except Exception as e:
        return "Error processing the image"


fastapi_app = FastAPI(debug=True)

@fastapi_app.get("/metadata")
def metadata():
    file_path = '/home/bentoml/bento/bento.yaml'
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            yaml_content = yaml.safe_load(file)
            return yaml_content
    else:
        return {"message": "bento.yaml not found"}


svc.mount_asgi_app(fastapi_app)