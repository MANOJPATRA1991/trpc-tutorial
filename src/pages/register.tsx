import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthLayout } from '~/components/AuthLayout';
import { useZodForm } from '~/hooks/useZodForm';
import {
  CreateUserInput,
  registerUserSchema,
} from '~/server/schema/user.schema';
import { trpc } from '~/utils/trpc';

const RegisterPage = () => {
  const router = useRouter();

  const { mutate, error } = trpc.users['register-user'].useMutation({
    onSuccess() {
      router.push('/login');
    },
  });

  const methods = useZodForm({
    schema: registerUserSchema,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  function onSubmit(values: CreateUserInput) {
    console.log(values);
    mutate(values);
  }

  return (
    <AuthLayout>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {error && error.message}
        <h1 className="font-bold text-center text-2xl mb-6">Register</h1>
        <input
          className="placeholder:text-xs mb-2 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-400"
          type="text"
          placeholder="Enter your name"
          {...methods.register('name')}
        />
        <input
          className="placeholder:text-xs mb-2 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-400"
          type="email"
          placeholder="Enter email address"
          {...methods.register('email')}
        />
        <input
          className="placeholder:text-xs mb-2 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-400"
          type="password"
          placeholder="Enter password"
          {...methods.register('password')}
        />
        <input
          className="placeholder:text-xs mb-6 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-400"
          type="password"
          placeholder="Confirm password"
          {...methods.register('passwordConfirm')}
        />
        <button className="w-full mb-6 shadow bg-orange-300 hover:bg-orange-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-lg">
          Register
        </button>
      </form>

      <div>
        <p className="text-xs">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Are you an existing user?{' '}
          <Link href="/login">
            <a className="font-bold text-orange-300 hover:text-orange-400">
              Login
            </a>
          </Link>{' '}
          here.
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
