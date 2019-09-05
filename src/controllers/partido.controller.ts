import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { getPartidos, createPartido } from '../services/partido.service'
class PartidoController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const partidos = await getPartidos()
      return res.json(partidos)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json(e.error)
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(400).json({ errors: errorsValidation.array() })
    }
    try {
      const partido = await createPartido(req.body)
      return res.status(201).json(partido)
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }
}

export default new PartidoController()
