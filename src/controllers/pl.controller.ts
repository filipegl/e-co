import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createProposicao, getProjeto } from '../services/proposicao.service'

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
      return res.status(e.status).json({ error: e.error })
    }
  }

  public async index (req: Request, res: Response): Promise<Response> {
    const { codigo } = req.query
    try {
      const projeto = await getProjeto(codigo)
      return res.json({ projeto: projeto.string })
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }

  public async getTramitacao (req: Request, res: Response): Promise<Response> {
    const { codigo } = req.query
    try {
      const proj = await getProjeto(codigo)
      return res.json({ situacao: proj.projeto.situacao })
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }
}

export default new PLController()
