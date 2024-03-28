import gradio as gr


def model_prediction(image, words):
    # placeholder for model prediction: bentoml later
    import random

    random.seed(42)
    words = words.split(",")
    results = {word.strip(): random.random() for word in words}
    total = sum(results.values())

    # normalize results to sum up to 100%
    results = {word: round((value / total) * 100, 2) for word, value in results.items()}
    return results


with gr.Blocks() as demo:
    gr.Markdown("## CLIP Model")
    with gr.Row():
        image_input = gr.Image(
            type="filepath", label="Upload an Image or Provide a URL"
        )
        word_input = gr.Textbox(label="Enter words separated by commas")
    with gr.Row():
        submit_button = gr.Button("Predict")
    results_output = gr.JSON(label="Prediction Results")

    submit_button.click(
        fn=model_prediction, inputs=[image_input, word_input], outputs=results_output
    )

demo.launch()
