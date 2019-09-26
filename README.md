# E-Camara Organizada (E-CO)

O projeto **E-Camara Organizada** ou **E-CO** é uma API REST que está sendo implementada com **Node.js** e **Typescript** de acordo com [estas especificações](https://docs.google.com/document/d/e/2PACX-1vRMP1dmmr6DpXQECabYiR_pboa4P_XiXEywRX_wntWL0ego4KHlH25_Vsv0HB0_Io4nXn4lNI0eEaXU/pub).

- [E-Camara Organizada (E-CO)](#e-camara-organizada-e-co)
  - [Como rodar na sua máquina](#como-rodar-na-sua-m%c3%a1quina)
    - [Banco de dados: MongoDB](#banco-de-dados-mongodb)
    - [Execução](#execu%c3%a7%c3%a3o)
    - [Para testar:](#para-testar)
  - [Documentação](#documenta%c3%a7%c3%a3o)
    - [Arquitetura](#arquitetura)
      - [JSON Web Token](#json-web-token)
  - [Licença](#licen%c3%a7a)

## Como rodar na sua máquina

A aplicação está configurada para rodar na porta 3333.

### Banco de dados: MongoDB

- Configure seu ambiente no [MongoDB Atlas](https://docs.atlas.mongodb.com/getting-started/) ou instale o [MongoDB](https://docs.mongodb.com/manual/installation/) na sua máquina.
- No arquivo .environment renomeie para .env e coloque a url do BD na variável `URL_BD`.

### Execução

1. No arquivo .env insira uma chave qualquer para o JWT_SECRET.
2. Digite o comando `yarn` na pasta principal para instalar as dependências.
3. Digite `yarn start` para iniciar a aplicação.
4. Faça requisições em [localhost:3333](http://www.localhost:3333/)

### Para testar

- Importe o arquivo [files/daca19.2.postman_collection.json](https://github.com/filipegl/e-co/blob/master/files/daca19.2.postman_collection.json) no postman.
- Importe o arquivo com as variáveis de ambiente [files/desenvolvimendo DACA.postman_environment.json](https://github.com/filipegl/e-co/blob/master/files/desenvolvimendo%20DACA.postman_environment.json) no postman.

## Documentação

|         Rota          | Metodos Habilitados | Descrição                                                                                                                                                                      |
| :-------------------: | :-----------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        /login         |        POST         | **POST**: Gera um novo token associado à pessoa;                                                                                                                               |
|        /pessoa        |      GET, POST      | **GET**: Exibe um array de pessoas cadastradas; **POST**: Cadastra pessoas no sistema;                                                                                         |
|  /pessoa/123456789-0  |         GET         | **GET**: Exibe a pessoa cujo O DNI é 123456789-0;                                                                                                                              |
|       /partido        |      GET, POST      | **GET**: Exibe a base governista (em ordem alfabética); **POST**: Cadastra os partidos no sistema; **Autorização**: É necessário que a pessoa que está logada tenha um papel de admin para cadastrar partidos; |
|       /comissao       |      GET, POST      | **GET**: Exibe um array das comissões; **POST**: Cadastra comissão no sistema; **Autorização**: É necessário que a pessoa que está logada tenha um papel de admin para cadastrar comissao; |
|       /deputado       |        POST         | **POST**: Cadatra um novo deputado a partir de uma pessoa existentes; **Autorização**: É necessário que o o dni da pessoa que irá ser deputada seja igual ao da pessoa logada; |
|          /pl          |        POST         | **POST**: Registra novo projeto de lei; **Autorização**: É necessário que o dni da pessoa que irá cadastrar a pl seja igual ao da pessoa logada; |
|         /pec          |        POST         | **POST**: Registra novo projeto emenda constitucional; **Autorização**: É necessário que o dni da pessoa que irá cadastrar a pec seja igual ao da pessoa logada; |
|         /plp          |        POST         | **POST**: Registra novo projeto de lei complementar; **Autorização**: É necessário que o dni da pessoa que irá cadastrar a plp seja igual ao da pessoa logada; |
|      /pl/1/2019       |         GET         | **GET**: Exibe o projeto de lei cujo o código é PL 1/2019;                                                                                                                     |
| /pl/1/2019/tramitacao |         GET         | **GET**: Exibe a tramitação do projeto de lei cujo o código é PL 1/2019;                                                                                                       |
|       /votacao        |        POST         | **POST**: Realiza votação em determinada proposição. Recebe no body apenas `codigo` e `statusGovernista`; **Autorização**: É necessário que a pessoa que está logada tenha um papel de admin; |

O corpo das requisições POST é o mesmo dos métodos da _facade_ definidos na [especificação](https://docs.google.com/document/d/e/2PACX-1vRMP1dmmr6DpXQECabYiR_pboa4P_XiXEywRX_wntWL0ego4KHlH25_Vsv0HB0_Io4nXn4lNI0eEaXU/pub)

### Arquitetura

Quando é feita uma requisição à API, o corpo, se existir, é checado primeiramente pelo **middleware**.\
O **controller** checa se o middleware disparou algum erro, caso não tenha, é delegado para o **service**, que implementa a lógica de negócio, realizar as operações.\
Se houve alguma inconsistencia dos dados (e.g. cadastrar uma pessoa que já está cadastrada) o _service_ lança uma exceção. O _controller_ captura e retorna um **response** com _status_ correspondente à falha. Caso contrário, as alterações são gravadas no banco de dados e é retornado um **response** com _status_ de sucesso.

[![Diagrama.png](https://c.imge.to/2019/08/28/vvN15t.png)](https://imge.to/i/vvN15t)

#### JSON Web Token

A rota de login faz com que seja gerado um token associado à pessoa logada. Esse token garante que o usuário está autenticado. Nas rotas que necessitem de autorização, este token é passado no header da requisição.
- Uma pessoa só pode virar deputado se ela própria estiver logada no sistema.
- Um deputado só pode cadastrar seus projetos de lei (pl, pec ou plp) se ele próprio estiver logado no sistema.
- Uma pessoa só pode realizar votação, cadastrar partido e cadastrar comissão se ela própria estiver logada no sistema e possuir papel de administrador (admin).

A cada requisição que necessite de autorização, é gerado um novo token utilizando o payload do token antigo. Cada token tem duração de 1h. Isso quer dizer que se passar 1h sem nenhuma requisição, o token irá se expirar e será necessário fazer o login novamente.

#### Como é feita a autenticação e a autorização?
Ao chamar a rota de login, é gerado um token com os atributos do usuário passado devovido com response.  \
Existe um *middleware* nas rotas que precisam de autorização que irá verificar se no header da requisição existe um token válido (token que não se expirou).
Existem três tipos de pessoa: comum, deputado e admin. Esses tipos são definidos pelo atributo `papel` de pessoa.
Para uma pessoa virar **admin**, o seu atributo precisa ser alterado manualmente pelo banco de dados.
Por exemplo, se uma rota restringe (através do middleware) que apenas o admin possa fazer requisições, então ela irá verificar se o token foi emitido por alguém que tenha essa característica. \
Os atributos da pessoa logada são encriptografadas dentro do token.

## Licença

MIT License
