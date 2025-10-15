import { ApiProperty } from '@nestjs/swagger';

export class GetBooksByNameDTO {
  @ApiProperty({
    description: 'Identifiant unique du livre',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Titre du livre',
    example: 'Le Petit Prince',
  })
  title: string;

  @ApiProperty({
    description: 'Description du livre',
    example:
      'Un conte poétique et philosophique sur l’amitié et la découverte.',
  })
  description: string;

  @ApiProperty({
    description: "Nom de l'auteur du livre",
    example: 'Antoine de Saint-Exupéry',
  })
  author: string;

  @ApiProperty({
    description: 'Date de publication du livre',
    example: '1943-04-06T00:00:00.000Z',
  })
  releaseAt: Date;

  @ApiProperty({
    description: 'URL de la couverture du livre',
    example: 'https://example.com/covers/le-petit-prince.jpg',
  })
  coverUrl: string;

  @ApiProperty({
    description: "Identifiant de l'utilisateur ayant créé le livre",
    example: 5,
  })
  userId: number;
}
