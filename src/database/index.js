// RESPONSAVEL POR REALIZAR A CONEXÃO COM O BANCO DE DADOS E CARREGAR OS MODELS
import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

// VARIÁVEL 'sequelize' QUE É ESPERADA DENTRO DOS MODELS,
import databeseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment];

class Databese {
  constructor() {
    this.init();
    this.mongo();
  }

  // INICIALIZA UMA CONEXAO COM O BANCO
  init() {
    this.connection = new Sequelize(databeseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  // CONFIG PARA CONEXÃO AO BANCO NoSQL - MongoDB
  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Databese();
