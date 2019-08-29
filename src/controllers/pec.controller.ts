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
    const codigo = `PLP ${numero}/${ano}`
    try {
      const proj = await getProjeto(codigo)
      return res.json({ situacao: proj.projeto.situacao })
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }
}

export default new PECController()
