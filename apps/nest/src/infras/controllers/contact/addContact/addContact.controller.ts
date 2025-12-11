import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddContactUseCase } from 'src/domaine/contact/usecases/addContact/addContact.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { AddContactDto } from './addContact.dto';

@ApiTags('Contact')
@Controller('contact')
export class AddContactController {
  constructor(
    @Inject(UsecaseProxyModule.ADD_CONTACT_USECASE_PROXY)
    private readonly addContactUsecaseProxy: UseCaseProxy<AddContactUseCase>,
  ) {}

  @ApiOperation({
    summary: 'Envoyer message de contact',
  })
  @ApiBody({
    description: 'Données nécessaires pour envoyer un message de contact',
    type: AddContactDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Message enregistré et email de confirmation envoyé.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation (champs manquants ou invalides)',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne du serveur lors de l’envoi du message',
  })
  @Post()
  async Addcontact(@Body() addContactDto: AddContactDto) {
    const result = await this.addContactUsecaseProxy
      .getInstance()
      .execute(addContactDto);
    return { data: result };
  }
}
