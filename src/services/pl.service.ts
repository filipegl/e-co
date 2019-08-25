import { Pessoa } from '../models/Pessoa'
import { PessoaInterface } from '../interfaces/Pessoa'
import { PL } from '../models/PL'
import { Request } from 'express'
import { PLInterface } from '../interfaces/PL'

export async function createPL (req: Request): Promise<PLInterface> {
  const pessoa = await Pessoa.findOne({ dni: req.body.dni }).catch(
    (err: Record<string, string>): Promise<PessoaInterface> => {
      err.status = '500'
      throw err
    }
  )

  if (!pessoa) {
    const e = {
      error: {
        value: req.body.dni,
        msg: 'Pessoa não existente',
        param: 'dni',
        location: 'body'
      },
      status: 422
    }
    throw e
  } else if (!pessoa.isDeputado) {
    const e = {
      error: {
        value: req.body.isDeputado,
        msg: 'Esta pessoa não é deputado',
        param: 'isDeputado',
        location: 'body'
      },
      status: 422
    }
    throw e
  } else {
    const qnt = (await PL.find()).length + 1
    req.body.codigo = 'PL ' + qnt + '/' + req.body.ano
    const pl = await PL.create(req.body)
    return pl
  }
}
