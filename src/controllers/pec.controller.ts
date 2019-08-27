import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createProposicao, getProjeto } from '../services/proposicao.service'

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

  public async index (req: Request, res: Response): Promise<Response> {
    const { codigo } = req.query
    try {
      const projeto = await getProjeto(codigo, codigo.substring(0, 3))
      return res.json(projeto)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json(e.error)
    }
  }
}

export default new PECController()
