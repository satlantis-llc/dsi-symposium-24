import gradio as gr
import requests

def model_prediction(image_url, prediction_words):
    url = "http://127.0.0.1/predict"
    
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
            type="filepath", label="Upload an Image or Provide a URL", sources=["upload", "clipboard"], tool=None
        )
        word_input = gr.Textbox(label="Enter words separated by commas")
    with gr.Row():
        submit_button = gr.Button("Predict")
    results_output = gr.JSON(label="Prediction Results")

    submit_button.click(
        fn=model_prediction, inputs=[image_input, word_input], outputs=results_output
    )

demo.launch(server_port=5173)
