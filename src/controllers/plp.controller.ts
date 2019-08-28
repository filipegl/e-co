import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createProposicao, getProjeto } from '../services/proposicao.service'

class PLPController {
  public async store (req: Request, res: Response): Promise<Response> {
    const errosValidation = validationResult(req)
    if (!errosValidation.isEmpty()) {
      return res.status(422).json({ errors: errosValidation.array() })
    }
    try {
      const plp = await createProposicao(req, 'plp')
      return res.json(plp)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }

  public async index (req: Request, res: Response): Promise<Response> {
    const { codigo } = req.body
    try {
      const projeto = await getProjeto(codigo)
      return res.json({ projeto: projeto.string })
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }
}

export default new PLPController()
