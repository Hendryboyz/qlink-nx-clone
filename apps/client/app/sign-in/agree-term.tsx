'use client';
import { FC } from 'react';

import Link from 'next/link';
import { ErrorMessage } from 'formik';
import { Checkbox } from '@org/components';

const AgreeTerm: FC<{
  checked: boolean;
  onChange: (e: boolean) => void;
}> = ({ checked, onChange }) => {
  return (
    <div className="flex items-center mb-6">
      <div className="flex items-center h-5">
        <Checkbox
          id="agreedToTerms"
          name="agreedToTerms"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm text-text-str">
        <label htmlFor="agreedToTerms">
          <span>{"I agree to the Qlink Rider Club's "}</span>
          <Link
            href="/legal?tab=terms&hideheader=true"
            className="text-primary underline font-bold"
          >
            Terms of Service
          </Link>
          <span>{` and `}</span>
          <Link
            href="/legal?tab=policy&hideheader=true"
            className="text-primary underline font-bold"
          >
            Privacy Policy
          </Link>
          <span>{'. The service is for Nigeria only.'}</span>
        </label>
        <ErrorMessage
          name="agreedToTerms"
          className="text-error text-xs mt-1 block"
          component="div"
        />
      </div>
    </div>
  );
};

export default AgreeTerm;
