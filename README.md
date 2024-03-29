# dsi-symposium-24
Codebase for the "Deploying AI and ML Models into Production" Workshop presented on the UF Data Science symposium of 2024

## Prerequisites
1. Install docker compose
2. Python 3.10

## BentoML Usage
1. `cd BentoML`
2. `python3.10 -m venv venv`
3. `source venv/bin/activate`
4. `pip install requirements.txt`
5. `./build_script.sh`
6. `docker-compose up`
7. (Optional) Run `request.py` to test!
