import { check } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

const autorizacao = (
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

const checkRegisterPL = [
  check('codigo')
    .not()
    .isEmpty()
    .withMessage('código não pode ser vazio'),
  check('statusGovernista')
    .not()
    .isEmpty()
    .withMessage('statusGovernista não pode ser vazio')
    .custom(
      (value: string): boolean =>
        value === 'GOVERNISTA' || value === 'OPOSICAO' || value === 'LIVRE'
    )
    .withMessage('statusGovernista deve ser GOVERNISTA, OPOSICAO ou LIVRE'),
  autorizacao
]

export default checkRegisterPL
