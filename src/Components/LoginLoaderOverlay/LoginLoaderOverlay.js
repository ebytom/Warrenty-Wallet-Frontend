import { Spin } from 'antd';
import React from 'react';

const LoginLoaderOverlay = ({ isVisible }) => {
  return (
    isVisible ? (
      <div className="login-loader-overlay">
        <div className="loader">
        <Spin size="large" />
        </div>
      </div>
    ) : null
  );
};

export default LoginLoaderOverlay;
