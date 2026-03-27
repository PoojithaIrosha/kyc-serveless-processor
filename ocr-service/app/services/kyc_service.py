import grpc
import time

from app.engines.ocr_engine import OCREngine
from generated import kyc_pb2, kyc_pb2_grpc

ocr_engine = OCREngine()

class KycService(kyc_pb2_grpc.KycServiceServicer):

    def ProcessDocument(self, request, response):
        start = time.time()
        print("🔍 Starting OCR - ", start)

        text = ocr_engine.extract_text(request.file)

        print("OCR took:", time.time() - start)

        return kyc_pb2.KycResponse(
            raw_text=text,
            document_type=request.document_type,
            fields=[],
            is_valid=True,
            error="",
            overall_confidence=0.0
        )