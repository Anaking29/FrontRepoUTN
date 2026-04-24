import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying...');
  const [error, setError] = useState(false);

  const called = React.useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`);
        setStatus(res.data.message);
        setError(false);
      } catch (err) {
        setStatus(err.response?.data?.message || 'Verification failed');
        setError(true);
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h2>Email Verification</h2>
        <p className={error ? 'error-message' : 'success-message'} style={{ fontSize: '1rem', margin: '20px 0' }}>
          {status}
        </p>
        <Link to="/login" className="btn">Go to Login</Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
