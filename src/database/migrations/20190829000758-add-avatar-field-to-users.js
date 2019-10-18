module.exports = {
  // ADICIONANDO COLUNA AVATAR ID NA TABELA USERS
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER, // TODO avatar_id DA TABELA USERS VAI SER TAMBEM UM ID CONTIDO NA TABELA FILES
      references: { model: 'files', key: 'id' }, // FOREIGN KEY
      onUpdate: 'CASCADE', // CASO O id_avatar SEJA ALTERADO NA TABELA FILES, SERÁ TAMBEM NA TABELA USERS
      onDelete: 'SET NULL', // O id_avatar SERÁ NULO NA TABELA USERS CASO SEJA DELETADO NA TABELA FILES
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
