import { check } from 'express-validator'
import checkDNI from './checkDNI'

const checkRegisterPessoas = [
  check('nome')
    .not()
    .isEmpty()
    .withMessage('Nome não pode ser vazio'),
  check('estado')
    .not()
    .isEmpty()
    .withMessage('Estado não pode ser vazio'),
  checkDNI,
  check('senha')
    .not()
    .isEmpty()
    .withMessage('Senha não pode ser vazia')
]

export default checkRegisterPessoas
