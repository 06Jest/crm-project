
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { 
  getCurrentUser,
  refresh,
  changePassword,
  signOut,
  signUp,
  signIn
} from "../store/userSlice";
import type { ChangePasswordDTO, SignInDTO, SignUpDTO } from "../types/auth";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.user);

  return {
    ...auth,
    currentUser: () => dispatch(getCurrentUser()),
    register: (dto: SignUpDTO) => dispatch(signUp(dto)),
    login: (dto: SignInDTO) => dispatch(signIn(dto)),
    isOwner: auth.user?.membership?.[0]?.role === "owner",
    isManager: auth.user?.membership?.[0]?.role === "manager",
    isAgent: auth.user?.membership?.[0]?.role === "agent",
    refreshtoken: () => dispatch(refresh()),
    changePass: (dto: ChangePasswordDTO) =>
    dispatch(changePassword(dto)),
    logout: () => dispatch(signOut()),
  };
};