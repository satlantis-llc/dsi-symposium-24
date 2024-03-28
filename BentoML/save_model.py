import bentoml
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

processor = CLIPProcessor.from_pretrained("flax-community/clip-rsicd-v2")
model = CLIPModel.from_pretrained("flax-community/clip-rsicd-v2")

bentoml.transformers.save_model("clip_processor", processor)
bentoml.transformers.save_model("clip_model", model)