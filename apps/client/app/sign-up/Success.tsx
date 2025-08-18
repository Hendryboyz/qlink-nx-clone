import React, { useEffect } from 'react';
import Link from 'next/link';
import Button from '../../components/Button';
import Title from '../../components/Title';

const Success = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full pt-8 pb-12 px-12 flex flex-col h-full flex-1">
      <div className="mb-32">
        <Title className="mb-[8px] text-left w-33 text-primary">
          Welcome to the Club
        </Title>
      </div>
      <h4 className="text-primary text-xl flex">
        <img
          className="mr-2 rounded-3xl text-white mt-0.5"
          src="assets/success_circle.svg"
          alt="check_circle"
        />
        <p className="font-gilroy-medium font-normal leading-none mt-[6px]">Account activated</p>
      </h4>
      <div className="mt-60">
        <Link href="/">
          <Button>Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
