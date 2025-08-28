from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI()

@app.post("/upload/")  # <-- note the trailing slash
async def upload(file: UploadFile = File(...)):
    print("hehheheheh")
    out = UPLOAD_DIR / file.filename
    with out.open("wb") as f:
        while chunk := await file.read(1024 * 1024):
            f.write(chunk)
    return {"filename": file.filename, "size": out.stat().st_size, "type": file.content_type}

for r in app.router.routes:
    print("ROUTE:", getattr(r, "path", None), getattr(r, "methods", None), type(r).__name__)
# Serve frontend

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
UPLOAD_DIR = Path("uploads"); UPLOAD_DIR.mkdir(exist_ok=True)



