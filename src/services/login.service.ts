import jwt from 'jsonwebtoken'
import { PessoaInterface } from '../interfaces/Pessoa'
import { Pessoa } from '../models/pessoa.model'

export function generateToken (pessoa: PessoaInterface): string {
  const { dni, nome, estado, partido, isDeputado } = pessoa
  return jwt.sign(
    { dni, nome, estado, partido, isDeputado },
    process.env.JWT_SECRET,
    { subject: pessoa.dni, expiresIn: 7 * 24 * 60 * 60 } // 7 dias (em segundos)
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
