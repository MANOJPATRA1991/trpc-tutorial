import Link from 'next/link';
import { useRouter } from 'next/router';
import { useZodForm } from '~/hooks/useZodForm';
import { VerifyOtpInput, verifyOtpSchema } from '~/server/schema/user.schema';
import { trpc } from '~/utils/trpc';

const VerifyOtpPage = () => {
  const router = useRouter();

  const methods = useZodForm({
    schema: verifyOtpSchema,
    defaultValues: {
      otp: '',
    },
  });

  const { data, mutate, error } = trpc.users['verify-otp'].useMutation({
    onSuccess() {
      router.push(data?.redirect || '/');
    },
  });

  function onSubmit(values: VerifyOtpInput) {
    mutate({
      ...values,
    });
  }

  return (
    <>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {error && error.message}
        <h1>Verify OTP</h1>
        <input type="text" {...methods.register('otp')} />
        <br />
        <button>Verify</button>
      </form>
      <Link href="/register">Register</Link>
    </>
  );
};

export default VerifyOtpPage;
