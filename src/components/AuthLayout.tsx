import Head from 'next/head';
import { ReactNode } from 'react';

type DefaultLayoutProps = { children: ReactNode };

export const AuthLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="flex flex-col justify-center items-center max-w-sm bg-white-200 m-auto shadow-lg rounded-3xl p-12">
      {children}
    </div>
  );
};
