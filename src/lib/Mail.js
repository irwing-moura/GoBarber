import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exprhbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    /**  COMPILA OS TEMPLATES DE EMAIL */
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exprhbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  // SOMANDO DADOS QUE SÃO PADRÕES COM A MENSAGEM QUE VEM DO CONTROLLER
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default, // COLOCANDO TUDO QUE ESTIVER DENTRO DE MAILCONFIG
      ...message, // COLOCANDO TUDO QUE ESTIVER DENTRO DE MESSAGE
    });
  }
}

export default new Mail();
