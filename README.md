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

### Tabelas principais:

- users: Armazena usuários com as colunas: id - name - email - password (hashed with bcrypt) - role (default or admin);
- adress: Armazena o endereço dos usuários com as colunas: id - user_id - nickname - cep - number - city - streetName;
- savedPaymentMethod: Armazena as formas de pagamento do usuário com as colunas: id - user_id - cardName, cardNumber, csc (hashed with bcryptjs), cardExpiresIn;
- meals: Armazena as refeições com as colunas: id - title - price - type - desciption;
- ingredients: Armazena as refeições com as colunas: id - name;
- orders: Armazena os pedidos com as colunas: id - user_id - adress_id - payment_id - value - status;

### Tabelas de auxilio N x N:

- ingredientsMeal: Armazena a realação de um ingrediente para uma refeição com as colunas: id - meal_id - ingredient_id;
- orderMeal: Armazena a relação de uma refeição para um pedido com as colunas: id - meal_id - order_id;

## Primeiros passos

### Clonar repositório do github

[Diretório Github: Food Explorer](https://github.com/pedromsra/FoodExplorer_API)

### Iniciando a aplicação

- Abrir terminal e digitar:
  - `$ cd /local_da_pasta_onde_a_API_está_salva;`
  - `$ npm install`;
  - `$ npm run dev`

> Para os fins dessa documentação será considerado o servidor local de enderço localhost:3003;

> Para alterar o servidor recomenda-se alterar no arquivo .env em PORT;

## Paths

### "/sessions"

- post:
  - endereço: localhost:3003/sessions;
  - info: cria uma sessão, gerando o token que contem o id do usuário autenticado;
  - Expected request in JSON(exemple):

		{
			"email":"pedromsra@gmail.com",
			"password":"123456"
		}

  - response:

		{
			"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzcxMTc1MzAsImV4cCI6MTY3NzIwMzkzMCwic3ViIjoiNDIifQ.OOSjT0sd_QKKsyHy058S8oVLTFG5W1kzWmV50cT358s"
		}

  - Comment: numa aplicação frontend, é recomendável salvar esse token no localhostt, de modo a manter o usuário autenticado. Por padrão o tempo de sessão definido na aplicação é 1 dia.

> Exemplo no Insomnia para salvar token como variável de ambiente do insomnia e usar nas demais requisições http:
- Dentro da pasta root do projeto do insomnia, na opção de general enviroments (canto superior esquerdo (ao lado da casinha)), clicar em "Manage Environments";
- Clicar em Base Environment (lateral esqueda);
- Digitar: 
		{
			"USER_TOKEN": "response"
		}
- Irá aparecer um menu, selecione Response > Body Attribute;
- Clicar no campo em vermelho;
- Selecionar:
	- Request > [SESSIONS] PostCreate;
	- Filter > $.token;
	- Trigger Behavior > Always;

> Exemplo no Insomnia para usar o token no header da requisição:
- Na aba Authentication da requisição, selecionar Bearer Token e no campo Token digitar _.USER_TOKEN
### "/users"

- post:
  - endereço: localhost:3003/users;
  - info: cria um novo usuário;
  - expected request in JSON (exemple):

 		{
			"name":"Pedro Saboia",
			"email":"pedros@gmail.com",
			"password":"123456"
		}

  - response: status(200);

- put:
  - endereço: localhost:3003/users;
  - info: atualiza as informações de usuário que está autenticado;
  - expected request in JSON (exemple):

		{
			"name":"Pedro Saboia Rodrigues",
			"email":"pedromsr@gmail.com",
			"passwordOld":"123456",
			"passwordNew":"123456"
		}
  - response: status(200);

  - response: status(200);
  - comment: agora é necessário informar a senha antiga e a nova. Os erros esperados são semelhantes aos erros esperados no método post;

- patch:
  - endereço: localhost:3003/users/avatar;
  - info: modifica o avatar do usuário que está autenticado;
  - Expected request in file: rótulo avatar com .image (.png, .jpeg, etc);
    - exemplo no frontend:

    ```html
	<input id="avatar" type="file" />;
	```

    - exemplo no insomnia: Multipart Form > no lugar de "name" colocar "avatar" e selecionar o arquivo da imagem;
  - response: status(200);

### "/adress"

- post:
  - endereço: localhost:3003/adress;
  - info: cria um novo endereço para o usuário que está autenticado;
  - Expected request in JSON (exemple):

		{
			"nickname":"Casa",
			"cep":"12345-123",
			"number":"123",
			"streetName": "Rua de casas",
			"city": "Cidade de bairros"
		};

  - response: status(200);

- put:
  - endereço: localhost:3003/adress/:id;
  - info: modifica o endereço informado para o usuário que está autenticado;
  - Expected request in JSON (exemple):

		{
			"nickname":"Casa",
			"cep":"12345-123",
			"number":"123",
			"streetName": "Rua de casas",
			"city": "Cidade de bairros"
		};

 - response: status(200);

- get:
  - endereço: localhost:3003/adress;
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
		];

