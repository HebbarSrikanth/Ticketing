const MyOrders = ({ orders }) => {
  const myOrders = orders.map((order) => (
    <tr key={order.id}>
      <td>{order.ticket.title}</td>
      <td>{order.ticket.price}</td>
      <td>{order.status}</td>
    </tr>
  ));

  return (
    <>
      <h2>My Orders</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{myOrders}</tbody>
      </table>
    </>
  );
};

MyOrders.getInitialProps = async (context, baseUrl) => {
  const { data } = await baseUrl.get('/api/orders');
  return { orders: data };
};

export default MyOrders;
