import { check } from 'express-validator'

const checkRegisterPartidos = [
  check('nome')
    .not()
    .isEmpty()
    .withMessage('Nome não pode ser vazio ou nulo')
]

export default checkRegisterPartidos