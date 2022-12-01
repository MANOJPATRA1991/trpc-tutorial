import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthLayout } from '~/components/AuthLayout';
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
    <AuthLayout>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {login.error && login.error.message}
        <h1 className="font-bold text-center text-2xl mb-6">Login</h1>
        <p className="mb-6 text-sm text-center">
          Hey, Enter your details to get into your account
        </p>
        <input
          className="placeholder:text-xs mb-2 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-400"
          type="email"
          placeholder="Enter email address"
          {...methods.register('email')}
        />
        <input
          className="placeholder:text-xs mb-6 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-400"
          type="password"
          placeholder="Password"
          {...methods.register('password')}
        />
        <button className="w-full mb-6 shadow bg-orange-300 hover:bg-orange-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-lg">
          Log in
        </button>
      </form>
      <div>
        <p className="text-xs">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Don't have an account?{' '}
          <Link href="/register">
            <a className="font-bold text-orange-300 hover:text-orange-400">
              Register
            </a>
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
