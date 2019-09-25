import { check } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

function changeToISO8601 (value: string): string {
  const dia = value.substring(0, 2)
  const mes = value.substring(2, 4)
  const ano = value.substring(4, 8)

  return `${ano}-${mes}-${dia}`
}

const autorizacao = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { dni } = res.locals.jwtPayload
  if (dni !== req.body.dni) {
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

const checkRegisterDeputado = [
  check('dni')
    .not()
    .isEmpty()
    .withMessage('DNI não pode ser vazia')
    .matches(/^(\d)+-(\d)+$/)
    .withMessage('DNI deve conter apenas numeros e traços.'),
  check('dataInicio')
    .not()
    .isEmpty()
    .withMessage('Estado não pode ser vazio')
    .matches(/^(\d){8}$/)
    .withMessage('Deve estar no formato DDMMYYYY')
    .custom(
      (value: string): boolean =>
        Date.now() - Date.parse(changeToISO8601(value)) > 0
    )
    .withMessage('Data de início não pode estar no futuro'),
  autorizacao
]

export default checkRegisterDeputado
