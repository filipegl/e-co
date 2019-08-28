import { Schema, Model, model } from 'mongoose'
import { DeputadoInterface } from '../interfaces/Deputado'

const DeputadoSchema = new Schema({
  dni: String,
  dataInicio: String,
  qntLeis: Number
})

export const Deputado: Model<DeputadoInterface> = model<DeputadoInterface>(
  'Deputado',
  DeputadoSchema
)
