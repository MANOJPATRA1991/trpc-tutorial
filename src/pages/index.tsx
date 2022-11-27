import { NextPageWithLayout } from './_app';
import Link from 'next/link';
import { useUserContext } from '~/context/user.context';
import LoginForm from '~/components/LoginForm';

const IndexPage: NextPageWithLayout = () => {
  const user = useUserContext();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <Link href="posts/create">Create post</Link>
    </div>
  );
};

export default IndexPage;
