import StripeCheckout from 'react-stripe-checkout';
import { useEffect, useState } from 'react';
import UseRequest from '../../hooks/useRequest';
import Router from 'next/router';

const NewOrder = ({ orderDetails, currentUser }) => {
  const { doRequest, errors } = UseRequest({
    body: {
      orderId: orderDetails.id,
    },
    method: 'post',
    onSuccess: () => {
      Router.push('/orders/myorders');
    },
    url: '/api/payments',
  });

  const onCardHandler = (data) => {
    doRequest({ token: data.id });
  };

  const [expires, setExpires] = useState(0);

  useEffect(() => {
    const msTimeLeft = () => {
      const diff = new Date(orderDetails.expiresAt).getTime() - new Date().getTime();
      setExpires(Math.floor(diff / 1000));
    };

    msTimeLeft();
    const timeId = setInterval(msTimeLeft, 1000);

    return () => {
      clearTimeout(timeId);
    };
    //eslint-disable-next-line
  }, []);

  if (expires < 0) return <div>Order Expired</div>;

  return (
    <>
      <div>Order Expiries in some time {expires}</div>
      {errors}
      <StripeCheckout
        token={(data) => onCardHandler(data)}
        email={currentUser.email}
        amount={orderDetails.price * 100}
        stripeKey="pk_test_51JleIoSE2LGKCeXgWmeRqxiMW8cEPe4z07T2eFqmDoneM4icnDaCob5ZKa7ZvdEQXkQ5Cw4ORFTzqKbaunVSpSqV009JdbafDf"
      />
    </>
  );
};

NewOrder.getInitialProps = async (context, baseUrl) => {
  const { orderId } = context.query;
  const { data } = await baseUrl.get(`/api/orders/${orderId}`);
  return { orderDetails: data };
};

export default NewOrder;
