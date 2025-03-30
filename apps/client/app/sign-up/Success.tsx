import React from 'react';
import Button from '../../components/Button';
import Title from '../../components/Title';
import Link from 'next/link';

const Success = () => {

  return (
    <div className="w-full py-16 px-12 flex flex-col h-full flex-1">
      <Title className="mb-40 text-left w-33 pr-28 font-bold text-primary">
        Welcome to the Club
      </Title>
      <h4 className="text-primary text-xl">Account activated</h4>
      <div className="mt-auto">
        <Link href="/garage/add">
          <Button>Register My Products Now</Button>
        </Link>
        <Link href="/home">
          <Button theme="transparent" className="text-white">
            Skip
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
