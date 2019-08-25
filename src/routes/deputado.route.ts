import { Router } from 'express'
import checkRegisterDeputado from '../middlewares/checkRegisterDeputado'
import DeputadoController from '../controllers/deputado.controller'

const routes = Router()

routes.post('/', checkRegisterDeputado, DeputadoController.store)

export default routes
