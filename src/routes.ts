import { Router } from 'express'
import PessoaController from './controllers/PessoaController'
import checkRegisterPessoas from './middlewares/checkRegisterPessoa'

const routes = Router()

routes.get('/pessoas', PessoaController.index)
routes.post('/cadastrar-pessoa', checkRegisterPessoas, PessoaController.store)

export default routes
