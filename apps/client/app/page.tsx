'use client'

import Link from 'next/link';
import Button from '../components/Button';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
// check login status, if login-in, direct to /home
  }, [])
  return (
    <div className="w-full flex flex-col justify-between items-center min-h-full flex-1 bg-primary">
      <Banner />
      <div className="text-center w-full p-14">
        <Button className="mb-6" theme='light'>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
        <Button className="mb-4">
          <Link href="/sign-in">
          Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
}

const Banner = () => {
  return (
    <div className="border-white border-solid text-white border-2 w-fit text-3xl text-h  p-1 font-bold mt-auto mb-auto">
      <p>QLINK</p>
      <p className="tracking-wide">RIDER</p>
      <p className="tracking-widest">CLUB</p>
    </div>
  );
};
