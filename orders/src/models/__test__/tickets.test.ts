import { Ticket } from '../tickets';
import mongoose from 'mongoose';

it('Check for the optimistic conurrency', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  //Build a ticket
  const ticket = Ticket.build({
    id,
    price: 120,
    title: 'Ticket-1',
  });
  //Save a ticket
  await ticket.save();

  //Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //Update firstInstance
  firstInstance!.set({ title: 'Ticket-2', price: 100 });
  await firstInstance!.save();

  try {
    secondInstance!.set({ title: 'Ticket-3', price: 120 });
    await secondInstance!.save();
  } catch (error) {
    return;
  }
});
