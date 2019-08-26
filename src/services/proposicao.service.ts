import { Pessoa } from '../models/pessoa.model'
import { PessoaInterface } from '../interfaces/Pessoa'
import { PLP } from '../models/plp.model'
import { PEC } from '../models/pec.model'
import { PL } from '../models/pl.model'
import { Request } from 'express'
import { PECPLPInterface } from '../interfaces/PEC-PLP'

export async function createProposicao (
  req: Request,
  proposicao: string
): Promise<PECPLPInterface> {
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
    var propos = null
    var qnt = 0
    switch (proposicao) {
      case 'plp':
        qnt = (await PLP.find()).length + 1
        req.body.codigo = 'PLP ' + qnt + '/' + req.body.ano
        propos = await PLP.create(req.body)
        break
      case 'pec':
        qnt = (await PEC.find()).length + 1
        req.body.codigo = 'PLP ' + qnt + '/' + req.body.ano
        propos = await PEC.create(req.body)
        break
      default:
        qnt = (await PL.find()).length + 1
        req.body.codigo = 'PLP ' + qnt + '/' + req.body.ano
        propos = await PL.create(req.body)
        break
    }

    return propos
  }
}
