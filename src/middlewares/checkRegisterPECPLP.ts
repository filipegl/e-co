import { check } from 'express-validator'

const checkRegisterPECPLP = [
  check('dni')
    .not()
    .isEmpty()
    .withMessage('dni não pode ser vazio ou nulo')
    .matches(/^(\d)+-(\d)+$/)
    .withMessage('DNI deve conter apenas numeros e traços.'),
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
    .withMessage('undefined')
]

export default checkRegisterPECPLP
