import 'bootstrap/dist/css/bootstrap.css';
import Header from '../Components/Header';
import initialRequest from '../service/initialRequest';

//Next JS is gonna import it and pass it to app inside as props
//We have to include global Css,we can only export global css in only app component
//If we load up other compnonet next won't load up the css file in final html page
const AppComponent = ({ Component, pageProps }) => {
  return (
    <>
      <Header {...pageProps} />
      <Component {...pageProps} />;
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const baseUrl = initialRequest(appContext.ctx);

  const { data } = await baseUrl.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
