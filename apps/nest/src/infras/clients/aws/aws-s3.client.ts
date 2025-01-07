import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsS3Client {
  private readonly s3: S3;
  private readonly bucketName: string;
  private readonly logger = new Logger(AwsS3Client.name);

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_BUCKET_NAME!;
    this.logger.debug(`Bucket name from config: ${this.bucketName}`);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      this.logger.error('File ou file buffer est manquant');
      throw new BadRequestException('File or file buffer is missing');
    }

    const { originalname, buffer, mimetype } = file;
    this.logger.debug(`Original name: ${originalname}`);
    this.logger.debug(`Buffer: ${buffer ? 'exists' : 'missing'}`);
    this.logger.debug(`Mimetype: ${mimetype}`);

    const filename = `${uuidv4()}-${originalname}`;

    const params = {
      Bucket: this.bucketName,
      Key: filename,
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      const { Location } = await this.s3.upload(params).promise();
      this.logger.debug(`Le fichier est téléchargé avec succès sur ${Location}`);
      return Location;
    } catch (error) {
      this.logger.error(
        'Erreur lors du téléchargement du fichier sur S3',
        error,
      );
      throw new InternalServerErrorException(
        'Erreur lors du téléchargement du fichier sur S3',
      );
    }
  }
}
