import { Schema, Model, model } from 'mongoose'
import { PessoaInterface } from '../interfaces/Pessoa'
import {DeputadoInterface} from '../interfaces/Deputado'

const PessoaSchema = new Schema({
  nome: String,
  dni: String,
  estado: String,
  interesses: String,
  partido: String,
  isDeputado: Boolean
})

export const Pessoa: Model<PessoaInterface> = model<PessoaInterface>(
  'Pessoa',
  PessoaSchema
)
