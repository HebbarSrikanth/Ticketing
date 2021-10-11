import nats from 'node-nats-streaming';
import TicketCreatedPublisher from './events/ticketCreatedPublisher';

console.clear();
const client = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

client.on('connect', async () => {
  console.log('Publisher connected to NATS straming!!');

  const ticketCreatedPublisher = new TicketCreatedPublisher(client);
  try {
    await ticketCreatedPublisher.publish({
      id: '123456',
      title: 'Ticket 1',
      price: 120,
      userId: 'User-1 007',
    });
  } catch (error) {
    console.log(error);
  }

  client.on('close', () => {
    console.log('Publisher has been disconnected from the NATS streaming');
    process.exit();
  });
});

process.on('SIGKILL', () => client.close());
process.on('SIGINT', () => client.close());
