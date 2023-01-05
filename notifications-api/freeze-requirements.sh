#!/bin/bash

python -m venv ~/venv
source ~/venv/bin/activate

pip install -e .
pip freeze | grep -v "notifications-api" > requirements.txt

pip install -e .[dev]
pip freeze | grep -v "notifications-api" > requirements-dev.txt
