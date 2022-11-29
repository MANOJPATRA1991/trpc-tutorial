import Link from 'next/link';
import { useRouter } from 'next/router';
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
    <>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {error && error.message}
        <h1>Register</h1>
        <input type="text" placeholder="Tom" {...methods.register('name')} />
        <br />
        <input
          type="email"
          placeholder="jane.doe@example.com"
          {...methods.register('email')}
        />
        <br />
        <input type="password" {...methods.register('password')} />
        <br />
        <input type="password" {...methods.register('passwordConfirm')} />
        <br />
        <button>Register</button>
      </form>

      <Link href="/login">Login</Link>
    </>
  );
};

export default RegisterPage;
