import { Document } from 'mongoose'
export interface PessoaInterface extends Document {
  nome: string
  dni: string
  estado: string
  interesses: string[]
  partido?: string
  isDeputado?: boolean
}
