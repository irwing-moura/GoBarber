import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import { format } from 'util';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    const searchDate = Number(date);

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':'); // TUDO QUE VIER ANTES É DO ":" É HORA E DEPOIS É MINUTO]
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointment.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();