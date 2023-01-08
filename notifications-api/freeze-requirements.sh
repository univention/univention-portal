#!/bin/bash

python3 -m venv ~/venv
source ~/venv/bin/activate

pip3 install .
pip3 freeze | grep -v "notifications-api" > requirements.txt

pip3 install .[dev]
pip3 freeze | grep -v "notifications-api" > requirements-dev.txt
