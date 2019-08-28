import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createDeputado } from '../services/deputado.service'

class DeputadoController {
  public async store (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(422).json({ errors: errorsValidation.array() })
    }
    try {
      const deputado = await createDeputado(req.body)
      return res.json(deputado)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }
}

export default new DeputadoController()
