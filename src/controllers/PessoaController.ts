import { Request, Response } from 'express'
import { Pessoa } from '../schemas/Pessoa'
import { Deputado } from '../schemas/Deputado'
import { validationResult } from 'express-validator'
import { PessoaInterface } from '../interfaces/Pessoa'
import { DeputadoInterface } from '../interfaces/Deputado'

class PessoaController {
  public async index (req: Request, res: Response): Promise<Response> {
    const pessoas = await Pessoa.find()
    return res.json(pessoas)
  }

  public async getPessoa (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(422).json({ errors: errorsValidation.array() })
    }

    Pessoa.findOne({ dni: req.body.dni }, async function (
      err: Record<string, string>,
      value: PessoaInterface
    ): Promise<Response> {
      if (err) {
        console.log('error', err)
        return res.sendStatus(500)
      } else if (value) {
        if (value.isDeputado) {
          Deputado.findOne({ dni: value.dni }, function (
            err: Record<string, string>,
            dep: DeputadoInterface
          ): Response {
            if (err) {
              console.log('error', err)
              return res.sendStatus(500)
            } else if (dep) {
              return res.json({
                pessoa: `POL: ${value.nome} - ${value.dni} (${value.estado}) - ${value.partido} - Interesses: ${value.interesses} - ${dep.dataInicio} - ${dep.qntLeis} Leis`
              })
            }
          })
        } else {
          return res.json({
            pessoa: `${value.nome} - ${value.dni} (${value.estado}) - ${
              value.partido ? value.partido : 'sem partido'
            } - Interesses: ${value.interesses}`
          })
        }
      } else {
        return res.status(422).json({
          error: {
            value: req.body.dni,
            msg: 'Esta pessoa não existe no sistema',
            param: 'dni',
            location: 'body'
          }
        })
      }
    })
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(422).json({ errors: errorsValidation.array() })
    }

    Pessoa.findOne({ dni: req.body.dni }, async function (
      err: Record<string, string>,
      value: PessoaInterface
    ): Promise<Response> {
      if (err) {
        console.log('error', err)
        return res.sendStatus(500)
      } else if (value) {
        return res.status(422).json({
          error: {
            value: value.dni,
            msg: 'DNI já existente',
            param: 'dni',
            location: 'body'
          }
        })
      } else {
        req.body.isDeputado = false
        const pessoa = await Pessoa.create(req.body)

        return res.json(pessoa)
      }
    })
  }
}

export default new PessoaController()
