import { router } from '../trpc';
import {
  verifyOtp,
  getUser,
  requestOtp,
  registerUser,
  loginUser,
  logoutUser,
  refreshUserToken,
} from '../procedures/user';

export const userRouter = router({
  me: getUser,
  login: loginUser,
  'verify-otp': verifyOtp,
  'request-otp': requestOtp,
  'register-user': registerUser,
  logout: logoutUser,
  'refresh-token': refreshUserToken,
});
