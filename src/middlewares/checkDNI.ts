import { check } from 'express-validator'

const checkDNI = [
  check('dni')
    .not()
    .isEmpty()
    .withMessage('DNI não pode ser vazia')
    .matches(/^(\d)+-(\d)+$/)
    .withMessage('DNI deve conter apenas numeros e traços.')
]

export default checkDNI
