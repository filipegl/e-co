import { Router } from 'express'
import checkRegisterPessoas from '../middlewares/checkRegisterPessoa'
import PessoaController from '../controllers/pessoa.controller'
import apicache from 'apicache'

const routes = Router()
const cache = apicache.middleware

routes.get('/', cache('5minutes'), PessoaController.index)
routes.get('/:dni', cache('5 minutes'), PessoaController.show)
routes.post('/', checkRegisterPessoas, PessoaController.store)

export default routes
