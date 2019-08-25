import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createPessoa, getAll, getByDNI } from '../services/pessoa.service'

class PessoaController {
  public async index (req: Request, res: Response): Promise<Response> {
    const { dni } = req.query
    if (dni) {
      try {
        const pessoa = await getByDNI(dni)
        res.json(pessoa)
      } catch (e) {
        console.error(e)
        return res.status(e.status).json(e.error)
      }
    } else {
      const pessoas = await getAll()
      return res.json(pessoas)
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(422).json({ errors: errorsValidation.array() })
    }

    try {
      const pessoa = await createPessoa(req.body)
      return res.json(pessoa)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json(e.error)
    }
  }
}

export default new PessoaController()
