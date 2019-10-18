/**
 * CONFIGURAÇÃO DE AUTENTICAÇÃO COM TOKEN
 */

export default {
  secret: process.env.APP_SECRET,
  expiresIn: '7d',
};
