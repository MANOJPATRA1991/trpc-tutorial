import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useEffect } from 'react';
import { DefaultLayout } from '~/components/DefaultLayout';
import { UserContextProvider } from '~/context/user.context';
import { trpc } from '~/utils/trpc';
import '../styles/globals.scss';

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter();
  const { data, isLoading, refetch } = trpc.users['me'].useQuery(undefined, {
    enabled: false,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route]);

  if (isLoading) {
    return <>Loading user...</>;
  }

  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <UserContextProvider value={data}>
      <main>{getLayout(<Component {...pageProps} />)}</main>
    </UserContextProvider>
  );
}) as AppType;

export default trpc.withTRPC(MyApp);
