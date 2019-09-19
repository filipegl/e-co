import jwt from 'jsonwebtoken'
import { PessoaInterface } from '../interfaces/Pessoa'
import { Pessoa } from '../models/pessoa.model'

export function generateToken (pessoa: PessoaInterface): string {
  const { dni, nome, estado, partido, isDeputado, papel } = pessoa
  return jwt.sign(
    { dni, nome, estado, partido, isDeputado, papel },
    process.env.JWT_SECRET,
    { subject: dni, expiresIn: '1h' }
  )
}
export async function signin (body: Record<string, string>): Promise<string> {
  const pessoa = await Pessoa.findOne({ dni: body.dni }).catch(
    (err: Record<string, string>): Promise<PessoaInterface> => {
      err.status = '500'
      throw err
    }
  )

  if (!pessoa) {
    const e = {
      error: {
        value: { dni: body.dni, senha: body.senha },
        msg: 'DNI ou senha inválidos',
        param: '{ dni, senha }',
        location: 'body'
      },
      status: 401
    }
    throw e
  }

  const isMatch = pessoa.comparaSenha(body.senha)

  if (isMatch) return generateToken(pessoa)

  const e = {
    error: {
      value: { dni: body.dni, senha: body.senha },
      msg: 'DNI ou senha inválidos',
      param: '{ dni, senha }',
      location: 'body'
    },
    status: 401
  }
  throw e
}
