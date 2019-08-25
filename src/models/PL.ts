import { Schema, Model, model } from 'mongoose'
import { PLInterface } from '../interfaces/PL'

const PLSchema = new Schema({
  dni: String,
  ano: Number,
  codigo: String,
  ementa: String,
  interesses: String,
  situacao: String,
  url: String,
  conclusivo: Boolean
})

export const PL: Model<PLInterface> = model<PLInterface>(
  'PL',
  PLSchema
)
