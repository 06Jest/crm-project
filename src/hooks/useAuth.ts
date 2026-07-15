
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { 
  getCurrentUser,
  adminSignIn,
  agentSignIn,
  refresh,
  changePassword,
  signOut,
  signUp
} from "../store/userSlice";
import type { ChangePasswordDTO, SignInDTO, SignUpDTO } from "../types/auth";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.user);

  return {
    ...auth,
    currentUser: () => dispatch(getCurrentUser()),
    register: (dto: SignUpDTO) => dispatch(signUp(dto)),
    adminLogin: (dto: SignInDTO) => dispatch(adminSignIn(dto)),
    agentLogin: (dto: SignInDTO) => dispatch(agentSignIn(dto)),
    isAdmin: auth.user?.role === 'admin',
    isAgent: auth.user?.role === 'agent',
    refreshtoken: () => dispatch(refresh()),
    changePass: (dto: ChangePasswordDTO) =>
    dispatch(changePassword(dto)),
    logout: () => dispatch(signOut()),
  };
};