import { Router } from 'express'
import checkRegisterComissao from '../middlewares/checkRegisterComissao'
import ComissaoController from '../controllers/comissao.controller'
import { checkJwt } from '../middlewares/checkJWT'

const routes = Router()

routes.get('/', ComissaoController.index)
routes.post('/', [checkJwt, ...checkRegisterComissao], ComissaoController.store)

export default routes
