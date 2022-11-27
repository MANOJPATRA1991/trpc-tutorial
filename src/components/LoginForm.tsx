import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useZodForm } from '~/hooks/useZodForm';
import { LoginUserInput, loginUserSchema } from '~/server/schema/user.schema';
import { trpc } from '~/utils/trpc';

const VerifyToken = ({ hash }: { hash: string }) => {
  const router = useRouter();
  const { data, isLoading } = trpc.users['verify-otp'].useQuery({
    hash,
  });

  if (isLoading) {
    return <p>Verifying...</p>;
  }

  router.push(data?.redirect.includes('login') ? '/' : data?.redirect || '/');
  return <p>Redirecting...</p>;
};

const LoginForm = () => {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const hash = router.asPath.split('#token=')[1];

  const { mutate, error } = trpc.users['request-otp'].useMutation({
    onSuccess() {
      setSuccess(true);
    },
  });

  const methods = useZodForm({
    schema: loginUserSchema,
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: LoginUserInput) {
    mutate({
      ...values,
      redirect: router.asPath,
    });
  }

  if (hash) {
    return <VerifyToken hash={hash} />;
  }

  return (
    <>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {error && error.message}
        {success && <p>Check your email</p>}
        <h1>Login</h1>
        <input
          type="email"
          placeholder="jane.doe@example.com"
          {...methods.register('email')}
        />
        <button>Login</button>
      </form>

      <Link href="/register">Register</Link>
    </>
  );
};

export default LoginForm;
