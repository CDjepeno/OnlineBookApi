export type GetBookResponse = {
  id?: number,
  name: string,
  description: string,
  author: string,
  releaseAt: Date,
  coverUrl: string,
  created_at?: Date,
  update_at?: Date
}
