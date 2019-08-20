import { Request, Response } from 'express'
import { Comissao } from '../schemas/Comissao'
import { validationResult } from 'express-validator'
import { ComissaoInterface } from '../interfaces/Comissao'
import { PessoaInterface } from '../interfaces/Pessoa'
import { Pessoa } from '../schemas/Pessoa'

class ComissaoController {
  public async index (req: Request, res: Response): Promise<Response> {
    const comissao = await Comissao.find()
    return res.json(comissao)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(422).json({ errors: errorsValidation.array() })
    }

    Comissao.findOne({ tema: req.body.tema }, async function (
      err: Record<string, string>,
      value: ComissaoInterface
    ): Promise<Response> {
      if (err) {
        console.log('error', err)
        return res.sendStatus(500)
      } else if (value) {
        return res.status(422).json({
          error: {
            value: value.tema,
            msg: 'Tema já existente',
            param: 'nome',
            location: 'body'
          }
        })
      } else {
        req.body.politicos = req.body.politicos.split(',')
        var create = true
        for (const i in req.body.politicos) {
          const dni = req.body.politicos[i]
          await Pessoa.findOne({ dni }, async function (
            err: Record<string, string>,
            value: PessoaInterface
          ): Promise<Response> {
            if (err) {
              console.log('error', err)
              create = false
              return res.sendStatus(500)
            } else if (!value) {
              create = false
              return res.status(422).json({
                error: {
                  value: req.body.dni,
                  msg: 'DNI não cadastrado',
                  param: 'dni',
                  location: 'body'
                }
              })
            } else if (!value.isDeputado) {
              create = false
              return res.status(422).json({
                error: {
                  value: value.dni,
                  msg: 'DNI de pessoa que não é política.',
                  location: 'body'
                }
              })
            }
          })
        }
        if (create) {
          const comissao = await Comissao.create(req.body)
          return res.json(comissao)
        }
      }
    })
  }
}

export default new ComissaoController()
