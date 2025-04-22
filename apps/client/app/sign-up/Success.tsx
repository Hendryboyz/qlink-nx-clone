import React from 'react';
import Link from 'next/link';
import Button from '../../components/Button';
import Title from '../../components/Title';
import { CheckIcon } from '@radix-ui/react-icons';

const Success = () => {

  return (
    <div className="w-full py-16 px-12 flex flex-col h-full flex-1">
      <Title className="mb-40 text-left w-33 font-bold text-primary">
        Welcome to the Club
      </Title>
      <h4 className="text-primary text-xl mx-auto flex">
        <div className="mr-2 rounded-3xl bg-green-900 text-white mt-0.5">
          <CheckIcon className="mr-2 w-full" height={24} />
        </div>
        Account activated
      </h4>
      <div className="mt-auto">
        <Link href="/">
          <Button>Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
