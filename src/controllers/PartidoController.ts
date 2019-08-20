import { Request, Response } from 'express'
import { Partido } from '../schemas/Partido'
import { validationResult } from 'express-validator'
import { PartidoInterface } from '../interfaces/Partido'

class PartidoController {
  public async index (req: Request, res: Response): Promise<Response> {
    const partidos = await Partido.find()
    const partidosOrdered = partidos.sort((p1, p2): number => {
      if (p1.nome > p2.nome) {
        return 1
      } else if (p1.nome < p2.nome) {
        return -1
      } else {
        return 0
      }
    })
    const formatted = {
      partidos: partidosOrdered
        .map((value: PartidoInterface): string => value.nome)
        .join(', ')
    }
    return res.json(formatted)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(422).json({ errors: errorsValidation.array() })
    }

    Partido.findOne({ nome: req.body.nome }, async function (
      err: Record<string, string>,
      value: PartidoInterface
    ): Promise<Response> {
      if (err) {
        console.log('error', err)
        return res.sendStatus(500)
      } else if (value) {
        return res.status(422).json({
          error: {
            value: value.nome,
            msg: 'Partido já existente',
            param: 'nome',
            location: 'body'
          }
        })
      } else {
        const partido = await Partido.create(req.body)

        return res.json(partido)
      }
    })
  }
}

export default new PartidoController()
