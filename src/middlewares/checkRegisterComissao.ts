import { check } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

const autenticacao = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { dni, papel } = res.locals.jwtPayload
  if (papel !== 'admin' || dni !== req.body.dni) {
    res.status(401).send({
      error: {
        msg: 'Não autorizado',
        value: req.body.dni
      }
    })
    return
  }
  next()
}

const checkRegisterComissao = [
  check('tema')
    .not()
    .isEmpty()
    .withMessage('Tema não pode ser vazio'),
  check('politicos')
    .not()
    .isEmpty()
    .withMessage('Politicos não pode ser vazio')
    .custom((value: string): boolean => {
      var ret = true
      value.split(',').forEach((element: string): void => {
        if (!element.match(/^(\d)+-(\d)+$/)) {
          ret = false
        }
      })
      return ret
    })
    .withMessage('DNI deve conter apenas numeros e traços.'),
  autenticacao
]

export default checkRegisterComissao
