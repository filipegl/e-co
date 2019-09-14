import { Router } from 'express'
import checkRegisterDeputado from '../middlewares/checkRegisterDeputado'
import DeputadoController from '../controllers/deputado.controller'
import { checkJwt } from '../middlewares/checkJWT'
const routes = Router()

routes.post('/', [checkJwt, ...checkRegisterDeputado], DeputadoController.store)

export default routes
