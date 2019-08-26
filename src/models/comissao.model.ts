import { Schema, Model, model } from 'mongoose'
import { ComissaoInterface } from '../interfaces/Comissao'

const ComissaoSchema = new Schema({
  tema: String,
  politicos: [String]
})

export const Comissao: Model<ComissaoInterface> = model<ComissaoInterface>(
  'Comissao',
  ComissaoSchema
)
