import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createPessoa, getAll, getByDNI } from '../services/pessoa.service'

class PessoaController {
  public async show (req: Request, res: Response): Promise<Response> {
    const { dni } = req.params
    try {
      const pessoa = await getByDNI(dni)
      res.json({ pessoa: pessoa.string })
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }
  public async index (req: Request, res: Response): Promise<Response> {
    const pessoas = await getAll()
    return res.json(pessoas)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(400).json({ errors: errorsValidation.array() })
    }

    try {
      const pessoa = await createPessoa(req)
      return res.status(201).json(pessoa)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }
}

export default new PessoaController()
