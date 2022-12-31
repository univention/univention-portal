FROM python:3.9-slim as test

ARG WORKDIR=/app
ARG USER=fastapi
RUN useradd -m "$USER"
WORKDIR "$WORKDIR"
RUN chown "$USER":"$USER" "$WORKDIR"
USER "$USER"
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
ENV PATH="/home/${USER}/.local/bin:${PATH}"
ENV PYTHONPATH="."
CMD ["pytest"]


FROM test as dev

ENV PYTHONPATH="$WORKDIR"
COPY ./ ./
EXPOSE 80
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
