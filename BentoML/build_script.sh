#!/bin/bash

set -e

MODEL="clip_service"
CONTAINER="${MODEL}_container"
VERSION="1.0.0"

export MODEL_IMAGE="$CONTAINER:$VERSION"
export MODEL_PORT=3000
export PROM_PORT=9090
export GRAFANA_PORT=8000

# Dependencies
if ! [ -x "$(command -v bentoml)" ]; then
    echo "Error: BentoML is not installed. Please install requirements.txt before running this script." >&2
    exit 1
fi

if ! [ -x "$(command -v docker-compose)" ]; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose before running this script." >&2
    exit 1
fi

# Requirements
files=("save_model.py" "service.py" "bentofile.yaml")
for file in "${files[@]}"; do
    if [ ! -e "$file" ]; then
        echo "Error: $file not found in the current directory."
        exit 1
    fi
done

# Existing Instances
if docker images | grep -q "$CONTAINER:$VERSION"; then
  echo "Image $MODEL_IMAGE exists in Docker. Deleting..."
  echo "y" | docker image rm "$CONTAINER:$VERSION"
fi

if bentoml list | grep -q "$MODEL:$VERSION"; then
  echo "Model $MODEL_IMAGE exists in BentoML. Deleting..."
  echo "y" | bentoml delete "$MODEL:$VERSION"
fi

# Saves Model
python3 save_model.py

# Builds Model
bentoml build --version "$VERSION"

# Containerizes Model
bentoml containerize "$MODEL:$VERSION" --docker-image-tag "$CONTAINER:$VERSION"

# Creates prometheus.yml
PLACEHOLDER="MODEL_PORT_PLACEHOLDER"
cat > prometheus.yml <<EOF
global:
  scrape_interval:     5s
  evaluation_interval: 15s
scrape_configs:
  - job_name: 'bentoml-container'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['app:${PLACEHOLDER}']
EOF

sed -i "s/${PLACEHOLDER}/${MODEL_PORT}/g" prometheus.yml

# Creates docker-compose.yml
PLACEHOLDER="MODEL_IMAGE_PLACEHOLDER"
cat > docker-compose.yml <<EOF
version: '3'
services:
  app:
    image: ${PLACEHOLDER}
    ports:
      - "${MODEL_PORT:-3000}:${MODEL_PORT:-3000}"
  prometheus:
    image: prom/prometheus
    ports:
      - "${PROM_PORT:-9090}:${PROM_PORT:-9090}"
    volumes:
      - ./prometheus.yml:/prometheus.yml
    command:
      - '--config.file=/prometheus.yml'
  grafana:
    image: grafana/grafana
    ports:
      - "${GRAFANA_PORT:-3001}:3000"
EOF

sed -i "s/${PLACEHOLDER}/${MODEL_IMAGE}/g" docker-compose.yml

echo "Successfully built. Run 'docker-compose up' to spin up containers."