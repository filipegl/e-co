import { Request, Response } from 'express'
import { Pessoa } from '../schemas/Pessoa'
import { validationResult } from 'express-validator'
import { PessoaInterface } from '../interfaces/Pessoa'
import { PEC } from '../schemas/PEC'
import { PECPLPInterface } from '../interfaces/PEC-PLP'

class PECController {
  public async store (req: Request, res: Response): Promise<Response> {
    const errosValidation = validationResult(req)
    if (!errosValidation.isEmpty()) {
      return res.status(422).json({ errors: errosValidation.array() })
    }
    Pessoa.findOne({ dni: req.body.dni }, async function (
      err: Record<string, string>,
      value: PessoaInterface
    ): Promise<Response> {
      if (err) {
        console.log('error', err)
        return res.sendStatus(500)
      } else if (!value) {
        return res.status(422).json({
          error: {
            value: req.body.dni,
            msg: 'Pessoa não existente',
            param: 'dni',
            location: 'body'
          }
        })
      } else if (!value.isDeputado) {
        return res.status(422).json({
          error: {
            value: req.body.isDeputado,
            msg: 'Esta pessoa não é deputado',
            param: 'isDeputado',
            location: 'body'
          }
        })
      } else {
        const qnt = (await PEC.find()).length + 1
        req.body.codigo = 'PEC ' + qnt + '/' + req.body.ano
        const pec = await PEC.create(req.body)
        return res.json(pec)
      }
    })
  }
}

export default new PECController()
