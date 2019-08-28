import { Document } from 'mongoose'

export interface PropostaLegislativaInterface extends Document {
  dni: string
  ano: number
  codigo: string
  ementa: string
  interesses: string[]
  situacao: string
  url: string
}
