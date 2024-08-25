FROM python:3.11.9

WORKDIR /usr/src/app

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./src ./src

# CMD ["uvicorn", "src.main:app", "--reload", "--port", "8000"]
CMD exec uvicorn src.main:app --host 0.0.0.0 --port 8000
# CMD tail -f /dev/null
