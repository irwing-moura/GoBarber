import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

/**
 * SEMELHANTE AOS MODELS IMPORTADOS DENTRO DO INDEX, AQUI SÃO IMPORTADOS CADA UM DOS JOBS
 */
const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  /**
   * PEGANDO TODOS OS JOBS DA APLICAÇÃO E OS ARMAZENANDO DENTRO DA VARIÁVEL 'this.queues'
   * HANDLE - RESPONSÁVEL POR PROCESSAR O JOB, FARÁ AS TAREFAS QUE PRECISAM SER FEITAS EM BACKGROUND
   */

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
