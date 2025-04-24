import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
import { mock, Mock } from 'ts-jest-mocker';
import { AddUserUseCase } from '../../../../application/usecases/user/adduser/add.user.usecase';
import { InvalidPhoneNumberException } from '../../../../domaine/errors/onlineBook.error';
import { UsersRepository } from '../../../../repositories/user.repository';
import { userDataDto, userDataResponse } from '../../data/userData';

describe('Rule: create user', () => {
  let createUserUseCase: AddUserUseCase;
  let mockUserProvider: Mock<UsersRepository>;
  let mockClientProvider: Mock<NodemailerClient>;
  // private nodemailerClient: NodemailerClient,

  beforeEach(() => {
    mockUserProvider = mock<UsersRepository>();
    mockClientProvider = mock<NodemailerClient>();

    mockUserProvider.signUp.mockImplementation(async () =>
      Promise.resolve(userDataResponse),
    );

    createUserUseCase = new AddUserUseCase(
      mockUserProvider,
      mockClientProvider,
    );
  });

  it('Number should be valide', async () => {
    const result = await createUserUseCase.execute(userDataDto);

    expect(result).toEqual(userDataResponse);
  });

  it('Number should not valide', async () => {
    try {
      await createUserUseCase.execute({
        email: '@test.fr',
        name: 'firstname0',
        phone: '0624552440',
        password: 'test',
      });
    } catch (err) {
      expect(err instanceof InvalidPhoneNumberException).toBeTruthy();
      expect(err.message).toBe("Numero n'est pas valide");
    }
  });
});
