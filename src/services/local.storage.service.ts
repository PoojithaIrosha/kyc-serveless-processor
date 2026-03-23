import fs from 'fs';
import path from 'path';

export class LocalStorageService {
    private basePath = path.resolve('uploads');

    async upload(file: Express.Multer.File, key: string): Promise<string> {
        const filePath = path.join(this.basePath, key);

        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        fs.writeFileSync(filePath, file.buffer);

        return filePath;
    }
}