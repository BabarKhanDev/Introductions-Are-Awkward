FROM python:3.9

COPY app/requirements.txt /tmp
RUN pip install --no-cache-dir --upgrade -r /tmp/requirements.txt
RUN rm /tmp/requirements.txt
COPY app /app
WORKDIR /app

EXPOSE 5001
CMD ["flask", "run", "-p", "5001", "--host", "0.0.0.0"]