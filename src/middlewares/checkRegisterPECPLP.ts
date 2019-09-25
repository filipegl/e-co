import { check } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import checkDNI from './checkDNI'

const autorizacao = (req: Request, res: Response, next: NextFunction): void => {
  const { dni, papel } = res.locals.jwtPayload
  if (papel === 'comum' || dni !== req.body.dni) {
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

const checkRegisterPECPLP = [
  checkDNI,
  check('ementa')
    .not()
    .isEmpty()
    .withMessage('ementa não pode ser vazio'),
  check('interesses')
    .not()
    .isEmpty()
    .withMessage('interesses não pode ser vazio'),
  check('url')
    .not()
    .isEmpty()
    .withMessage('url não pode ser vazio'),
  check('artigos')
    .not()
    .isEmpty()
    .withMessage('artigos não pode ser vazio'),
  check('ano')
    .not()
    .isEmpty()
    .custom((value: number): boolean => {
      const year = new Date()
      var ret = true
      if (value < 1988 || value > year.getFullYear()) {
        ret = false
      }
      return ret
    })
    .withMessage('Ano não pode ser anterior a 1988 ou posterior ao ano atual'),
  autorizacao
]

export default checkRegisterPECPLP
