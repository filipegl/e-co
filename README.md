# E-Camara Organizada (E-CO)

## Como rodar na sua máquina

### Observações

A aplicação está configurada para rodar na porta 3333

#### Banco de dados: MongoDB

- Instale o [MongoDB](https://docs.mongodb.com/manual/installation/#tutorial-installation)
- Deixe-o [rodando](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/#start-mongod-processes) localmente em [localhost:27017](http://www.localhost:27017/) (padrão)
  - Para isso, abra o terminal e digite `service mongod start`

### Execução

1. Após iniciar o banco de dados, digite o comando `yarn` na pasta principal para instalar as dependências.
2. Digite `yarn start` para iniciar a aplicação.
3. Faça requisições em [localhost:3333](http://www.localhost:3333/)

Para testar, importe o arquivo [files/daca19.2.postman_collection.json](https://github.com/filipegl/e-co/blob/master/files/daca19.2.postman_collection.json) no postman.
