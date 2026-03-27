from paddleocr import PaddleOCR
import numpy as np
from PIL import Image
import io
import cv2


class OCREngine:
    def __init__(self):
        self.ocr = PaddleOCR(
            use_angle_cls=False,
            lang='en',
            det_model_dir=None,
            rec_model_dir=None,
            show_log=True
        )

        print("🔥 Warming up OCR model...")
        dummy = np.zeros((100, 100, 3), dtype=np.uint8)
        self.ocr.ocr(dummy)
        print("✅ OCR Engine Ready")

    def extract_text(self, file_bytes: bytes) -> str:
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        image_np = np.array(image)

        # image.thumbnail((1024, 1024))

        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        gray = cv2.equalizeHist(gray)
        processed = cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)

        result = self.ocr.ocr(processed)

        texts = []
        for line in result:
            for word in line:
                texts.append(word[1][0])

        return " ".join(texts)
