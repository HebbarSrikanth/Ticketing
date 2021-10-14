import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cant access client before initilazing');
    }
    return this._client;
  }

  connect(clusterid: string, clientid: string, url: string): Promise<void> {
    this._client = nats.connect(clusterid, clientid, { url });
    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS Server');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const NatsWapper = new NatsWrapper();
