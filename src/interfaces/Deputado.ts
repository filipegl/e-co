import { Document } from 'mongoose'
export interface DeputadoInterface extends Document {
  dni: string
  dataInicio: string
  qntLeis?: number
}
