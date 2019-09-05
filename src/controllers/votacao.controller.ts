import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { votar } from '../services/votacao.service'

class VotacaoController {
  public async store (req: Request, res: Response): Promise<Response> {
    const errosValidation = validationResult(req)
    if (!errosValidation.isEmpty()) {
      return res.status(400).json({ errors: errosValidation.array() })
    }
    try {
      const result = await votar(req)
      return res.json(result)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }
}

export default new VotacaoController()
