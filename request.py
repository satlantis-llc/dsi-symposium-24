import requests

def request_image_url_endpoint(image_url: str, labels: list):
    # EXAMPLE INPUT
    # image_url = "https://raw.githubusercontent.com/arampacha/CLIP-rsicd/master/data/stadium_1.jpg"
    # labels = ["residential area", "playground", "stadium", "forest", "airport"]

    # URL of the API endpoint
    api_url = "http://localhost:3000/predict"

    # Data to be sent in the request
    input = { "imageUrl": image_url, "predictionWords": labels }

    # Sending POST request to the API
    response = requests.post(api_url, json=input)

    # Printing the response
    print(response.json())

if __name__ == '__main__':
    image_url = "https://raw.githubusercontent.com/arampacha/CLIP-rsicd/master/data/stadium_1.jpg"
    labels = ["residential area", "playground", "stadium", "forest", "airport"]
    request_image_url_endpoint(image_url, labels)
