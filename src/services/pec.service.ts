import { Pessoa } from '../models/Pessoa'
import { PessoaInterface } from '../interfaces/Pessoa'
import { PEC } from '../models/PEC'
import { Request } from 'express'
import { PECPLPInterface } from '../interfaces/PEC-PLP'

export async function createPEC (req: Request): Promise<PECPLPInterface> {
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
    const qnt = (await PEC.find()).length + 1
    req.body.codigo = 'PEC ' + qnt + '/' + req.body.ano
    const pl = await PEC.create(req.body)
    return pl
  }
}
