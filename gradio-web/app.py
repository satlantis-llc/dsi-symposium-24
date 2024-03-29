import gradio as gr
import requests

def model_prediction(image_input, prediction_words):
    if image_input.startswith("http"):  # Input is a URL
        image_url = image_input
    else:  # Input is a file path
        image = Image.open(image_input)
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        image_url = "data:image/jpeg;base64," + image_base64
    
    url = "http://127.0.0.1:3000/predict/image_url"
    
    payload = {
        "imageUrl": image_url,
        "predictionWords": prediction_words.split(",")
    }
    
    response = requests.post(url, json=payload)
    return response.json()

with gr.Blocks() as demo:
    gr.Markdown("## CLIP Model")
    with gr.Row():
        image_input = gr.Image(
            type="filepath", label="Upload an Image or Provide a URL", sources=["upload", "clipboard"],
        )
        word_input = gr.Textbox(label="Enter words separated by commas")
    with gr.Row():
        submit_button = gr.Button("Predict")
    results_output = gr.JSON(label="Prediction Results")

    submit_button.click(
        fn=model_prediction, inputs=[image_input, word_input], outputs=results_output
    )

demo.launch(server_name="192.168.128.10", server_port=5173)
