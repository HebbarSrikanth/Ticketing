import initialRequest from '../service/initialRequest';
import Link from 'next/link';

const Index = ({ tickets }) => {
  const tableRows = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ));

  const tableDetails =
    tableRows.length > 0 ? (
      tableRows
    ) : (
      <tr>
        <td>No Tickets available</td>
      </tr>
    );

  return (
    <>
      <h1>Tickets</h1>
      <table className="table table-striped table-bordered">
        <caption>List of Tickets</caption>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>{tableDetails}</tbody>
      </table>
    </>
  );
};

//Is the initial function that will run when
//1.Hard Refresh is made
//2.When typed through browser
//3.When navigated to this domain through other external link
//All the above three times the request is made from server side

//The request is made through browser when
// 1. Navigated to index from the other pages that is inside the function

Index.getInitialProps = async (context) => {
  const baseUrl = initialRequest(context);
  const { data } = await baseUrl.get('/api/tickets');
  return { tickets: data };
};

export default Index;
