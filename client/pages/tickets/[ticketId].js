import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const ticketDetails = ({ currentTicket }) => {
  const { doRequest, errors } = useRequest({
    method: 'post',
    body: { ticketId: currentTicket.id },
    url: `/api/orders`,
    onSuccess: (data) => Router.push('/orders/[orderId]', `/orders/${data.id}`),
  });

  const submitHandler = () => {
    doRequest();
  };

  return (
    <div>
      <h1>{currentTicket.title}</h1>
      <h4>Price :{currentTicket.price}</h4>
      {errors}
      <button className="btn btn-success" onClick={submitHandler}>
        Order Now
      </button>
    </div>
  );
};

ticketDetails.getInitialProps = async (context, baseUrl) => {
  const { query } = context;
  const { data } = await baseUrl.get(`/api/tickets/${query.ticketId}`);
  return { currentTicket: data };
};

export default ticketDetails;
