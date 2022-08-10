# Cosmobot - Users API

## Pré-Requisitos: ##
  - docker v20.10.14 (ou superior)
  - docker-compose 1.29.2 (ou superior)
  
  - ### ***Caso não use o docker vai ser necessário:*** ###
  - Node.js v16.15.x
  - PostgresSQL v10.x

## Como iniciar esse projeto: ##

  - Clone o projeto: 
    ```
      git clone git@github.com:TiagoPaz2000/cosmobots.git
    ```
  - ### ***Não utilizando docker*** ###
    - Instale as dependências:
    ```
      npm install
    ```
    - Crie um arquivo chamado ***.env***, e configure as variáveis de ambiente (use o arquivo ***.env.example*** como base).
    - Para popular o banco de dados use a query que está no arquivo ***./docs/seeds.SQL***.
    - Para iniciar o servidor express:
       ```
       npm start
       ```
       ***Em modo live-reload:***
       ```
       npm run dev
       ```
    - Acesse a documentação (swagger) para testar as rotas:
       ***http://localhost:3001/api-docs***
  - ### ***Utilizando docker*** ###
      - Inicie o docker compose:
      ```
      docker-compose up -d --build
      ```
      Crie um arquivo chamado ***.env***, e configure as variáveis de ambiente (use o arquivo ***.env.example*** como base).
      - Para popular o bacno de dados use:
      ```
      docker exec -it db psql && \c nome_da_sua_variavel_DB_NAME
      ```
      - Exemplo: 
      ```
        docker exec -it db psql && \c cosmo_database
      ```
      - Agora cole as querys do arquivo ***./docs/seeds.SQL***.
      - Acesse a documentação (swagger) para testar as rotas:
        ***http://localhost:3001/api-docs***
      