import initialRequest from '../service/initialRequest';

const Index = ({ currentUser }) => {
  return <h1>{currentUser ? `You're signed in ${currentUser.email}` : `You are not signed in`}</h1>;
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
  const { data } = await baseUrl.get('/api/users/currentuser');
  return data;
};

export default Index;
