import { createContext, ReactNode, useContext } from 'react';
import { RouterOutput } from '~/utils/trpc';

const UserContext = createContext<RouterOutput['users']['me']>(null);

function UserContextProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: RouterOutput['users']['me'] | undefined;
}) {
  return (
    <UserContext.Provider value={value || null}>
      {children}
    </UserContext.Provider>
  );
}

const useUserContext = () => useContext(UserContext);

export { useUserContext, UserContextProvider };
