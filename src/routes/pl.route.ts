import { Router } from 'express'
import checkRegisterPL from '../middlewares/checkRegisterPL'
import PLController from '../controllers/pl.controller'

const routes = Router()

routes.post('/', checkRegisterPL, PLController.store)
routes.get('/:numero/:ano', PLController.show)
routes.get('/:numero/:ano/tramitacao', PLController.getTramitacao)
export default routes
