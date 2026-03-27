from concurrent import futures
import grpc

from generated import kyc_pb2_grpc
from app.services.kyc_service import KycService


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    kyc_pb2_grpc.add_KycServiceServicer_to_server(
        KycService(), server
    )

    server.add_insecure_port('[::]:50051')
    server.start()

    print("🚀 KYC gRPC server running on port 50051")

    server.wait_for_termination()


if __name__ == "__main__":
    serve()