import { Request, Response } from 'express'
import { Pessoa } from '../schemas/Pessoa'
import { validationResult } from 'express-validator'
import { PessoaInterface } from '../interfaces/Pessoa'

class PessoaController {
  public async index (req: Request, res: Response): Promise<Response> {
    const pessoas = await Pessoa.find()

    return res.json(pessoas)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(422).json({ errors: errorsValidation.array() })
    }

    Pessoa.findOne({ dni: req.body.dni }, async function (
      err: Object,
      value: PessoaInterface
    ) {
      if (err) {
        console.log('error', err)
        return res.sendStatus(500)
      } else if (value) {
        return res.status(422).json({
          error: {
            value: value.dni,
            msg: 'DNI já existente',
            param: 'dni',
            location: 'body'
          }
        })
      } else {
        const pessoa = await Pessoa.create(req.body)

        return res.json(pessoa)
      }
    })
  }
}

export default new PessoaController()
