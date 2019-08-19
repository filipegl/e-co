import { Schema, Model, model } from 'mongoose'
import { PartidoInterface } from '../interfaces/Partido'

const PartidoSchema = new Schema({
  nome: String
})

export const Partido: Model<PartidoInterface> = model<PartidoInterface>(
  'Partido',
  PartidoSchema
)