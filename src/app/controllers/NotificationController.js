import Notification from '../schemas/Notifications';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const cheeckUserProvider = User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!cheeckUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  // MUDANDO O ATRIBUTO 'read' PARA TRUE, VERIFICANDO QUE A NOTIFICAÇÃO FOI LIDA
  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true } // ATUALIZA A NOTIFICAÇÃO E RETORNA O NOVO REGISTRO ATUALIZADO
    );

    return res.json(notification);
  }
}

export default new NotificationController();
