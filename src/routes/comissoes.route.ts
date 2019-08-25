import { Router } from 'express'
import checkRegisterComissao from '../middlewares/checkRegisterComissao'
import ComissaoController from '../controllers/comissao.controller'

const routes = Router()

routes.get('/', ComissaoController.index)
routes.post('/', checkRegisterComissao, ComissaoController.store)

export default routes
