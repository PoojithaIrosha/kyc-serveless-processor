import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = path.resolve(__dirname, "../proto/kyc.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const client = new proto.kyc.KycService(
  "localhost:50051",
  grpc.credentials.createInsecure(),
);

export class GrpcClient {
  processDocument(fileBuffer: Buffer, fileName: string, documentType: number) {
    return new Promise((resolve, reject) => {
      client.ProcessDocument(
        {
          file: fileBuffer,
          file_name: fileName,
          document_type: documentType,
        },
        (err: any, response: any) => {
          if (err) return reject(err);
          resolve(response);
        },
      );
    });
  }
}
