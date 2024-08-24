FROM python:3.11.9

WORKDIR /usr/src/app

COPY ./requirements.txt .
RUN pip install -r requirements.txt

# CMD ["uvicorn", "src.main:app", "--reload", "--port", "8000"]
CMD tail -f /dev/null