- get:
  - endereço: localhost:3003/adress/:id;
  - info: retorna o endereço informado;
  - Expected request: somente autenticação do usuário;
  - response:

		{
			"id": 14,
			"user_id": 42,
			"nickname": "Casa",
			"cep": "59123-123",
			"number": "123",
			"streetName": "Rua das casas",
			"city": "Cidade dos bairros"
		};

### "/payments"

- post:
  - endereço: localhost:3003/payments;
  - info: cria um novo pagamento para o usuário que está autenticado;
  - Expected request in JSON (exemple):

		{
			"cardName": "FLANO DA SILVA",
			"cardNumber": "1234123456781234",
			"cardExpiresIn": "2024-02",
			"csc": "123"
		};

  - response: status(200);

- put:
  - endereço: localhost:3003/payments/:id;
  - info: modifica o pagamento informado para o usuário que está autenticado;
  - Expected request in JSON (exemple):

		{
			"cardName": "FLANO SILVA",
			"cardNumber": "1234123456781235",
			"cardExpiresIn": "2024-02",
			"csc": "123"
		};

  - response: status(200);

- get:
  - endereço: localhost:3003/payments;
  - info: retorna uma lista dos pagamentos salvos do usuário autenticado;
  - Expected request: somente autenticação do usuário;
  - response:

		[
			{
				"id": 1,
				"cardName": "JOSE FULANO B SILVA",
				"cardNumber": "1234123412345678",
				"cardExpiresIn": "2025-02",
				"updated_at": "2023-02-17 04:35:40"
			},
			{
				"id": 2,
				"cardName": "FULANO SILVA",
				"cardNumber": "1234123456785678",
				"cardExpiresIn": "2024-02",
				"updated_at": "2023-02-19 20:32:07"
			}
		];

- get:
  - endereço: localhost:3003/payments/:id;
  - info: retorna o pagamento informado;
  - Expected request: somente autenticação do usuário;
  - response:

		{
			"id": 7,
			"cardName": "PEDRO ARAUJO",
			"cardNumber": "1234123456781234",
			"cardExpiresIn": "2024-02",
			"updated_at": "2023-02-17 04:38:56"
		};

### "/meals"

- post:
  - endereço: localhost:3003/meals;
  - info: cria uma nova refeição para o usuário que está autenticado;
  - Expected request in JSON (exemple):

		{
			"title": "Camarão empanado",
			"type": "Refeição",
			"description": "Deliciosos camarões empanados acompanhado de batata frita e molho especial da casa",
			"price": 28.50,
			"ingredients":[
				"camarão",
				"Batata frita palito",
				"Molho especial"
			]
		};

  - response: status(200);

- put:
  - endereço: localhost:3003/meals/:id;
  - info: modifica a refeição informada para o usuário que está autenticado;
  - Expected request in JSON (exemple):

		{
			"title": "Camarão empanado cremoso",
			"type": "Refeição",
			"description": "Deliciosos camarões empanados acompanhado de batata frita e molho especial da casa",
			"price": 30.90,
			"ingredients":[
				"camarão",
				"Batata frita palito"
			]
		};

  - response: status(200);

- get:
  - endereço: localhost:3003/meals;
  - info: retorna uma lista das refeições salvas do usuário autenticado, **filtrada pelo título da refeição e/ou ingrediente**;
  - Expected request: 
    - Query: Exemplo usando o Insomnia:
      - no lugar de "name" colocar title e no lugar de value colocar "";
      - no lugar de "name" colocar ingredient e no lugar de value colocar "arroz";
  - response:

		[
			{
				"id": 1,
				"title": "Almoço Vegano",
				"description": "Almoço tradicional brasileiro sem maltratar os animais!",
				"price": 19.9,
				"type": null,
				"ingredients": [
					{
						"id": 26,
						"name": "arroz"
					},
					{
						"id": 25,
						"name": "feijão"
					},
					{
						"id": 28,
						"name": "hamburger de carne de jaca"
					}
				]
			},
			{
				"id": 2,
				"title": "Camarão à grega",
				"description": "Deliciosos camarões empanados acompanhados de arroz à grega cremoso com tudo gratinado com queijo",
				"price": 48.5,
				"type": "Refeição",
				"ingredients": [
					{
						"id": 26,
						"name": "arroz"
					},
					{
						"id": 41,
						"name": "camarão"
					},
					{
						"id": 42,
						"name": "queijo mussarela"
					}
				]
			}
		];

