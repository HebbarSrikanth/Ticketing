import { useState } from 'react';
import axios from 'axios';

const UseRequest = ({ method, url, body, onSuccess }) => {
  const [errors, setError] = useState(null);

  const doRequest = async (data = {}) => {
    try {
      setError(null);
      const res = await axios[method](url, { ...body, ...data });

      if (onSuccess) {
        onSuccess(res.data);
      }

      return res.data;
    } catch (error) {
      setError(
        <div className="alert alert-danger">
          <ul className="my-0">
            {error.response.data.errors.map((e) => {
              return <li key={e.message}>{e.message}</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default UseRequest;
