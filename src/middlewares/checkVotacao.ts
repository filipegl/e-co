import { check } from 'express-validator'

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
    .withMessage('statusGovernista deve ser GOVERNISTA, OPOSICAO ou LIVRE')
]

export default checkRegisterPL
