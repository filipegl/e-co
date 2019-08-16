import { Schema, Model, model } from 'mongoose'
import { DeputadoInterface } from '../interfaces/Deputado'


const DeputadoSchema = new Schema({
    dni: String,
    dataInicio: Date,
    qntLeis: String
})

export const Deputado: Model<DeputadoInterface> = model<DeputadoInterface>(
    'Deputado',
    DeputadoSchema
  )