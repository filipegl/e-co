import bcrypt from 'bcrypt'
import { Schema, Model, model } from 'mongoose'
import { PessoaInterface } from '../interfaces/Pessoa'

const SALT_WORK_FACTOR = 10

const PessoaSchema = new Schema<PessoaInterface>({
  nome: String,
  dni: String,
  senha: String,
  estado: String,
  interesses: [String],
  partido: String,
  papel: String
})

PessoaSchema.pre('save', function (next): void {
  var user = this
  if (!user.isModified('senha')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt): void {
    if (err) return next(err)
    // @ts-ignore: Unreachable code error
    bcrypt.hash(user.senha, salt, function (err, hash): void {
      if (err) return next(err)
      // @ts-ignore: Unreachable code error
      user.senha = hash
      next()
    })
  })
})

PessoaSchema.methods.comparaSenha = function (
  candidatePassword: string
): boolean {
  return bcrypt.compareSync(candidatePassword, this.senha)
}

export const Pessoa: Model<PessoaInterface> = model<PessoaInterface>(
  'Pessoa',
  PessoaSchema
)
