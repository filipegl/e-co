import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createProposicao } from '../services/proposicao.service'

class PLController {
  public async store (req: Request, res: Response): Promise<Response> {
    const errosValidation = validationResult(req)
    if (!errosValidation.isEmpty()) {
      return res.status(422).json({ errors: errosValidation.array() })
    }
    try {
      const pl = await createProposicao(req, 'pl')
      return res.json(pl)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json(e.error)
    }
  }
}

export default new PLController()
