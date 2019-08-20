import { check } from 'express-validator'

const checkRegisterDeputado = [
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
    .withMessage('DNI deve conter apenas numeros e traços.')
]

export default checkRegisterDeputado
