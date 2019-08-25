import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { getAll, createComissao } from '../services/comissao.service'

class ComissaoController {
  public async index (req: Request, res: Response): Promise<Response> {
    const comissoes = await getAll()
    return res.json(comissoes)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(422).json({ errors: errorsValidation.array() })
    }
    try {
      const comissao = await createComissao(req)
      return res.json(comissao)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json(e.error)
    }
  }
}

export default new ComissaoController()
