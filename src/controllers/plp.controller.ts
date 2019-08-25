import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createPLP } from '../services/plp.service'

class PLPController {
  public async store (req: Request, res: Response): Promise<Response> {
    const errosValidation = validationResult(req)
    if (!errosValidation.isEmpty()) {
      return res.status(422).json({ errors: errosValidation.array() })
    }
    try {
      const plp = await createPLP(req)
      return res.json(plp)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json(e.error)
    }
  }
}

export default new PLPController()
