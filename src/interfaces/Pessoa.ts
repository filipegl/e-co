import { Document } from 'mongoose'
export interface PessoaInterface extends Document {
  nome: string
  dni: string
  senha: string
  estado: string
  interesses: string[]
  partido?: string
  papel?: string
  comparaSenha?: Function
}
