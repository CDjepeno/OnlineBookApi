import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Interface pour typer les erreurs AWS
interface AwsError extends Error {
  code?: string;
  statusCode?: number;
  retryable?: boolean;
}

// Type guard pour vérifier si l'erreur est une AwsError
function isAwsError(error: unknown): error is AwsError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

@Injectable()
export class AwsS3Client {
  private readonly s3: S3;
  private readonly bucketName: string;
  private readonly logger = new Logger(AwsS3Client.name);

  constructor() {
    // Vérification des variables d'environnement
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS credentials are missing');
    }

    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_BUCKET_NAME!;

    // Logs de diagnostic
    this.logger.debug(`AWS Region: ${process.env.AWS_REGION}`);
    this.logger.debug(`Bucket name: ${this.bucketName}`);
    this.logger.debug(`Access Key ID: ${process.env.AWS_ACCESS_KEY_ID}`);
  }

  async testConnection(): Promise<void> {
    try {
      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
      this.logger.log('✅ Connexion S3 réussie !');
    } catch (error) {
      const errorMessage = isAwsError(error)
        ? `AWS Error ${error.code}: ${error.message}`
        : `Erreur inconnue: ${String(error)}`;

      this.logger.error('❌ Erreur de connexion S3:', errorMessage);
      throw error;
    }
  }

  // Méthode pour diagnostiquer les permissions
  async diagnosePermissions(): Promise<void> {
    this.logger.debug('=== DIAGNOSTIC S3 ===');
    this.logger.debug(`Region: ${process.env.AWS_REGION}`);
    this.logger.debug(`Bucket: ${this.bucketName}`);
    this.logger.debug(
      `Access Key: ${process.env.AWS_ACCESS_KEY_ID?.substring(0, 10)}...`,
    );

    try {
      // Test des permissions de base
      const tests = [
        { name: 'ListBuckets', action: () => this.s3.listBuckets().promise() },
        {
          name: 'HeadBucket',
          action: () =>
            this.s3.headBucket({ Bucket: this.bucketName }).promise(),
        },
        {
          name: 'GetBucketLocation',
          action: () =>
            this.s3.getBucketLocation({ Bucket: this.bucketName }).promise(),
        },
      ];

      for (const test of tests) {
        try {
          await test.action();
          this.logger.log(`✅ ${test.name}: OK`);
        } catch (error) {
          const err = isAwsError(error) ? error : new Error(String(error));
          this.logger.error(`❌ ${test.name}: ${err.message}`);
        }
      }
    } catch (error) {
      this.logger.error('Erreur générale:', error);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      this.logger.error('File ou file buffer est manquant');
      throw new BadRequestException('File or file buffer is missing');
    }

    const { originalname, buffer, mimetype } = file;

    const filename = `${uuidv4()}-${originalname}`;

    const params = {
      Bucket: this.bucketName,
      Key: filename,
      Body: buffer,
      ContentType: mimetype,
    };

    this.logger.debug(`Attempting to upload to bucket: ${this.bucketName}`);
    this.logger.debug(`File key: ${filename}`);

    try {
      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
      this.logger.debug('Bucket access confirmed');

      const result = await this.s3.upload(params).promise();
      this.logger.debug(`File uploaded successfully to ${result.Location}`);

      return result.Location;
    } catch (error) {
      if (isAwsError(error)) {
        this.logger.error(`Erreur S3 [${error.code}]`, error);
        switch (error.code) {
          case 'NoSuchBucket':
            throw new InternalServerErrorException(
              `Le bucket S3 '${this.bucketName}' n'existe pas`,
            );
          case 'AccessDenied':
            throw new InternalServerErrorException(
              'Accès refusé au bucket S3 - vérifiez les permissions IAM',
            );
          case 'InvalidAccessKeyId':
            throw new InternalServerErrorException("Clé d'accès AWS invalide");
          case 'SignatureDoesNotMatch':
            throw new InternalServerErrorException('Clé secrète AWS invalide');
          case 'BucketAlreadyOwnedByYou':
            // Continuez avec l'upload si c'est juste un problème de bucket
            this.logger.warn('Bucket already owned, continuing...');
            break;
          default:
            throw new InternalServerErrorException(
              `Erreur AWS S3 [${error.code}]: ${error.message}`,
            );
        }
      } else {
        // Erreur non-AWS
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        this.logger.error("Erreur non-AWS lors de l'upload:", errorMessage);
      }

      throw new InternalServerErrorException(
        'Erreur lors du téléchargement du fichier sur S3',
      );
    }
  }
}
