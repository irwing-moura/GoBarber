import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date()); // VERIFICANDO SE O AGENDAMENTO JA PASSOU
          },
        },
        /**
         * VERIFICANDO SE O CAMPO É CANCELAVEL OU NÃO, OU SEJA, DEVE ESTAR NO MINIMO A DUAS HORAS ANTES DO AGENDAMENTO
         * ACONTECER
         */
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // RELACIONAMENTO COM A TABELA DE USUÁRIO
  // ARMAZENANDO DUAS FOREIGNS KEYS, UMA PARA ID DO USUÁRIO
  // OUTRA PARA GUARDAR O USUÁRIO ID DO PROVIDER (PROVEDOR DO SERVIÇO)
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
