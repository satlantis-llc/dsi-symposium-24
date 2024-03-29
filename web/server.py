from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

def model_prediction(image, words):
    # placeholder for model prediction
    random.seed(42)
    words = words.split(",")
    results = {word.strip(): random.random() for word in words}
    total = sum(results.values())

    # normalize results to sum up to 100%
    results = {word: round((value / total) * 100, 2) for word, value in results.items()}
    return results

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    imageUrl = data.get('imageUrl', '')
    predictionWords = data.get('predictionWords', '')

    if not imageUrl or not predictionWords:
        return jsonify({'error': 'Missing imageUrl or predictionWords'}), 400

    # convert list of prediction words to a comma-separated string
    predictionWordsStr = ",".join(predictionWords)

    results = model_prediction(imageUrl, predictionWordsStr)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=3000)
