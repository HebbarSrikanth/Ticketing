import { Ticket } from '../tickets';
import mongoose from 'mongoose';

it('Check for the optimistic conurrency', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  //Build a ticket
  const ticket = Ticket.build({
    price: Number(120).toString(),
    title: 'Ticket-1',
    userId: '1234567',
  });
  //Save a ticket
  await ticket.save();
  console.log('First Save', ticket);

  //Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //Update firstInstance
  firstInstance!.set({ title: 'Ticket-2', price: 100 });
  await firstInstance!.save();
  console.log(firstInstance);

  try {
    secondInstance!.set({ title: 'Ticket-3', price: 120 });
    await secondInstance!.save();
  } catch (error) {
    return;
  }
});
