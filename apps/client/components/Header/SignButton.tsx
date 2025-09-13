"use client";
import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';

function SignButton() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <a
        className="hover:cursor-pointer hover:underline text-gray-500"
        onClick={() => signIn(undefined)}
      >
        <img height={18} width={18} className="inline mr-2 pb-0.5" src='/assets/logout.svg' />
        Login
      </a>
    )
  }
  return (
    <a
      className="hover:cursor-pointer hover:underline text-gray-500"
      onClick={() => signOut({callbackUrl: '/sign-in'})}
    >
      <img height={18} width={18} className="inline mr-2 pb-0.5" src='/assets/logout.svg' />
      Logout
    </a>
  )
}

export default SignButton;
