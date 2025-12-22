import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { FixtureService } from './fixture.service';

async function bootstrap() {
  console.log('Initialisation du contexte Nestjs...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const fixtureService = app.get(FixtureService);

  try {
    console.log('🌱 Début du chargement des fixtures...');
    await fixtureService.loadFixtures();
    console.log('✅ Fixtures chargées avec succès !');
    process.exit(0);
  } catch (error) {
    console.log('erreur lors du chargement des fixtures:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
