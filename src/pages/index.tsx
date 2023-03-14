import { NextPageWithLayout } from './_app';
import Link from 'next/link';
import { useUserContext } from '~/context/user.context';
import LoginPage from './login';
import { useRouter } from 'next/router';

const IndexPage: NextPageWithLayout = () => {
  const user = useUserContext();
  const router = useRouter();

  if (!user) {
    return <LoginPage />;
  } else {
    router.push('/posts');
  }

  return null;
};

export default IndexPage;
