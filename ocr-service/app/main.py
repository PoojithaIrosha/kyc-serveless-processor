from fastapi import FastAPI, UploadFile, File
from app.engines import OCREngine

app = FastAPI()
ocr = OCREngine()

@app.post("/process")
async def process(file: UploadFile = File(...)):
    content = await file.read()
    text = ocr.extract_text(content)

    return {
        "raw_text": text
    }