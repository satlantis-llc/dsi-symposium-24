import bentoml
import torch
import os
import yaml
from fastapi import FastAPI
import requests
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware

processor_runner = bentoml.transformers.get("clip_processor").to_runner()
model_runner = bentoml.transformers.get("clip_model").to_runner()

cors_config = {
    "allow_origins": ["*"],
    "allow_credentials": True,
    "allow_methods": ["POST"],
    "allow_headers": ["*"],
}

svc = bentoml.Service("clip_service", runners=[processor_runner, model_runner])


@svc.api(input=bentoml.io.JSON(), output=bentoml.io.JSON(), route="/predict/image_url")
async def image_url_inference(data: dict, ctx: bentoml.Context) -> dict:
    url = data.get("imageUrl")
    labels = data.get("predictionWords")
    request_headers = ctx.request.headers

    if not isinstance(labels, list):
        labels = [labels]

    if not url or not labels:
        ctx.response.status_code = 400
        return {"error": "Missing imageUrl or predictionWords"}

    try:
        image = Image.open(requests.get(url, stream=True).raw)
    except Exception as e:
        ctx.response.status_code = 400
        return {"error": f"Error loading the image: {str(e)}"}

    try:
        inputs = await processor_runner.async_run(
            text=[f"a photo of a {l}" for l in labels],
            images=image,
            return_tensors="pt",
            padding=True,
        )
        outputs = await model_runner.async_run(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)
        # return {label: f"{prob:.4f}" for label, prob in zip(labels, probs[0])}
        return {
            label: round(prob.item() * 100, 2) for label, prob in zip(labels, probs[0])
        }
    except Exception as e:
        ctx.response.status_code = 500
        return {"error": f"Error processing the image: {str(e)}"}


fastapi_app = FastAPI(debug=True)

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_config["allow_origins"],
    allow_credentials=cors_config["allow_credentials"],
    allow_methods=cors_config["allow_methods"],
    allow_headers=cors_config["allow_headers"],
)


@fastapi_app.get("/metadata")
def metadata():
    file_path = "/home/bentoml/bento/bento.yaml"
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            yaml_content = yaml.safe_load(file)
            return yaml_content
    else:
        return {"message": "bento.yaml not found"}


svc.mount_asgi_app(fastapi_app)
