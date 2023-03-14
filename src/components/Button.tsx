import React, { ReactNode } from 'react';

type TButton = {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: boolean;
};

export const Button = ({ children, onClick, disabled = false }: TButton) => {
  return (
    <button
      disabled={disabled}
      {...(onClick && { onClick })}
      className="my-3 disabled:bg-gray-500 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
};
