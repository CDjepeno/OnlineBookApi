export type AddBookRequest = {
  id?: number,
  name: string,
  description: string,
  author: string,
  releaseAt: Date;
  coverUrl: Express.Multer.File,
  userId: number
}
