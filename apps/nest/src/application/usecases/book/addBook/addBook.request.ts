export type AddBookRequest = {
  id?: number,
  title: string,
  description: string,
  author: string,
  releaseAt: Date;
  coverUrl: Express.Multer.File,
  userId: number
}
