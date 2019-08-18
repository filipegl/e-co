import { Document } from 'mongoose'
export interface DeputadoInterface extends Document {
  dni: string
  dataInicio: Date
  qntLeis?: string
}
