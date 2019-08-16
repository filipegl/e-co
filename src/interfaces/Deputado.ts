import { Document } from 'mongoose'
export interface DeputadoInterface extends Document {
  dni: String,
  dataInicio: Date,
  qntLeis?: String
}