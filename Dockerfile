FROM python:3.9-slim

RUN useradd -m appuser

COPY app/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /tmp/requirements.txt
RUN rm /tmp/requirements.txt

COPY app /app
WORKDIR /app

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 5001
CMD ["flask", "run", "-p", "5001", "--host", "0.0.0.0"]