import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createProposicao } from '../services/proposicao.service'

class PECController {
  public async store (req: Request, res: Response): Promise<Response> {
    const errosValidation = validationResult(req)
    if (!errosValidation.isEmpty()) {
      return res.status(422).json({ errors: errosValidation.array() })
    }
    try {
      const pec = await createProposicao(req, 'pec')
      return res.json(pec)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json(e.error)
    }
  }
}

export default new PECController()
