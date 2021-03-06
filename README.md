# E-Camara Organizada (E-CO)

O projeto **E-Camara Organizada** ou **E-CO** é uma API REST que está sendo implementada com **Node.js** e **Typescript** de acordo com [estas especificações](https://docs.google.com/document/d/e/2PACX-1vRMP1dmmr6DpXQECabYiR_pboa4P_XiXEywRX_wntWL0ego4KHlH25_Vsv0HB0_Io4nXn4lNI0eEaXU/pub).

- [E-Camara Organizada (E-CO)](#e-camara-organizada-e-co)
  - [Iniciando o projeto](#iniciando-o-projeto)
    - [Banco de dados: MongoDB](#banco-de-dados-mongodb)
    - [Execução](#execu%c3%a7%c3%a3o)
    - [Para testar](#para-testar)
  - [Arquitetura](#arquitetura)
    - [Funcionamento](#funcionamento)
    - [Rotas disponíveis](#rotas-dispon%c3%adveis)
  - [Segurança](#seguran%c3%a7a)
    - [JSON Web Token](#json-web-token)
    - [Regras](#regras)
    - [Importante saber](#importante-saber)
    - [Autenticação e a autorização](#autentica%c3%a7%c3%a3o-e-a-autoriza%c3%a7%c3%a3o)
  - [Desempenho](#desempenho)
    - [Cache](#cache)
    - [Exemplo de execução com cache](#exemplo-de-execu%c3%a7%c3%a3o-com-cache)
    - [Experimentos de desempenho](#experimentos-de-desempenho)
  - [Licença](#licen%c3%a7a)

## Iniciando o projeto

### Banco de dados: MongoDB

- Configure seu ambiente no [MongoDB Atlas](https://docs.atlas.mongodb.com/getting-started/) ou instale o [MongoDB](https://docs.mongodb.com/manual/installation/) na sua máquina.
- No arquivo .environment renomeie para .env e coloque a url do BD na variável `URL_BD`.

### Execução

1. No arquivo .env defina uma chave para o `JWT_SECRET`.
2. Digite o comando `yarn` na pasta principal para instalar as dependências.
3. Digite `yarn start` para iniciar a aplicação.
4. Faça requisições em [localhost:3333](http://www.localhost:3333/)

### Para testar

- Importe o arquivo [files/daca19.2.postman_collection.json](https://github.com/filipegl/e-co/blob/master/files/daca19.2.postman_collection.json) no postman.
- Importe o arquivo com as variáveis de ambiente [files/desenvolvimendo DACA.postman_environment.json](https://github.com/filipegl/e-co/blob/master/files/desenvolvimendo%20DACA.postman_environment.json) no postman.

## Arquitetura

Este projeto utiliza o modelo de arquitetura REST. \
O REST vê cada aplicação web como um conjunto de recursos, que representam um estado particular.

### Funcionamento

Fluxo geral de quando é feita uma **requisição à API**:

1. O **corpo** da requisição, se existir, é checado primeiramente pelo **middleware**.
2. O **controller** checa se o middleware disparou algum erro:
   - Caso tenha erro(s), uma resposta (_response_) com status de erro é enviada.
3. O tratamento da requisição é delegada ao _service_, que implementa a lógica de negócio e realiza as operações.
   - Se houve alguma inconsistencia de dados (e.g. cadastrar uma pessoa que já está cadastrada) o _service_ lança uma exceção.
   - O _controller_ captura e retorna um _response_ com _status_ correspondente à falha.
4. As alterações são gravadas no banco de dados e é retornado um **response** com _status_ de sucesso.

[![Diagrama.png](https://c.imge.to/2019/08/28/vvN15t.png)](https://imge.to/i/vvN15t)

### Rotas disponíveis

|         Rota          | Metodos Habilitados | Descrição                                                                                                                                                                                                      |
| :-------------------: | :-----------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        /login         |        POST         | **POST**: Gera um novo token associado à pessoa;                                                                                                                                                               |
|        /pessoa        |      GET, POST      | **GET**: Exibe um array de pessoas cadastradas; **POST**: Cadastra pessoas no sistema;                                                                                                                         |
|  /pessoa/123456789-0  |         GET         | **GET**: Exibe a pessoa cujo O DNI é 123456789-0;                                                                                                                                                              |
|       /partido        |      GET, POST      | **GET**: Exibe a base governista (em ordem alfabética); **POST**: Cadastra os partidos no sistema; **Autorização**: É necessário que a pessoa que está logada tenha um papel de admin para cadastrar partidos; |
|       /comissao       |      GET, POST      | **GET**: Exibe um array das comissões; **POST**: Cadastra comissão no sistema; **Autorização**: É necessário que a pessoa que está logada tenha um papel de admin para cadastrar comissao;                     |
|       /deputado       |        POST         | **POST**: Cadatra um novo deputado a partir de uma pessoa existentes; **Autorização**: É necessário que o o dni da pessoa que irá ser deputada seja igual ao da pessoa logada;                                 |
|          /pl          |        POST         | **POST**: Registra novo projeto de lei; **Autorização**: É necessário que o dni da pessoa que irá cadastrar a pl seja igual ao da pessoa logada;                                                               |
|         /pec          |        POST         | **POST**: Registra novo projeto emenda constitucional; **Autorização**: É necessário que o dni da pessoa que irá cadastrar a pec seja igual ao da pessoa logada;                                               |
|         /plp          |        POST         | **POST**: Registra novo projeto de lei complementar; **Autorização**: É necessário que o dni da pessoa que irá cadastrar a plp seja igual ao da pessoa logada;                                                 |
|      /pl/1/2019       |         GET         | **GET**: Exibe o projeto de lei cujo o código é PL 1/2019;                                                                                                                                                     |
| /pl/1/2019/tramitacao |         GET         | **GET**: Exibe a tramitação do projeto de lei cujo o código é PL 1/2019;                                                                                                                                       |
|       /votacao        |        POST         | **POST**: Realiza votação em determinada proposição. Recebe no body apenas `codigo` e `statusGovernista`; **Autorização**: É necessário que a pessoa que está logada tenha um papel de admin;                  |

O corpo das requisições POST é o mesmo dos métodos da _facade_ definidos na [especificação](https://docs.google.com/document/d/e/2PACX-1vRMP1dmmr6DpXQECabYiR_pboa4P_XiXEywRX_wntWL0ego4KHlH25_Vsv0HB0_Io4nXn4lNI0eEaXU/pub)

## Segurança

### JSON Web Token

A rota de **login** faz com que seja gerado um **token** associado à pessoa logada. **Esse token garante que o usuário está autenticado**. Nas rotas que necessitem de autorização, o **token** é passado no _header_ da requisição.

### Regras

- Uma pessoa só pode virar deputado se ela própria estiver logada no sistema.
- Um deputado só pode cadastrar seus projetos de lei (pl, pec ou plp) se ele próprio estiver logado no sistema.
- Uma pessoa só pode realizar votação, cadastrar partido e cadastrar comissão se ela própria estiver logada no sistema e possuir papel de administrador (admin).

### Importante saber

- A cada requisição que necessite de autorização, é gerado um novo token utilizando o payload do token antigo.
- Cada token tem duração de 1h.
  - Se passar 1h sem nenhuma requisição, o token irá se expirar e será necessário fazer o login novamente.
- Existem três tipos de pessoa: comum, deputado e admin.
  - Esses tipos são definidos pelo atributo `papel` de pessoa.
  - Para uma pessoa virar **admin**, o seu atributo precisa ser alterado manualmente pelo banco de dados.

### Autenticação e a autorização

- Ao chamar a rota de login, é gerado um token com os atributos do usuário e devolvido com _response_.
- Nas rotas que precisam de autorização, existe um _middleware_ que irá verificar se no header da requisição existe um token válido (token que não se expirou).
- Se uma rota restringe (através do middleware) que apenas o admin possa fazer requisições, então ela irá verificar se o token foi emitido por alguém que tenha essa característica. Os atributos da pessoa logada são encriptografadas dentro do token.

## Desempenho

### Cache

Este projeto utiliza o [apicache](https://github.com/kwhitley/apicache) para a implementação de cache. É utilizado no método GET das rotas:

- /pessoa
- /pessoa/:id
- /partido
- /comissao

### Experimentos de desempenho

Foi usado o software [Jmeter](https://jmeter.apache.org/) para medir a performance.
Na rota `/pessoa`, dicionamos um `sleep` de 0.5 segundos para que possamos evidenciar o desempenho do cache nos testes.

- Simulação de **100 usuários** com **65 interações**
- Teste com duração de **120 segundos**

A rota `/pessoa/sem-cache` faz a mesma coisa que `/pessoa`, com a diferença que a primeira não implementa cache.\
Através dos testes, fica claro o desempenho superior da rota `/pessoa`, que implementa cache.

Média de tempo de resposta no teste:
- `/pessoa`: 180.26 milissegundos
- `/pessoa/sem-cache`: 1226.52 milissegundos

![grafico](https://raw.githubusercontent.com/filipegl/e-co/master/saida-teste/Response%20Time%20Graph.png)

O relatório completo se encontra em https://github.com/filipegl/e-co/blob/master/saida-teste/res/index.html
## Licença

MIT License
