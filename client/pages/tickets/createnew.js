import { useState } from 'react';
import styles from '../../style.module.css';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    method: 'post',
    body: {
      title,
      price,
    },
    url: '/api/tickets',
    onSuccess: (data) => Router.push('/'),
  });

  //To round of the price
  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (title.trim() !== '' && !isNaN(parseFloat(price))) {
      doRequest();
    } else {
      console.log('Title and Price are not in proper format');
    }

    setPrice('');
    setTitle('');
  };

  return (
    <div className={styles.signup}>
      <h3>Create New Ticket</h3>
      <form onSubmit={onSubmitHandler}>
        {errors}
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
          />
        </div>
        <div className="form-group" style={{ marginTop: '2%' }}>
          <button className="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
};

export default NewTicket;
