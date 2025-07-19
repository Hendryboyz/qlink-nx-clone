import React, { useEffect } from 'react';
import Link from 'next/link';
import Button from '../../components/Button';
import Title from '../../components/Title';

const Success = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full pt-9 pb-12 px-12 flex flex-col h-full flex-1">
      <Title className="mb-36 text-left w-33 text-primary">
        Welcome to the Club
      </Title>
      <h4 className="text-primary text-xl mx-auto flex">
        <img
          className="mr-2 rounded-3xl text-white mt-0.5"
          src="assets/success_circle.svg"
          alt="check_circle"
        />
        <p>Account activated</p>
      </h4>
      <div className="grid grid-cols-1 grid-rows-6">
        <Link href="/" className="row-start-5">
          <Button>Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
