import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Result
      status="404"
      title="Page Not Found"
      subTitle="Sorry, the page does not exist."
      extra={
        <Button type="primary">
          <Link to="/">Back Home</Link>
        </Button>
      }
    />
  );
};

export default NotFound;
