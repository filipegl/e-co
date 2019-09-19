import { check } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

const autenticacao = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { dni, papel } = res.locals.jwtPayload
  if (papel !== 'admin') {
    res.status(401).send({
      error: {
        msg: 'Não autorizado',
        value: dni
      }
    })
    return
  }
  next()
}

const checkRegisterPartidos = [
  check('nome')
    .not()
    .isEmpty()
    .withMessage('Nome não pode ser vazio ou nulo'),
  autenticacao
]

export default checkRegisterPartidos
