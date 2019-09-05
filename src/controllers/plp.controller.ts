import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createProposicao, getProjeto } from '../services/proposicao.service'

class PLPController {
  public async store (req: Request, res: Response): Promise<Response> {
    const errosValidation = validationResult(req)
    if (!errosValidation.isEmpty()) {
      return res.status(400).json({ errors: errosValidation.array() })
    }
    try {
      const plp = await createProposicao(req, 'plp')
      return res.status(201).json(plp)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    const { ano, numero } = req.params
    const codigo = `PLP ${numero}/${ano}`
    try {
      const projeto = await getProjeto(codigo)
      return res.json({ projeto: projeto.string })
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }

  public async getTramitacao (req: Request, res: Response): Promise<Response> {
    const { ano, numero } = req.params
    const codigo = `PL ${numero}/${ano}`
    try {
      const proj = await getProjeto(codigo)
      return res.json({ situacao: proj.projeto.situacao })
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }
}

export default new PLPController()
