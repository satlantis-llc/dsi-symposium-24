# dsi-symposium-24

Codebase for the "Deploying AI and ML Models into Production" Workshop presented on the UF Data Science symposium of 2024

## Prerequisites

1. docker
2. docker compose
3. python 3.10

## Installation

Build a docker image to serve the AI Model

```
./build.sh
```

## Launch the application

```
docker compose up
```

## Notes

1. The client-server interaction is a WIP and you might face some CORS.
2. The server is listening to port 3000, you can curl it directly in a console or postman.
3. Provide a link to an image on the internet.
4. Provide an array of labels you want it to predict.

For example, let's predict pizza! Paste this into your terminal:

```
curl -X POST http://localhost:3000/predict/image_url \
     -H "Content-Type: application/json" \
     -d '{"imageUrl": "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg", "predictionWords": ["pizza", "pineapple", "cheese"]}'
```
