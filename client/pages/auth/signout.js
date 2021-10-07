import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const Signout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    body: {},
    method: 'post',
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <></>;
};

export default Signout;
