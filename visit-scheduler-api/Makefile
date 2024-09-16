venv: # 仮想環境の作成
	python3 -m venv venv
run dev: # ローカル開発サーバーの起動
	uvicorn src.main:app --reload --host=0.0.0.00
exec con: # コンテナに入る
	docker exec -it visit-scheduler-api-api-1 bash

