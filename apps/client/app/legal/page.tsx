'use client';

import { Suspense } from 'react';
import LegalContent from './LegalContent';

export default function Legal() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LegalContent />
    </Suspense>
  );
}


