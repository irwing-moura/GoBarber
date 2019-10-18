import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    // 2 PARAMETROS, O PRIMEIRO SÃO AS COLUNAS(CAMPOS QUE O USUARIO PODE INSERIR,
    // E O SEGUNDO PARAMETRO SÃO CONFIGURAÇÕES, TIPO A SEQUELIZE UTILIZADA ABAIXO,
    // PODERIA-SE UTILIZAR PARA TROCAR NOMES DE TABELA, ETC)

    // O MODEL NÃO PRECISA TER NECESSARIAMENTE TODOS OS CAMPOS QUE POSSUEM NA TABELA NO BANCO, SOMENTE OS NECESSARIOS PARA RETORNAR PARA O FRONT-END
    super.init(
      {
        // CHAMANDO O MÉTODO INIT DA CLASSE MODEL, ESTE MÉTODO É CHAMADO AUTOMATICAMENTE PELO SEQUELIZE
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // CAMPO QUE NUNCA VAI EXISTIR NA BASE DE DADOS
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      // CODIGO SERÁ EXECUTADO ANTES DE SALVAR NO BD
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8); // CRIPTOGRAFANDO A SENHA
      }
    });

    return this;
  }

  // RELACIONAMENTO COM A TABELA File, QUE ARMAZENA A IMAGEM DO USUÁRIO
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
