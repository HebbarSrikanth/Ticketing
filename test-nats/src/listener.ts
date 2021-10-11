import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import TicketCreatedListener from './events/ticketCreatedListener';

console.clear();
const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Listener has been connected to the NATS Streaming!!');

  const ticketListenerobject = new TicketCreatedListener(client);

  ticketListenerobject.listen();

  client.on('close', () => {
    console.log('Listener has been disconnected from NATS Streaming!!');
    process.exit();
  });
});

process.on('SIGKILL', () => client.close());
process.on('SIGINT', () => client.close());
