import { NextPageWithLayout } from './_app';
import Link from 'next/link';
import { useUserContext } from '~/context/user.context';
import LoginPage from './login';

const IndexPage: NextPageWithLayout = () => {
  const user = useUserContext();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div>
      <Link href="posts/create">Create post</Link>
    </div>
  );
};

export default IndexPage;
