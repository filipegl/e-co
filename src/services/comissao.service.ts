import { Pessoa } from '../models/pessoa.model'
import { Comissao } from '../models/comissao.model'
import { PessoaInterface } from '../interfaces/Pessoa'
import { ComissaoInterface } from '../interfaces/Comissao'
import { Request } from 'express'

export async function createComissao (req: Request): Promise<ComissaoInterface> {
  const comissao = await Comissao.findOne({ tema: req.body.tema }).catch(
    (err: Record<string, string>): Promise<ComissaoInterface> => {
      err.status = '500'
      throw err
    }
  )

  if (comissao) {
    const e = {
      error: {
        value: comissao.tema,
        msg: 'Tema já existente',
        param: 'dni',
        location: 'body'
      },
      status: 422
    }
    throw e
  } else {
    req.body.politicos = req.body.politicos.split(',')
    var create = true
    for (const i in req.body.politicos) {
      const dni = req.body.politicos[i]
      const pessoa = await Pessoa.findOne({ dni }).catch(
        (err: Record<string, string>): Promise<PessoaInterface> => {
          err.status = '500'
          throw err
        }
      )
      if (!pessoa) {
        create = false

        const e = {
          error: {
            value: dni,
            msg: 'DNI não cadastrado',
            param: 'dni',
            location: 'body'
          },
          status: 422
        }
        throw e
      } else if (!pessoa.isDeputado) {
        create = false
        const e = {
          error: {
            value: dni,
            msg: 'DNI de pessoa que não é política.',
            location: 'body'
          },
          status: 422
        }
        throw e
      }
    }
    if (create) {
      const comissao = await Comissao.create(req.body)
      return comissao
    }
  }
}

export async function getAll (): Promise<ComissaoInterface[]> {
  return Comissao.find()
}

export async function getByTema (tema: string): Promise<ComissaoInterface> {
  return Comissao.findOne({ tema })
}
