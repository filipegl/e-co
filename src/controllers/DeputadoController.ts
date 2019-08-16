import { Request, Response } from 'express'
import { Pessoa } from '../schemas/Pessoa'
import { Deputado } from '../schemas/Deputado'
import { validationResult } from 'express-validator'
import { PessoaInterface } from '../interfaces/Pessoa'
import { DeputadoInterface } from '../interfaces/Deputado'

class DeputadoController {
    public async store (req: Request, res: Response): Promise<Response> {
    const errorsValidation = validationResult(req)
    if (!errorsValidation.isEmpty()) {
      return res.status(422).json({ errors: errorsValidation.array() })
    }
      Pessoa.findOne({ dni: req.body.dni }, async function (
        err: Object,
        value: PessoaInterface
      ) {
        if (err) {
          console.log('error', err)
          return res.sendStatus(500)
        } else if (!value) {
          return res.status(422).json({
            error: {
              value: value.dni,
              msg: 'DNI não cadastrado',
              param: 'dni',
              location: 'body'
            }
          })
        } else if(value.isDeputado){
          return res.status(422).json({
            error: {
              value: value.dni,
              msg: 'Deputado já cadastrado.',
              location: 'body'
            }
          })
        } else if(!value.partido){
          return res.status(422).json({
            error: {
              value: value.dni,
              msg: 'Usuário sem partido não pode ser deputado.',
              location: 'body'
            }
          })
        } else {
            const dni = req.body.dni
            const pessoa = await Pessoa.update({dni}, {isDeputado: true})
            req.body.qntLeis = 0
            const deputado = await Deputado.create(req.body)
            return res.json(deputado)
        }
      })
    }
  }
  
  export default new DeputadoController()
  