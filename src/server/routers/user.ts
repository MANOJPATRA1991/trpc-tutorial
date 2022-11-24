import { router } from '../trpc';
import {
  verifyOtp,
  getUser,
  requestOtp,
  registerUser,
} from '../procedures/user';

export const userRouter = router({
  me: getUser,
  'verify-otp': verifyOtp,
  'request-otp': requestOtp,
  'register-user': registerUser,
});
