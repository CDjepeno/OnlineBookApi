import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AddBookUseCase } from './domaine/book/usecases/addBook/addBook.usecase';
import { AddUserUseCase } from './domaine/user/usecases/adduser/add.user.usecase';
import { TypeOModule } from './infras/clients/typeorm/type-orm.module';
import { ControllerModule } from './infras/controllers/controller.module';
import { AddUserController } from './infras/controllers/user/addUserController/addUser.controller';
import { FixtureModule } from './infras/fixtures/fixture.module';
import { FixtureService } from './infras/fixtures/fixture.service';
import { UsecaseProxyModule } from './infras/usecase-proxy/usecase-proxy.module';

@Module({
  imports: [
    UsecaseProxyModule.register(),
    ControllerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOModule,
    FixtureModule,
  ],
  controllers: [AddUserController],
  providers: [AddUserUseCase, AddBookUseCase],
  exports: [AddUserUseCase, AddBookUseCase],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly fixtureService: FixtureService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldLoadFixtures =
      this.configService.get('LOAD_FIXTURES', 'false') === true;

    if (shouldLoadFixtures) {
      console.log('🌱 Chargement automatique des fixtures au démarrage...');
      try {
        await this.fixtureService.loadFixtures();
      } catch (error) {
        console.error('❌ Erreur lors du chargement des fixtures:', error);
      }
    } else {
      console.log(
        'ℹ️  Chargement des fixtures désactivé (LOAD_FIXTURES=false)',
      );
    }
  }
}
