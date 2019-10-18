/**
 * CONFIGURAÇÃO DO BANCO NÃO RELACIONAL- REDIS - UTILIZADO PARA OS JOBS
 */

export default {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};
