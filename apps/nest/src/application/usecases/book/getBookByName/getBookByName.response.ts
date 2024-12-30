export type GetBookByNameResponse = {
  id?: number,
  name: string,
  description: string,
  author: string,
  releaseAt: Date,
  coverUrl: string,
  created_at?: Date,
  update_at?: Date
}
