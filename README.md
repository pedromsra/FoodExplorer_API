# Food Explorer API Documentation

## Apresentation
#### Backend para aplicação WEB de restaurante fictício;
- Desenvolvida em NodeJS v16.15.1;
- Banco de dados construido com o auxilio do Querry Builder Knex;
 - Até o momento funcionando com SQLite3;

## Features

- Criação e edição de usuários;
 - Upload de imagem para avatar;
 - Endereço;
 - Salva forma de pagamento;
- Criação, edição, exibição e lista de refeições;
 - Ingredientes e relação ingredientes/refeições é gerenciado pelo controller de refeições;
- Criação, edição, exibição e lista de Pedidos;
 - Relação de pedidos com endereço de destino, pagamento e refeições é gerenciado pelo controller de pedidos;

## SQL Infos

- Tabelas principais:
 - users: Armazena usuários com as colunas: id - name - email - password (hashed with bcrypt) - role (default or admin);
 - adress: Armazena o endereço dos usuários com as colunas: id - user_id - nickname - cep - number - city - streetName;
 - savedPaymentMethod: Armazena as formas de pagamento do usuário com as colunas: id - user_id - cardName, cardNumber, csc (hashed with bcryptjs), cardExpiresIn;
 - meals: Armazena as refeições com as colunas: id - title - price - type - desciption;
 - ingredients: Armazena as refeições com as colunas: id - name;
 - orders: Armazena os pedidos com as colunas: id - user_id - adress_id - payment_id - value - status;
- Tabelas de auxilio N x N:
 - ingredientsMeal: Armazena a realação de um ingrediente para uma refeição com as colunas: id - meal_id - ingredient_id;
 - orderMeal: Armazena a relação de uma refeição para um pedido com as colunas: id - meal_id - order_id;

## Primeiros passos

### Clonar repositório do github

[Links](https://github.com/pedromsra/FoodExplorer_API)

### Iniciando a aplicação

> Abrir terminal e digitar:
  > cd /local da pasta onde a API está salva;
  > npm intall;
  > npm run dev;
> Para os fins dessa documentação será considerado o servidor local de enderço localhos:3003;
> Para alterar o servidor recomenda-se alterar no arquivo .env em PORT;

## Paths

### "/users"

- post
  - route: localhos:3003/users
  - info: cria um novo usuário;
  - returns: status(200);
  - expected request in JSON (exemple):
 		{
			"name":"Pedro Saboia",
			"email":"pedros@gmail.com",
			"password":"123456"
		}

- put
  - route: localhos:3003/users
  - info: atualiza as informações de usuário que está autenticado;
  - returns: status(200);
  - expected request in JSON (exemple):
  	{
		"name":"Pedro Saboia Rodrigues",
		"email":"pedromsr@gmail.com",
		"passwordOld":"123456",
		"passwordNew":"123456"
	}
  - response: status(200)
  - comment: agora é necessário informar a senha antiga e a nova. Os erros esperados são semelhantes aos erros esperados no método post;
 
- patch
 - route: localhos:3003/users/avatar
 - info: modifica o avatar do usuário que está autenticado;
 - Expected request in file: .image (.png, .jpeg, etc)
 - response: status(200)

### "/adress"

- post
 - route: localhos:3003/adress
 - info: cria um novo endereço para o usuário que está autenticado;
 - Expected request in JSON:
	{
		"nickname":"Casa",
		"cep":"12345-123",
		"number":"123",
		"streetName": "Rua de casas",
		"city": "Cidade de bairros"
	}
 - response: status(200)

- put
 - route: localhos:3003/adress/:id
 - info: modifica o endereço informado para o usuário que está autenticado;
 - Expected request in JSON:
	{
		"nickname":"Casa",
		"cep":"12345-123",
		"number":"123",
		"streetName": "Rua de casas",
		"city": "Cidade de bairros"
	}
 - response: status(200)

- get
 - route: localhos:3003/adress
 - info: retorna uma lista dos endereços salvos do usuário autenticado;
 - Expected request: somente autenticação do usuário;
 - response:
	[
		{
			"nickname":"Casa",
			"cep":"12345-123",
			"number":"123",
			"streetName": "Rua de casas",
			"city": "Cidade de bairros"
		},
		{
			"nickname":"Trabalho",
			"cep":"12345-345",
			"number":"123",
			"streetName": "Rua de casas",
			"city": "Cidade de bairros"
		},
		...
	]

- get
 - route: localhos:3003/adress/:id
 - info: modifica o avatar do usuário;
 - Expected request in file: .image (.png, .jpeg, etc)
 - response: status(200)

### "/payments"

### "/meals"

### "/orders"