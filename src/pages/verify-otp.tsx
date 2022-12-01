import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';
import { AuthLayout } from '~/components/AuthLayout';
import OTPInput from '~/components/OTPInput';
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
      router.replace(data?.redirect || '/');
    },
  });

  function onSubmit(values: VerifyOtpInput) {
    mutate({
      ...values,
    });
  }

  return (
    <AuthLayout>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {error && error.message}
        <h1 className="font-bold text-center text-2xl mb-6">Verify OTP</h1>
        <Controller
          control={methods.control}
          name={methods.register('otp').name}
          render={({ field: { onChange } }) => (
            <OTPInput valueLength={6} onChange={onChange} />
          )}
        />
        <button
          disabled={!methods.formState.isValid}
          className="mt-6 w-full mb-6 shadow bg-orange-300 hover:bg-orange-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-lg"
        >
          Verify
        </button>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtpPage;
