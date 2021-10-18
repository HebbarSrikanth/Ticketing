import nats, { Stan } from 'node-nats-streaming';
class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Nats must be initialised');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        resolve();
      });

      this.client.on('error', (error) => {
        console.log(error);
        reject(error);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