- get:
  - endereço: localhost:3003/meals/:id;
  - info: retorna a refeição informada;
  - Expected request: somente autenticação do usuário;
  - response:

		{
			"id": 77,
			"title": "Camarão empanado cremoso",
			"type": "Refeição",
			"description": "Deliciosos camarões empanados acompanhado de batata frita e molho especial da casa",
			"price": 30.9,
			"image": null,
			"created_at": "2023-02-18 04:42:17",
			"updated_at": "2023-02-18 04:57:39",
			"ingredients": [
				{
					"id": 41,
					"name": "camarão"
				},
				{
					"id": 46,
					"name": "Batata frita palito"
				}
			]
		};

- patch:
  - endereço: localhost:3003/meals/:id/image;
  - info: modifica a image da refeição informada;
  - Expected request in file: rótulo image com .image (.png, .jpeg, etc);
   - exemplo no frontend:

    ```html
	<input id="image" type="file" />;
	```

   - exemplo no insomnia: Multipart Form > no lugar de "name" colocar "image" e selecionar o arquivo da imagem;
  - response: status(200);

### "/favorites"

- post:
  - endereço: localhost/favorites/meal_id;
  - info: salva uma refeição (/param: meal_id) como favorita para o usuário autenticado;
  - Expected request: somente usuário autenticado;
  - response: status(200);

- delete:
  - endereço: localhost/favorites/meal_id;
  - info: deleta uma refeição (/param: meal_id) dos favoritos do usuário autenticado;
  - Expected request: somente usuário autenticado;
  - response: status(200);

### "/orders"

- post:
  - endereço: localhost:3003/orders;
  - info: cria um novo pedido para o usuário que está autenticado;
  - Expected request in JSON (exemple):

		{
			"adress":{
				"nickname":"Casa",
				"cep":"59123-123",
				"number":"123",
				"streetName": "Alameda das casas",
				"city": "Cidade"
			},
			"payment":{
				"cardName": "FULANO DA SILVA",
				"cardNumber": "1234123456785678",
				"cardExpiresIn": "2024-02",
				"csc": "123"
			},
			"meals":[
				{
					"meal_id": 71,
					"quantity": 5
				},
				{
					"meal_id": 72,
					"quantity": 3
				}
			]
		};

  - response: status(200);

- put:
  - endereço: localhost:3003/orders/:id;
  - info: modifica o pedido informado para o usuário que está autenticado;
  - Expected request in JSON (exemple):

		{
			"adress":{
				"nickname":"Casa",
				"cep":"59123-123",
				"number":"123",
				"streetName": "Alameda das casas",
				"city": "Cidade"
			},
			"payment":{
				"cardName": "FULANO DA SILVA",
				"cardNumber": "1234123456785678",
				"cardExpiresIn": "2024-02",
				"csc": "123"
			},
			"meals":[
				{
					"meal_id": 71,
					"quantity": 4
				},
				{
					"meal_id": 72,
					"quantity": 3
				}
			],
			"status":"Em entrega"
		};

  - response: status(200);

- get:
  - endereço: localhost:3003/orders;
  - info: retorna uma lista dos pedidos do usuário autenticado: **hitórico de pedidos**;
  - Expected request: somente autenticação do usuário;
  - response:

		[
			{
				"id": 1,
				"status": "em rota de entrega",
				"updated_at": "2023-02-16 02:40:46",
				"value": null,
				"meals": [
					{
						"title": "Almoço Vegano",
						"quantity": 4
					},
					{
						"title": "feijoada",
						"quantity": 2
					}
				]
			},
			{
				"id": 2,
				"status": "pendente",
				"updated_at": "2023-02-16 02:41:31",
				"value": null,
				"meals": [
					{
						"title": "Almoço Vegano",
						"quantity": 2
					},
					{
						"title": "feijoada",
						"quantity": 2
					}
				]
			};

- get:
  - endereço: localhost:3003/orders/:id;
  - info: retorna a refeição informada;
  - Expected request: somente autenticação do usuário;
  - response:

		{
			"id": 48,
			"status": "em rota de entrega",
			"updated_at": "2023-02-21 10:46:34",
			"value": 170.25,
			"meals": [
				{
					"title": "feijoada Vegana",
					"price": 24.3,
					"quantity": 4
				},
				{
					"title": "Sobremesa Vegana",
					"price": 24.35,
					"quantity": 3
				}
			]
		};
