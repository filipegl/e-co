import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createPEC } from '../services/pec.service'

class PECController {
  public async store (req: Request, res: Response): Promise<Response> {
    const errosValidation = validationResult(req)
    if (!errosValidation.isEmpty()) {
      return res.status(422).json({ errors: errosValidation.array() })
    }
    try {
      const pec = await createPEC(req)
      return res.json(pec)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json(e.error)
    }
  }
}

export default new PECController()
