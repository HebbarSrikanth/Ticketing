import 'bootstrap/dist/css/bootstrap.css';
import Header from '../Components/Header';
import initialRequest from '../service/initialRequest';

//Next JS is gonna import it and pass it to app inside as props
//We have to include global Css,we can only export global css in only app component
//If we load up other compnonet next won't load up the css file in final html page{ Component, pageProps }
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header {...pageProps} currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  //AppContent.ctx will provide us the details that are required
  const baseUrl = initialRequest(appContext.ctx);

  //And we make a request to the ingress-nginx if its from the server
  const { data } = await baseUrl.get('/api/users/currentuser');

  let pageProps = {};

  //Check if the COmponent has any initialProps thats needs tobe
  //executed as and when that particular component is rendered on screen
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, baseUrl);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
