import { Schema, Model, model } from 'mongoose'
import { PECPLPInterface } from '../interfaces/PEC-PLP'

const PECSchema = new Schema({
  dni: String,
  ano: Number,
  codigo: String,
  ementa: String,
  interesses: [String],
  situacao: String,
  url: String,
  artigos: String
})

export const PEC: Model<PECPLPInterface> = model<PECPLPInterface>(
  'PEC',
  PECSchema
)
