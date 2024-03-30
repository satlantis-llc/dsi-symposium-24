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
    echo "Error: BentoML is not installed. Please install bento/requirements.txt before running this script." >&2
    exit 1
fi

if ! [ -x "$(command -v docker)" ]; then
    echo "Please start docker!" >&2
    exit 1
fi

# Check for docker-compose or the integrated 'docker compose'
if ! [ -x "$(command -v docker-compose)" ] && ! docker compose version > /dev/null 2>&1; then
    echo "Is docker compose installed?" >&2
    exit 1
fi

# Requirements
files=("bento/save_model.py" "bento/service.py" "bento/bentofile.yaml")
for file in "${files[@]}"; do
    if [ ! -e "$file" ]; then
        echo "Error: $file not found in the expected directory."
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
python3 bento/save_model.py

# Builds Model
bentoml build --version "$VERSION" --file bento/bentofile.yaml

# Containerizes Model
bentoml containerize "$MODEL:$VERSION" --docker-image-tag "$CONTAINER:$VERSION"

echo "Images built successfully! Look over the docker compose config and run `docker compose up` to start the client-server."
