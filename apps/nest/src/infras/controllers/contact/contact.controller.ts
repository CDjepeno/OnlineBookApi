import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactUseCase } from 'src/application/usecases/contact/contact.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { ContactDto } from './contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(
    @Inject(UsecaseProxyEnum.CONTACT_USECASE_PROXY)
    private readonly contactUsecaseProxy: UseCaseProxy<ContactUseCase>,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Booking Book',
  })
  async bookingBook(@Body() contactDto: ContactDto) {
    return await this.contactUsecaseProxy.getInstance().execute(contactDto);
  }
}
