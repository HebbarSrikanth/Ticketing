import { useState } from 'react';
import styles from '../../style.module.css';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const Signup = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [confirmPassword, setConfirm] = useState(``);
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    body: {
      email,
      password,
    },
    method: 'post',
    onSuccess: () => Router.push('/'),
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (email.trim() !== '' && password !== '' && confirmPassword !== '') {
      if (password.trim() === confirmPassword.trim()) {
        await doRequest();
      }
    } else {
      console.log('All the fields are mandatory');
    }
  };

  return (
    <div className={styles.signup}>
      <h3 style={{ textAlign: 'center' }}>Sign Up</h3>
      {errors}
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="form-group">
          <label>Email</label>
          <input type="text" className="form-control" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginTop: '2%' }}>
          <button className="btn btn-primary">Signup</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
