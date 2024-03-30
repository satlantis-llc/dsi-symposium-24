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
VENV_PATH="bento/venv"
if ! [ -x "$VENV_PATH/bin/bentoml" ]; then
    echo "Setting up virtual environment and installing BentoML..."
    # Check for Python 3.10 and create a virtual environment
    PYTHON_BIN=$(command -v python3.10 || command -v python3)
    if [ -z "$PYTHON_BIN" ]; then
        echo "Error: Python 3.10 is not installed. Please install Python 3.10 before running this script." >&2
        exit 1
    fi

    # Create virtual environment
    $PYTHON_BIN -m venv "$VENV_PATH"
    source "$VENV_PATH/bin/activate"

    # Install requirements
    if [ -e "bento/requirements.txt" ]; then
        pip install -r bento/requirements.txt
    else
      
        echo "Error: bento/requirements.txt not found. Please ensure the file exists before running this script." >&2
        exit 1
    fi

    echo "Virtual environment setup completed."
else
    echo "BentoML virtual environment already set up."
    source "$VENV_PATH/bin/activate"
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
files=("bento/save_model.py" "bento/service.py" "bento/bentofile.yml")
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

# Need to work inside bento module now
pushd bento

# Save models into BentoML model store
python3 save_model.py
# Builds Model
bentoml build --version "$VERSION" --bentofile bentofile.yml
# Containerizes Model
bentoml containerize "$MODEL:$VERSION" --docker-image-tag "$CONTAINER:$VERSION"

# Exit bento module
popd

echo "Model Serving Images successfully built! Run docker compose up to start the service!"
