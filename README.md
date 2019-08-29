# E-Camara Organizada (E-CO)

O projeto **E-Camara Organizada** ou **E-CO** é uma API REST que está sendo implementada com **Node.js** e **Typescript** de acordo com [estas especificações](https://docs.google.com/document/d/e/2PACX-1vRMP1dmmr6DpXQECabYiR_pboa4P_XiXEywRX_wntWL0ego4KHlH25_Vsv0HB0_Io4nXn4lNI0eEaXU/pub).

- [E-Camara Organizada (E-CO)](#e-camara-organizada-e-co)
  - [Como rodar na sua máquina](#como-rodar-na-sua-m%c3%a1quina)
    - [Banco de dados: MongoDB](#banco-de-dados-mongodb)
    - [Execução](#execu%c3%a7%c3%a3o)
  - [Documentação](#documenta%c3%a7%c3%a3o)
    - [Arquitetura](#arquitetura)
  - [Licença](#licen%c3%a7a)

## Como rodar na sua máquina

A aplicação está configurada para rodar na porta 3333.

### Banco de dados: MongoDB

- Instale o [MongoDB](https://docs.mongodb.com/manual/installation/#tutorial-installation)
- Deixe-o [rodando](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/#start-mongod-processes) localmente em [localhost:27017](http://www.localhost:27017/) (padrão)

### Execução

1. Após iniciar o banco de dados, digite o comando `yarn` na pasta principal para instalar as dependências.
2. Digite `yarn start` para iniciar a aplicação.
3. Faça requisições em [localhost:3333](http://www.localhost:3333/)

Para testar, importe o arquivo [files/daca19.2.postman_collection.json](https://github.com/filipegl/e-co/blob/master/files/daca19.2.postman_collection.json) no postman.

## Documentação

|          Rota           | Descrição                                                                                      |
| :---------------------: | :--------------------------------------------------------------------------------------------- |
|         /pessoa         | Exibe ou cadastra pessoas no sistema                                                           |
| /pessoa?dni=123456789-0 | Exibe a pessoa cujo O DNI é 123456789-0                                                        |
|        /partido         | Exibe (em ordem alfabética) ou cadastra os partidos no sistema                                 |
|        /comissao        | Exibe ou cadastra comissão no sistema                                                          |
|        /deputado        | Cadatra um novo deputado a partir de uma pessoa existente                                      |
|           /pl           | Registra novo projeto de lei                                                                   |
|          /pec           | Registra novo projeto emenda constitucional                                                    |
|          /plp           | Registra novo projeto de lei complementar                                                      |
|  /pl?codigo=PL 1/2019   | Exibe o projeto de lei cujo o código é PL 1/2019                                               |
|  /pl/tramitacao?codigo=PL 1/2019   | Exibe a tramitação do projeto de lei cujo o código é PL 1/2019                      |
|        /votacao         | Realiza votação em determinada proposição. Recebe no body apenas "código" e "statusGovernista" |

O corpo das requisições POST é o mesmo dos métodos da _facade_ definidos na [especificação](https://docs.google.com/document/d/e/2PACX-1vRMP1dmmr6DpXQECabYiR_pboa4P_XiXEywRX_wntWL0ego4KHlH25_Vsv0HB0_Io4nXn4lNI0eEaXU/pub)

### Arquitetura

Quando é feita uma requisição à API, o corpo, se existir, é checado primeiramente pelo **middleware**.\
O **controller** checa se o middleware disparou algum erro, caso não tenha, é delegado para o **service**, que implementa a lógica de negócio, realizar as operações.\
Se houve alguma inconsistencia dos dados (e.g. cadastrar uma pessoa que já está cadastrada) o _service_ lança uma exceção. O _controller_ captura e retorna um **response** com _status_ correspondente à falha. Caso contrário, as alterações são gravadas no banco de dados e é retornado um **response** com _status_ de sucesso.

[![Diagrama.png](https://c.imge.to/2019/08/28/vvN15t.png)](https://imge.to/i/vvN15t)

## Licença

MIT License
