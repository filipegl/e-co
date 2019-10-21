import { Router } from 'express'
import checkRegisterComissao from '../middlewares/checkRegisterComissao'
import ComissaoController from '../controllers/comissao.controller'
import { checkJwt } from '../middlewares/checkJWT'
import apicache from 'apicache'

const routes = Router()
const cache = apicache.middleware

routes.get('/', cache('5 minutes'), ComissaoController.index)
routes.post('/', [checkJwt, ...checkRegisterComissao], ComissaoController.store)

export default routes
