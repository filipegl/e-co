import { Router } from 'express'
import PessoaController from './controllers/PessoaController'
import DeputadoController from './controllers/DeputadoController'
import checkRegisterPessoas from './middlewares/checkRegisterPessoa'

const routes = Router()

routes.get('/pessoas', PessoaController.index)
routes.post('/cadastrar-pessoa', checkRegisterPessoas, PessoaController.store)
routes.post('/cadastrar-deputado', DeputadoController.store)

export default routes
