import Link from 'next/link';
import { useRouter } from 'next/router';
import { useZodForm } from '~/hooks/useZodForm';
import { LoginUserInput, loginUserSchema } from '~/server/schema/user.schema';
import { trpc } from '~/utils/trpc';

const LoginPage = () => {
  const router = useRouter();

  const methods = useZodForm({
    schema: loginUserSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const requestOtp = trpc.users['request-otp'].useMutation({
    onSuccess() {
      router.push('/verify-otp');
    },
  });

  const login = trpc.users['login'].useMutation({
    onSuccess() {
      requestOtp.mutate({
        email: methods.getValues('email'),
      });
    },
  });

  function onSubmit(values: LoginUserInput) {
    login.mutate({
      ...values,
    });
  }

  return (
    <>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {login.error && login.error.message}
        <h1>Login</h1>
        <input
          type="email"
          placeholder="jane.doe@example.com"
          {...methods.register('email')}
        />
        <br />
        <input type="password" {...methods.register('password')} />
        <button>Login</button>
      </form>
      <Link href="/register">Register</Link>
    </>
  );
};

export default LoginPage;
