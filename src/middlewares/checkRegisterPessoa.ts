import { check } from 'express-validator'

const checkRegisterPessoas = [
  check('nome')
    .not()
    .isEmpty()
    .withMessage('Nome não pode ser vazio'),
  check('estado')
    .not()
    .isEmpty()
    .withMessage('Estado não pode ser vazio'),
  check('dni')
    .not()
    .isEmpty()
    .withMessage('DNI não pode ser vazia')
    .matches(/^(\d)+-(\d)+$/)
    .withMessage('DNI deve conter apenas numeros e traços.')
]

export default checkRegisterPessoas
