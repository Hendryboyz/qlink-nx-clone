import { type FC } from 'react';
import { TGButton } from '@org/components';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const SignUpSuccess: FC = () => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="relative flex-1 w-full">
        <Image
          src="/assets/v2/register-success.png"
          alt="Welcome to the club"
          className="absolute inset-0 w-full h-full object-cover"
          width={1200}
          height={2000}
        />
      </div>

      <div className="w-full p-6 bg-white pb-10">
        <TGButton
          fullWidth
          size="xl"
          variant="outline"
          onClick={() => router.push('/sign-in')}
        >
          Start Explore
        </TGButton>
      </div>
    </div>
  );
};

export default SignUpSuccess;
