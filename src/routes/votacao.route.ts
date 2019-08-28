import { Router } from 'express'
import checkVotacao from '../middlewares/checkVotacao'
import VotacaoController from '../controllers/votacao.controller'

const routes = Router()

routes.post('/', checkVotacao, VotacaoController.store)

export default routes
