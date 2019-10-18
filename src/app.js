import 'dotenv/config'; // COLOCANDO TODAS AS VARIAVEIS DE AMBIENTE DENTRO DE UMA VARIAVEL GLOBAL DO NODE, CHAMADA process.env

import express from 'express';
import path from 'path';
import Youch from 'youch';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

// CRIANDO ESTRUTURA DA APLICAÇÃO, REGISTRANDO OS MIDDLEWARES E AS ROTAS
class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // FAZENDO O SERVER UTILIZAR O SENTRY - TRATAMENTO DE EXCEÇÕES
    this.server.use(Sentry.Handlers.errorHandler());
    // ABILITANDO O CORS, PERMITIR QUE APLICAÇÕES EXTERNAS POSSAM ACESSAR ESTA
    this.server.use(cors());
    // FAZENDO O EXPRESS ENTENDER JSON
    this.server.use(express.json());
    // DIRETÓRIO ONDE SERÃO SALVAS AS IMAGENS PELO MULTER
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')) // PERMITINDO O ACESSO A COISAS STATICS DO PROJETO, SEM AUTENTICAÇÃO, TIPO IMAGEM, ARQUIVOS
    );
  }

  // FAZENDO O SERVER UTILIZAR AS ROTAS DEFINIDAS NO ARQUIVO ROUTES
  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  /**
   * MIDDLEWARE DE TRATAMENTO DE EXCEÇÕES --> SENTRY --> TODOS OS ERROS DA APLICAÇÃO CAIRAM DENTRO DESTE MIDDLEWARE
   */
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return req.status(500).json({ error: 'Internal server error' });
    });
  }
}
export default new App().server;
