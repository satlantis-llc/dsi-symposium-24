# dsi-symposium-24

Codebase for the "Deploying AI and ML Models into Production" Workshop presented on the UF Data Science symposium of 2024

## Prerequisites

1. docker
2. docker compose
3. python 3.10
4. Linux (or WSL)

Note, the build script does not work out of the box on Windows. To be honest, I have no idea what goes on in that OS. You will have to translate the commands in `build.sh` to their counterparts. However, docker needs WSL to run anyways, so we recommend just doing it there.

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

1. The client is a work in progress and might not support direct image uploads. Prefer internet URL. Not all internet URLs work well either, as some won't download correctly based on who's hosting them.
2. The service provides a metrics dashboard at port 8000 and direct prometheus access at port 9090.
3. You can also view service metrics at :3000/metrics
4. The server is listening to port 3000, you can curl it directly in a console or postman.
5. Provide a link to an image on the internet.
6. Provide an array of labels you want it to predict.

For example, let's predict pizza! Paste this into your terminal:

```
curl -X POST http://localhost:3000/predict/image_url \
     -H "Content-Type: application/json" \
     -d '{"imageUrl": "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg", "predictionWords": ["pizza", "pineapple", "cheese"]}'
```
