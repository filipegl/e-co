import { Router } from 'express'
import checkVotacao from '../middlewares/checkVotacao'
import VotacaoController from '../controllers/votacao.controller'
import { checkJwt } from '../middlewares/checkJWT'

const routes = Router()

routes.post('/', [checkJwt, ...checkVotacao], VotacaoController.store)

export default routes
