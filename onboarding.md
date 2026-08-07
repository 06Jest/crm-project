I am building a production-ready SaaS CRM using:

- React
- TypeScript
- Material UI (MUI)
- Redux Toolkit
- React Router v6

Generate FOUR React components:

1. Onboarding.tsx
2. ProfileStep.tsx
3. WorkspaceStep.tsx
4. SubscriptionStep.tsx

Requirements
============

This is the onboarding flow after a user has:

1. Registered with Email + Password
2. Verified their email
3. Logged in successfully

The backend already creates an initial profile automatically.

If the backend returns:

needsOnboarding = true

the user is redirected to:

/onboarding

Do NOT implement backend logic.
Do NOT create API services.
Only create the React pages.

-----------------------------------
Onboarding.tsx
-----------------------------------

Acts as the parent wizard.

Responsibilities:

- Manage current step with useState
- Render:
    Step 1 -> ProfileStep
    Step 2 -> WorkspaceStep
    Step 3 -> SubscriptionStep
- Show a Material UI Stepper at the top.
- Responsive.
- Centered card.
- Modern SaaS design.
- No routing between steps.
- Use MUI Paper.
- Maximum width around 650px.

-----------------------------------
ProfileStep.tsx
-----------------------------------

Collect only profile information.

Fields:

- Avatar upload (optional placeholder only)
- First Name *
- Last Name *
- Job Title *

Buttons:

Back (disabled on first page)

Continue

Validation:

All required except avatar.

Props:

interface ProfileStepProps {
    onNext: () => void;
}

Do NOT call APIs.

Simply call:

onNext()

after successful validation.

Use:

- Grid
- Stack
- TextField
- Avatar
- Button
- Typography

Material UI only.

-----------------------------------
WorkspaceStep.tsx
-----------------------------------

Collect workspace information.

User chooses between:

○ Personal Workspace

○ Organization

Use MUI RadioGroup.

If Personal is selected:

Show:

Workspace Name *

If Organization is selected:

Show:

Organization Name *

Organization Type

Select:

- Business
- Personal

Buttons:

Back

Continue

Props:

interface WorkspaceStepProps {
    onBack: () => void;
    onNext: () => void;
}

Do NOT call APIs.

Use local state only.

-----------------------------------
SubscriptionStep.tsx
-----------------------------------

Collect subscription selection.

Display three subscription cards using Material UI.

Plans:

Free

- Up to 3 members
- Basic CRM features
- Email support

Pro

- Unlimited members
- Advanced CRM features
- Analytics
- Priority support

Enterprise

- Everything in Pro
- Dedicated support
- Custom integrations
- SLA

Use Material UI Cards.

Each card should display:

- Plan name
- Short description
- Feature list
- Action button

The Free plan should be visually highlighted as "Recommended".

Buttons:

Back

Finish Setup

Props:

interface SubscriptionStepProps {
    onBack: () => void;
}

Do NOT call APIs.

Use local state only.

-----------------------------------

Design Requirements

- Material UI only
- Responsive
- Professional SaaS look
- Clean spacing
- Consistent typography
- TypeScript strict mode
- Functional components
- Hooks only
- No any types
- No inline magic numbers when avoidable
- No backend code
- No Redux
- No API calls
- No placeholder lorem ipsum
- No Gradient
- No Mock data

The generated code should be clean enough to copy directly into a production project.

useauth: 
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
    isOwner: auth.user?.membership.role === 'owner',
    isManager: auth.user?.membership.role === 'manager',
    isAgent: auth.user?.membership.role === 'agent',
    refreshtoken: () => dispatch(refresh()),
    changePass: (dto: ChangePasswordDTO) =>
    dispatch(changePassword(dto)),
    logout: () => dispatch(signOut()),
  };
};

slice:
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signInAPI, changePasswordAPI, getCurrentUserAPI, refreshAPI, signOutAPI, signUpAPI } from '../services/authService';
import type { ChangePasswordDTO, SignInDTO, SignUpDTO, UserState } from '../types/auth';

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  loaded: false,
  error: null,
};

export const signUp = createAsyncThunk(
  "auth/signup",
  async (dto: SignUpDTO, thunkAPI) => {
    try {
      return await signUpAPI(dto);

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to sign up user"
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, thunkAPI) => {
    try {
      return await getCurrentUserAPI();

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to get current user"
      );
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signin",
  async (dto: SignInDTO, thunkAPI) => {
    try {
      return await signInAPI(dto);

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to sign in user"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/change-password",
  async (dto: ChangePasswordDTO, thunkAPI) => {
    try {
      return await changePasswordAPI(dto);

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to change password"
      );
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signout",
  async (_, thunkAPI) => {
    try {
      return await signOutAPI();

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to sign out user"
      );
    }
  }
);

export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      return await refreshAPI();

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to refresh token"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })



      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.user = action.payload.profile;
        state.isAuthenticated = true;
      })

      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.loaded = true;
        state.user = null;
        state.isAuthenticated = false;
      })


      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.profile;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.loaded = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;

      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(refresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refresh.fulfilled, (state) => {
        state.loading = false;
        state.loaded = true;
        state.isAuthenticated = true;

      })
      .addCase(refresh.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 

api:
import type { ChangePasswordDTO, SignInDTO, SignUpDTO } from "../types/auth";
import { apiClient } from "./apiClient";


export const signUpAPI = async (dto: SignUpDTO) => {
  return apiClient("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};


export const signInAPI = async (dto: SignInDTO) => {
  return apiClient("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};


export const getCurrentUserAPI = async () => {
  return apiClient("/api/auth/me", {
    method: "GET",
  });
};


export const refreshAPI = async () => {
  return apiClient("/api/auth/refresh", {
    method: "PATCH",
  });
};


export const changePasswordAPI = async (
  dto: ChangePasswordDTO
) => {
  return apiClient("/api/auth/me/change-password", {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
};


export const signOutAPI = async () => {
  return apiClient("/api/auth/signout", {
    method: "DELETE",
  });
};

BACKEND........:

routes:
import {
  createSupabaseClient,
  createSupabaseUserClient,
} from "../config/supabase";

import type {
  SignUpDTO,
  SignInDTO,
  ChangePasswordDTO,
  RequestMeta,
  TokenPair,
} from "../types/auth";

import { AppError } from "../middleware/error.middleware";

import {
  createAccessToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllForProfile,
} from "./jwt.service";

import {  getProfileIfExistFromDB } from "./profiles.service";
import { getMembershipForAuthFromDB } from "./organization.members.service";

export const signUpWithAuth = async (
  dto: SignUpDTO
) => {
  const db = createSupabaseClient();

  const { data, error } = await db.auth.signUp({
    email: dto.email.trim().toLowerCase(),
    password: dto.password,
  });

  if (error) {
    throw new AppError(
      400,
      `Failed to create account: ${error.message}`
    );
  }

  if (!data.user) {
    throw new AppError(
      500,
      "Failed to create user."
    );
  }

  return data.user;
};

export const signInWithAuth = async (
  dto: SignInDTO
) => {
  const db = createSupabaseClient();

  const { data, error } =
    await db.auth.signInWithPassword({
      email: dto.email.trim().toLowerCase(),
      password: dto.password,
    });

  if (error) {
    throw new AppError(
      400,
      `Failed to log in: ${error.message}`
    );
  }

  return data;
};

export const newRefresh = async (
  rawRefreshToken: string,
  meta: RequestMeta
): Promise<TokenPair> => {

  const {
    newRawToken,
    profileId,
  } = await rotateRefreshToken(
    rawRefreshToken,
    meta
  );


  const profile =
    await getProfileIfExistFromDB(profileId);


  if (!profile) {
    throw new AppError(
      404,
      "Profile not found"
    );
  }


  let membership = null;


  if (profile.onboarding_completed) {

    membership =
      await getMembershipForAuthFromDB(
        profile.id
      );

    if (!membership) {
      throw new AppError(
        403,
        "Organization membership not found"
      );
    }
  }


  const accessToken =
    createAccessToken(
      profile,
      membership
    );


  return {
    accessToken,
    refreshToken: newRawToken,
  };
};

export const requestPasswordReset = async (
  email: string
): Promise<void> => {
  const db = createSupabaseClient();

  const { error } =
    await db.auth.resetPasswordForEmail(email);

  if (error) {
    throw new AppError(
      400,
      `Failed to request password reset: ${error.message}`
    );
  }
};

export const changePasswordFromAuth = async (
  user: ChangePasswordDTO,
  accessToken: string
): Promise<void> => {
  const db = createSupabaseUserClient(accessToken);

  const { error: verifyError } =
    await db.auth.signInWithPassword({
      email: user.email,
      password: user.current_password,
    });

  if (verifyError) {
    throw new AppError(
      401,
      "Current password is incorrect"
    );
  }

  const { error } =
    await db.auth.updateUser({
      password: user.new_password,
    });

  if (error) {
    throw new AppError(
      500,
      `Failed to update password: ${error.message}`
    );
  }

  await revokeAllForProfile(user.id);
};

export const signOutFromAuth = async (
  rawRefreshToken: string
): Promise<void> => {
  await revokeRefreshToken(rawRefreshToken);
};

export const signOutAllSessions = async (
  profileId: string
): Promise<void> => {
  await revokeAllForProfile(profileId);
};

controller:
import { NextFunction, Request, Response } from "express";

import {
  changePasswordFromAuth,
  signUpWithAuth,
  signInWithAuth,
  signOutFromAuth,
  newRefresh,
} from "../services/auth.service";

import {
  getProfileByIdFromDB,
  getProfileByIdForAuthFromDB,
  createProfileToDB,
  getProfileIfExistFromDB,
} from "../services/profiles.service";

import {
  createAccessToken,
  issueRefreshToken,
} from "../services/jwt.service";

import { AppError } from "../middleware/error.middleware";
import { signInSchema } from "../schema/auth.schema";
import { setAuthCookies } from "../services/cookies.service";
import type { RequestMeta, TokenPair } from "../types/auth";
import { getMembershipForAuthFromDB } from "../services/organization.members.service";


const metaFromRequest = (
  req: Request
): RequestMeta => ({
  ipAddress: req.ip,
  userAgent: req.headers["user-agent"],
});

const getAccessToken = (
  req: Request
): string => {

  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    throw new AppError(
      401,
      "Access token missing"
    );
  }
  return accessToken;
};

const issueSession = async (
  res: Response,
  profile: any,
  meta: RequestMeta
) => {

  const membership =
    profile.onboarding_completed
      ? await getMembershipForAuthFromDB(profile.id)
      : null;

  const accessToken = createAccessToken(
    profile,
    membership
  );

  const refreshToken = await issueRefreshToken(
    profile.id,
    membership?.org_id ?? null,
    meta
  );

  setAuthCookies(
    res,
    accessToken,
    refreshToken
  );
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.sub;
    const accessToken = getAccessToken(req);

    if (!userId) {
      throw new AppError(
        401,
        "Unauthorized"
      );
    }

    const profile = await getProfileByIdFromDB(
      userId,
      accessToken
    );

    res.status(200).json({
      success: true,
      profile,
    });

  } catch (err) {
    next(err);
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await signUpWithAuth(
      req.body
    );

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please verify your email.",
    });

  } catch(err) {
    next(err);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const meta = metaFromRequest(req);
    const credentials = signInSchema.parse(req.body);
    const auth = await signInWithAuth(credentials);

    if (!auth?.user) {
      throw new AppError(
        401,
        "Invalid credentials"
      );
    }

    const userId = auth.user.id;
    const userEmail = auth.user.email;

    if (!userEmail) {
      throw new AppError(
        400,
        "Email is required"
      );
    }

    let profile =
      await getProfileIfExistFromDB(
        userId
      );

    let needsOnboarding = false;

    if (!profile) {
      profile =
        await createProfileToDB({
          id: userId,
          email: userEmail,
        });
      needsOnboarding = true;
    } else {
      needsOnboarding =
        !profile.onboarding_completed;

      if (!needsOnboarding) {
        profile =
          await getProfileByIdForAuthFromDB(
            profile.id
          );
      }
    }
    await issueSession(
      res,
      profile,
      meta
    );
    res.status(200).json({
      success: true,
      message:
        "Login successful",
      profile,
      needsOnboarding,
    });
  } catch(err) {
    next(err);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user =
      req.user;
    const accessToken =
      req.cookies?.accessToken;

    if (!user || !accessToken) {
      throw new AppError(
        401,
        "Unauthorized"
      );
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      throw new AppError(
        400,
        "Current password and new password are required"
      );
    }

    const profile =
      await getProfileIfExistFromDB(
        user.sub
      );

    if (!profile?.email) {
      throw new AppError(
        404,
        "Profile email not found"
      );
    }

    await changePasswordFromAuth(
      {
        id: user.sub,
        email: profile.email,
        current_password: currentPassword,
        new_password: newPassword,
      },
      accessToken
    );
  
    res.status(204).send();
  } catch(err) {
    next(err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const meta =
      metaFromRequest(req);

    const refreshToken =
      req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        401,
        "Refresh token missing"
      );
    }

    const tokens: TokenPair =
      await newRefresh(
        refreshToken,
        meta
      );

    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken
    );
    res.status(204).send();
  } catch(err) {
    next(err);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const refreshToken =
      req.cookies?.refreshToken;
    if (refreshToken) {
      await signOutFromAuth(
        refreshToken
      );
    }

    res.clearCookie(
      "accessToken"
    );

    res.clearCookie(
      "refreshToken"
    );

    res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });
  } catch(err) {
    next(err);
  }

};

service:
import {
  createSupabaseClient,
  createSupabaseUserClient,
} from "../config/supabase";

import type {
  SignUpDTO,
  SignInDTO,
  ChangePasswordDTO,
  RequestMeta,
  TokenPair,
} from "../types/auth";

import { AppError } from "../middleware/error.middleware";

import {
  createAccessToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllForProfile,
} from "./jwt.service";

import {  getProfileIfExistFromDB } from "./profiles.service";
import { getMembershipForAuthFromDB } from "./organization.members.service";

export const signUpWithAuth = async (
  dto: SignUpDTO
) => {
  const db = createSupabaseClient();

  const { data, error } = await db.auth.signUp({
    email: dto.email.trim().toLowerCase(),
    password: dto.password,
  });

  if (error) {
    throw new AppError(
      400,
      `Failed to create account: ${error.message}`
    );
  }

  if (!data.user) {
    throw new AppError(
      500,
      "Failed to create user."
    );
  }

  return data.user;
};

export const signInWithAuth = async (
  dto: SignInDTO
) => {
  const db = createSupabaseClient();

  const { data, error } =
    await db.auth.signInWithPassword({
      email: dto.email.trim().toLowerCase(),
      password: dto.password,
    });

  if (error) {
    throw new AppError(
      400,
      `Failed to log in: ${error.message}`
    );
  }

  return data;
};

export const newRefresh = async (
  rawRefreshToken: string,
  meta: RequestMeta
): Promise<TokenPair> => {

  const {
    newRawToken,
    profileId,
  } = await rotateRefreshToken(
    rawRefreshToken,
    meta
  );


  const profile =
    await getProfileIfExistFromDB(profileId);


  if (!profile) {
    throw new AppError(
      404,
      "Profile not found"
    );
  }


  let membership = null;


  if (profile.onboarding_completed) {

    membership =
      await getMembershipForAuthFromDB(
        profile.id
      );

    if (!membership) {
      throw new AppError(
        403,
        "Organization membership not found"
      );
    }
  }


  const accessToken =
    createAccessToken(
      profile,
      membership
    );


  return {
    accessToken,
    refreshToken: newRawToken,
  };
};

export const requestPasswordReset = async (
  email: string
): Promise<void> => {
  const db = createSupabaseClient();

  const { error } =
    await db.auth.resetPasswordForEmail(email);

  if (error) {
    throw new AppError(
      400,
      `Failed to request password reset: ${error.message}`
    );
  }
};

export const changePasswordFromAuth = async (
  user: ChangePasswordDTO,
  accessToken: string
): Promise<void> => {
  const db = createSupabaseUserClient(accessToken);

  const { error: verifyError } =
    await db.auth.signInWithPassword({
      email: user.email,
      password: user.current_password,
    });

  if (verifyError) {
    throw new AppError(
      401,
      "Current password is incorrect"
    );
  }

  const { error } =
    await db.auth.updateUser({
      password: user.new_password,
    });

  if (error) {
    throw new AppError(
      500,
      `Failed to update password: ${error.message}`
    );
  }

  await revokeAllForProfile(user.id);
};

export const signOutFromAuth = async (
  rawRefreshToken: string
): Promise<void> => {
  await revokeRefreshToken(rawRefreshToken);
};

export const signOutAllSessions = async (
  profileId: string
): Promise<void> => {
  await revokeAllForProfile(profileId);
};

ADDITIONALS....:

Profile service:
import { createSupabaseClient, createSupabaseUserClient, supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/error.middleware';
import type {
  Profile,
  UpdateProfileDTO,
  DisplayProfile,
  CreateInitialProfileDTO,
  CompleteProfileDTO,
  ProfileStatus
} from '../types/profile';
import type { OnboardingStep, Roles } from '../types/global';
import { table } from '../config/tables';

const tab = table.profile;


export const getProfileIfExistFromDB = async (
  userId: string,
): Promise<Profile | null> => {

  const db = createSupabaseClient();

  const { data, error } = await db
    .from(tab)
    .select('*')
    .eq('id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw new AppError(500, `Failed to fetch profile: ${error.message}`);
  }
  return data;
};


export const getProfileByIdFromDB = async (
  userId: string,
  accessToken: string
): Promise<DisplayProfile> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .select(`
      *,
      org:organizations!profiles_org_id_fkey(
        display_id,
        name,
        type
      ),
      membership:organization_members!organization_members_profile_fkey(
        display_id,
        role,
        status,
        created_at
      )
    `)
    .eq('id', userId)
    .eq('status', 'active')
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw new AppError(500, `Failed to fetch profile: ${error.message}`);
  }

  return data;
};





export const isProfileExistFromDB = async (
  userId: string
): Promise<{
  id: string;
} | null> => {

  const { data, error } = await supabaseAdmin
    .from(tab)
    .select('id')
    .eq('id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw new AppError(500, `Failed to fetch profile: ${error.message}`);
  }

  return data;
};


export const createProfileToDB = async (
  dto: CreateInitialProfileDTO
): Promise<Profile> => {

  const db = createSupabaseClient();

  const {data,error}=await db
    .from(tab)
    .insert({
      id:dto.id,
      email:dto.email,
      status:"pending",
      onboarding_completed:false,
      onboarding_step:0
    })
    .select()
    .single();


  if(error){
    throw new AppError(
      500,
      error.message
    );
  }

  return data;
};

export const updateProfileSetupToDB = async (
  userId: string,
  dto: CompleteProfileDTO,
  accessToken: string
): Promise<Profile> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .update({
      first_name: dto.first_name,
      last_name: dto.last_name,
      avatar_url: dto.avatar_url ?? null,
      job_title: dto.job_title,
      onboarding_step: 1,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to complete profile setup: ${error.message}`
    );
  }

  return data;
};

export const updateOnboardingStepToDB = async (
  userId: string,
  step: OnboardingStep,
  accessToken: string
): Promise<Profile> => {
  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .update({
      onboarding_step: step,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to update onboarding step: ${error.message}`
    );
  }

  return data;
};

export const completeOnboardingInDB = async (
  userId: string,
  accessToken: string
): Promise<Profile> => {
  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .update({
      onboarding_completed: true,
      status: 'active'
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to update onboarding step: ${error.message}`
    );
  }
  return data;
}


export const getProfileByIdForAuthFromDB = async (
  userId: string,
): Promise<Profile> => {

  const { data, error } = await supabaseAdmin
    .from(tab)
    .select('*')
    .eq('id', userId)
    .eq('status', 'active')
    .is('deleted_at', null)
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to fetch profile: ${error.message}`
    );
  }

  return data;
};

export const updateProfileFromDB = async (
  userId: string,
  dto: UpdateProfileDTO,
  accessToken: string
): Promise<Profile> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .update({
      ...dto
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to update profile: ${error.message}`
    );
  }

  return data;
};



export const updateProfileAvatarFromDB = async (
  userId: string,
  avatar_url: string,
  accessToken: string
): Promise<string> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .update({
      avatar_url
    })
    .eq("id", userId)
    .select("avatar_url")
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to update profile avatar: ${error.message}`
    );
  }
  return data.avatar_url;
};

export const updateProfileStatusFromDB = async (
  userId: string,
  status: ProfileStatus,
  accessToken: string
): Promise<string> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .update({
      status
    })
    .eq("id", userId)
    .select("status")
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to update profile status: ${error.message}`
    );
  }
  return data.status;
};

export const updateLastLoginToDB = async (
  profileId: string,
  accessToken: string
): Promise<void> => {

  const db =
    createSupabaseUserClient(accessToken);

  const { error } = await db
    .from(tab)
    .update({
      last_login: new Date().toISOString(),
    })
    .eq("id", profileId);

  if (error) {
    throw new AppError(
      500,
      `Failed to update last login: ${error.message}`
    );
  }

};

export const deleteProfileFromDB = async (
  id: string,
  accessToken: string
): Promise<string> => {

  const db = createSupabaseUserClient(accessToken);

  const { error } = await db
    .from(tab)
    .update({
      deleted_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    throw new AppError(
      500,
      `Failed to delete profile: ${error.message}`
    );
  }

  return id;
};

profile controller:
import { Request, Response, NextFunction } from "express";

import {
  updateProfileSetupToDB,
  updateProfileFromDB,
  updateProfileStatusFromDB,
  updateProfileAvatarFromDB,
} from "../services/profiles.service";

import { AppError } from "../middleware/error.middleware";


export const completeProfileSetup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const userId = req.user?.sub;
    const accessToken = req.cookies.accessToken;

    if (!userId || !accessToken) {
      throw new AppError(
        401,
        "Unauthorized"
      );
    }


    const profile =
      await updateProfileSetupToDB(
        userId,
        req.body,
        accessToken
      );


    res.status(200).json({
      success:true,
      message:"Profile setup completed",
      data:profile
    });


  } catch(err){
    next(err);
  }
};





export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const userId = req.user?.sub;
    const accessToken = req.cookies.accessToken;


    if(!userId || !accessToken){
      throw new AppError(
        401,
        "Unauthorized"
      );
    }


    const profile =
      await updateProfileFromDB(
        userId,
        req.body,
        accessToken
      );


    res.status(200).json({
      success:true,
      message:"Profile updated successfully",
      data:profile
    });


  } catch(err){
    next(err);
  }
};





export const updateProfileAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.sub;
    const accessToken = req.cookies.accessToken;

    if(!userId || !accessToken){
      throw new AppError(
        401,
        "Unauthorized"
      );
    }

    const avatar =
      await updateProfileAvatarFromDB(
        userId,
        req.body,
        accessToken
      );


    res.status(200).json({
      success:true,
      message:"Profile avatar updated successfully",
      data:{
        avatar_url:avatar
      }
    });


  } catch(err){
    next(err);
  }
};


export const updateProfileStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.sub;
    const accessToken = req.cookies.accessToken;

    if(!userId || !accessToken){
      throw new AppError(
        401,
        "Unauthorized"
      );
    }

    const status =
      await updateProfileStatusFromDB(
        userId,
        req.body,
        accessToken
      );

    res.status(200).json({
      success:true,
      message:"Profile status updated successfully",
      data:{
        status
      }
    });


  } catch(err){
    next(err);
  }
};

import {
  getProfileByIdFromDB,
} from "../services/profiles.service";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const userId =
      req.user?.sub;

    const accessToken =
      req.cookies.accessToken;

    if (
      !userId ||
      !accessToken
    ) {
      throw new AppError(
        401,
        "Unauthorized"
      );
    }

    const profile =
      await getProfileByIdFromDB(
        userId,
        accessToken
      );

    res.status(200).json({
      success: true,
      data: profile,
    });

  } catch (err) {
    next(err);
  }

};

profile routes:
import { Router } from "express";

import { verifyToken } from "../middleware/auth.middleware";

import {
  completeProfileSetup,
  getProfile,
  updateProfile,
  updateProfileAvatar,
  updateProfileStatus,
} from "../controllers/profile.controller";

import { validateBody } from "../middleware/validate";

import {
  completeProfileSchema,
  updateProfileSchema,
  updateProfileAvatarSchema,
  updateProfileStatusSchema,
} from "../schema/profile.schema";


const router = Router();


router.use(verifyToken);

router.patch(
  "/me",
  getProfile
);


router.patch(
  "/setup",
  validateBody(completeProfileSchema),
  completeProfileSetup
);

router.patch(
  "/me/update",
  validateBody(updateProfileSchema),
  updateProfile
);


router.patch(
  "/me/avatar",
  validateBody(updateProfileAvatarSchema),
  updateProfileAvatar
);


router.patch(
  "/me/status",
  validateBody(updateProfileStatusSchema),
  updateProfileStatus
);


export default router;

frontend profile service:
import { apiClient } from "./apiClient";

import type {
  Profile,
  DisplayProfile,
  CompleteProfileDTO,
  UpdateProfileDTO,
  ProfileStatus,
} from "../types/profile";


export const fetchProfileAPI = async (): Promise<DisplayProfile> => {

  const result = await apiClient(
    "/api/profile/me",
    {
      method: "GET",
    }
  );

  return result.data as DisplayProfile;

};


export const completeProfileSetupAPI = async (
  profile: CompleteProfileDTO
): Promise<Profile> => {

  const result = await apiClient(
    "/api/profile/setup",
    {
      method: "PATCH",
      body: JSON.stringify(profile),
    }
  );

  return result.data as Profile;

};


export const updateProfileAPI = async (
  profile: UpdateProfileDTO
): Promise<Profile> => {

  const result = await apiClient(
    "/api/profile/me",
    {
      method: "PATCH",
      body: JSON.stringify(profile),
    }
  );

  return result.data as Profile;

};


export const updateProfileAvatarAPI = async (
  avatar_url: string | null
): Promise<{
  avatar_url: string | null;
}> => {

  const result = await apiClient(
    "/api/profile/me/avatar",
    {
      method: "PATCH",
      body: JSON.stringify({
        avatar_url,
      }),
    }
  );

  return result.data as {
    avatar_url: string | null;
  };

};


export const updateProfileStatusAPI = async (
  status: ProfileStatus
): Promise<{
  status: ProfileStatus;
}> => {

  const result = await apiClient(
    "/api/profile/me/status",
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    }
  );

  return result.data as {
    status: ProfileStatus;
  };

};

frontend profile slice:
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  CompleteProfileDTO,
  UpdateProfileDTO,
  ProfileStatus,
  ProfileState,
} from "../types/profile";

import {
  fetchProfileAPI,
  completeProfileSetupAPI,
  updateProfileAPI,
  updateProfileAvatarAPI,
  updateProfileStatusAPI,
} from "../services/profileService";

const initialState: ProfileState = {
  profile: null,
  loading: false,
  loaded: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetch-profile",
  async (_, thunkAPI) => {
    try {
      return await fetchProfileAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch profile"
      );
    }
  }
);

export const completeProfileSetup = createAsyncThunk(
  "profile/complete-setup",
  async (
    profile: CompleteProfileDTO,
    thunkAPI
  ) => {
    try {
      return await completeProfileSetupAPI(profile);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to complete profile setup"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update-profile",
  async (
    profile: UpdateProfileDTO,
    thunkAPI
  ) => {
    try {
      return await updateProfileAPI(profile);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to update profile"
      );
    }
  }
);

export const updateProfileAvatar = createAsyncThunk(
  "profile/update-avatar",
  async (
    avatar_url: string | null,
    thunkAPI
  ) => {
    try {
      return await updateProfileAvatarAPI(
        avatar_url
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to update avatar"
      );
    }
  }
);

export const updateProfileStatus = createAsyncThunk(
  "profile/update-status",
  async (
    status: ProfileStatus,
    thunkAPI
  ) => {
    try {
      return await updateProfileStatusAPI(
        status
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to update status"
      );
    }
  }
);

const profileSlice = createSlice({

  name: "profile",

  initialState,

  reducers: {

    clearError(state) {
      state.error = null;
    },

    clearProfile(state) {
      state.profile = null;
      state.loaded = false;
    },

  },

  extraReducers: (builder) => {

    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.profile = action.payload;
    });

    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });



    builder.addCase(completeProfileSetup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(completeProfileSetup.fulfilled, (state, action) => {
      state.loading = false;

      if (!state.profile) return;

      state.profile.first_name = action.payload.first_name;
      state.profile.last_name = action.payload.last_name;
      state.profile.avatar_url = action.payload.avatar_url;
      state.profile.job_title = action.payload.job_title;
      state.profile.status = action.payload.status;
    });

    builder.addCase(completeProfileSetup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });



    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;

      if (!state.profile) return;

      state.profile.first_name = action.payload.first_name;
      state.profile.last_name = action.payload.last_name;
      state.profile.display_name = action.payload.display_name;
      state.profile.job_title = action.payload.job_title;
    });

    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });



    builder.addCase(updateProfileAvatar.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateProfileAvatar.fulfilled, (state, action) => {
      state.loading = false;

      if (!state.profile) return;

      state.profile.avatar_url =
        action.payload.avatar_url ?? undefined;
    });

    builder.addCase(updateProfileAvatar.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });



    builder.addCase(updateProfileStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateProfileStatus.fulfilled, (state, action) => {
      state.loading = false;

      if (!state.profile) return;

      state.profile.status = action.payload.status;
    });

    builder.addCase(updateProfileStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

  },

});

export const {
  clearError,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;

organization backend routes:
import { Router } from "express";

import {
  createWorkspaceController,
  renameWorkspaceController,
} from "../controllers/organizations.controller";

import {
  verifyToken,
  authenticateUser,
} from "../middleware/auth.middleware";

import { validateBody } from "../middleware/validate";

import {
  createWorkspaceSchema,
  renameWorkspaceSchema,
} from "../schema/organization.schema";

const router = Router();

router.use(verifyToken);
router.use(authenticateUser);

router.post(
  "/",
  validateBody(createWorkspaceSchema),
  createWorkspaceController
);

router.patch(
  "/name",
  validateBody(renameWorkspaceSchema),
  renameWorkspaceController
);

export default router;

organization backend service:
import { createSupabaseUserClient, supabaseAdmin } from "../config/supabase";
import {
  Organization,
  CreateWorkspaceDTO
} from "../types/organization";
import { AppError } from "../middleware/error.middleware";
import { table } from "../config/tables";
import { generateSlug } from "../utils/slug";

const tab = table.org;

export const createWorkspaceInDB = async (
  dto: CreateWorkspaceDTO,
  accessToken: string
): Promise<Organization> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .insert({
      name: dto.name,
      slug: generateSlug(dto.name),
      type: dto.type,
      industry: dto.industry ?? null,
      business_type: dto.business_type ?? null,
      company_size: dto.company_size ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to create workspace: ${error.message}`
    );
  }
  return data;
};

export const renameWorkspaceInDB = async (
  orgId: string,
  name: string,
  accessToken: string
): Promise<Organization> => {
  const db = createSupabaseUserClient(accessToken);
    const { data, error } = await db
      .from(tab)
      .update({
        name,
        slug: generateSlug(name),
      })
      .eq("id",orgId)
      .select()
      .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to rename workspace: ${error.message}`
    );
  }
  return data;
};

organization backend controller:
  import { Request, Response, NextFunction } from "express";

  import {
    createWorkspaceInDB,
    renameWorkspaceInDB,
  } from "../services/organization.service";
  import { AppError } from "../middleware/error.middleware";
import { updateOnboardingStepToDB } from "../services/profiles.service";
import { createOwnerMemberToDB } from "../services/organization.members.service";

  export const createWorkspaceController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      const userId = req.user?.sub;
      const accessToken = req.cookies.accessToken;

      if (!userId || !accessToken) {
        throw new AppError(
          401,
          "Unauthorized"
        );
      }

      const dto = req.body;

      const workspace = await createWorkspaceInDB(
        dto,
        accessToken
      );

      await createOwnerMemberToDB(
        workspace.id,
        userId,
        accessToken
      )

      await updateOnboardingStepToDB(
        userId,
        2,
        accessToken
      );

      

      res.status(201).json({
        success: true,
        message: "Workspace created successfully",
        data: workspace,
      });

    } catch(err) {
      next(err);
    }
  };

  export const renameWorkspaceController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orgId = req.user?.org_id;
      const role = req.user?.user_metadata.role;
      const { name } = req.body;
      const accessToken = req.cookies.accessToken;

      if (!orgId) {
        throw new AppError(
          400,
          "Organization ID is required"
        );
      }

      if (role !== 'owner') {
        throw new AppError(
          400,
          "Only the workspace owner can rename the workspace."
        );
      }

      if (!accessToken) {
        throw new AppError(
          401,
          "Access token missing"
        );
      }

      if (!name) {
        throw new AppError(
          400,
          "Workspace name is required"
        );
      }

      const workspace =await renameWorkspaceInDB(orgId, name, accessToken);

      res.status(200).json({
        success: true,
        message: "Workspace renamed successfully",
        data: workspace,
      });

    } catch(err) {
      next(err);
    }
  };

  organization frontend service:
  import type {
  Organization,
  CreateWorkspaceDTO,
} from "../types/organization";

import { apiClient } from "./apiClient";

export const createWorkspaceAPI = async (
  workspace: CreateWorkspaceDTO
): Promise<Organization> => {

  const result = await apiClient(
    "/api/organizations/",
    {
      method: "POST",
      body: JSON.stringify(workspace),
    }
  );

  return result.data as Organization;

};

export const renameWorkspaceAPI = async (
  name: Pick<Organization, "name">
): Promise<Organization> => {

  const result = await apiClient(
    "/api/organizations/name",
    {
      method: "PATCH",
      body: JSON.stringify(name),
    }
  );

  return result.data as Organization;

};

organization frontend slice:
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  Organization,
  CreateWorkspaceDTO,
  OrganizationState,
} from "../types/organization";

import {
  createWorkspaceAPI,
  renameWorkspaceAPI,
} from "../services/organizationService";



const initialState: OrganizationState = {
  item: null,
  loading: false,
  loaded: false,
  error: null,
};


export const createWorkspace = createAsyncThunk(
  "organization/create-workspace",
  async (
    workspace: CreateWorkspaceDTO,
    thunkAPI
  ) => {

    try {

      return await createWorkspaceAPI(
        workspace
      );

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(
          err.message
        );
      }

      return thunkAPI.rejectWithValue(
        "Failed to create workspace"
      );

    }

  }
);


export const renameWorkspace = createAsyncThunk(
  "organization/rename-workspace",
  async (
    name: Pick<Organization, "name">,
    thunkAPI
  ) => {

    try {

      return await renameWorkspaceAPI(
        name
      );

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(
          err.message
        );
      }

      return thunkAPI.rejectWithValue(
        "Failed to rename workspace"
      );

    }

  }
);


const organizationSlice = createSlice({

  name: "organization",

  initialState,

  reducers: {

    clearError(state) {
      state.error = null;
    },

    clearOrganization(state) {
      state.item = null;
      state.loaded = false;
    },

  },

  extraReducers: (builder) => {

    builder.addCase(
      createWorkspace.pending,
      (state) => {

        state.loading = true;
        state.error = null;

      }
    );

    builder.addCase(
      createWorkspace.fulfilled,
      (state, action) => {

        state.loading = false;
        state.loaded = true;
        state.item = action.payload;

      }
    );

    builder.addCase(
      createWorkspace.rejected,
      (state, action) => {

        state.loading = false;
        state.error = action.payload as string;

      }
    );

    builder.addCase(
      renameWorkspace.pending,
      (state) => {

        state.loading = true;
        state.error = null;

      }
    );

    builder.addCase(
      renameWorkspace.fulfilled,
      (state, action) => {

        state.loading = false;
        state.item = action.payload;

      }
    );

    builder.addCase(
      renameWorkspace.rejected,
      (state, action) => {

        state.loading = false;
        state.error = action.payload as string;

      }
    );

  },

});


export const {
  clearError,
  clearOrganization,
} = organizationSlice.actions;

export default organizationSlice.reducer;

profile types:
import type { Roles } from "./global";
import type { OrganizationType } from "./organization";

export interface ProfileState {
  profile: DisplayProfile | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const PROFILE_STATUSES = [
  "pending",
  "inactive",
  "active",
  "banned",
  "deleted",
] as const;

export type ProfileStatus = (typeof PROFILE_STATUSES)[number];

export interface Profile {
  id: string;
  display_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  onboarding_completed: boolean;
  job_title?: string; 
  status: ProfileStatus;
  avatar_url?: string;  
  created_at?: string;
  deleted_at?: string;
  last_login?: string;
}

export interface DisplayProfile {
    id: string;
    avatar_url?: string;
    first_name: string;
    last_name: string;
    display_name?: string;
    email: string;
    display_id?: string;
    job_title?: string;
    status: ProfileStatus;
    created_at: string;
    last_login?: string;
    org: {
        display_id: string;
        name: string;
        type: OrganizationType;
    };
    membership: {
    display_id: string;
    role: Roles;
    status: string;
    created_at: string;
  };
}

export interface ProfileIDName {
  id: string;
  display_name: string;
}

export interface AddProfileDTO {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  phone?: string;
  job_title?: string;
}

export type CreateInitialProfileDTO = {
  id: string;
  email: string;
};

export interface CompleteProfileDTO {
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  job_title: string;
}

export interface UpdateProfileDTO {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  phone?: string;
  job_title?: string;
}

export interface ProfileFormValues {
    first_name: string;
    last_name: string;
    display_name: string;
    job_title: string;
}
export interface PasswordChangeValues {
    currentPassword: string;
    newPassword: string;
}


organization types:
import { type SubscriptionPlan} from "./subscription";

export interface OrganizationState {
  item: Organization | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const ORGANIZATION_TYPES = [
  "personal",
  "business",
] as const;

export type OrganizationType =
  typeof ORGANIZATION_TYPES[number];

export interface Organization {
  id: string;
  display_id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  industry: string | null;
  business_type: string | null;
  company_size: string | null;
  subscription_plan: SubscriptionPlan;
  created_at?: string
  updated_at?: string;
}


export interface CreateWorkspaceDTO {
  name: string;
  type: OrganizationType;
  industry?: string;
  business_type?: string;
  company_size?: string;
}

register  page tsx:
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, TextField, Typography,
  Paper, CircularProgress, Divider, Dialog,
  DialogActions, DialogTitle, DialogContent
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import {  useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ErrorAlert from '../../../components/Error';
import { useAuth } from '../../../hooks/useAuth';
import { signUp } from '../../../store/userSlice';


export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useAuth();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const [showPassword, setShowPassword] = useState(false);
  const [openRedirect, setOpenRedirect] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleCloseRedirect = () => {
    setOpenRedirect(false);
  }

  const handleRedirect = () => {
    navigate('/login')
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (loading) return;

    try {
      await  dispatch(signUp(form)).unwrap();

      setOpenRedirect(true);
    } catch  {
      //Error in State
    };
  }

  const BACKGROUNDCOLOR = themeMode === 'light' ? 'rgba(255, 255, 255, 0.73)' : 'rgba(34, 34, 34, 0.4)';

  return (
    <Box
      sx={{
        mx: '5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: ' rgba(39, 39, 39, 0)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 480,
          border: 1,
          color: 'white',
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: `${BACKGROUNDCOLOR}`,
        }}
      >

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700} color="text.secondary">
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create your account to get started.
            After verifying your email, you'll finish setting up your profile and workspace.
          </Typography>
        </Box>
        <Box sx={{my: 2}}>
          {error && (
            <ErrorAlert
              message={error}
            />
          )}
        </Box>
        

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              helperText="Password must be at least 12 characters that include uppercase letter, number, and symbol"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !form.email  || !form.password}
            >
              {loading
                ? <CircularProgress size={22} color="inherit" />
                : 'Create account'
              }
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            p: 1.5,
            bgcolor: 'action.hover',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Paper>
      <Dialog open={openRedirect} onClose={handleCloseRedirect}>
        <DialogTitle sx={{fontWeight: 700}}>
          Verify your email
        </DialogTitle>
        <DialogContent
          >
            We've sent a verification email to your inbox.

            Please verify your email before signing in.

            Once verified, you'll complete your profile and workspace setup.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRedirect}>
              Later
            </Button>
            <Button 
              variant="contained"
              color="primary"
              onClick={() => {
                handleRedirect();
              }}
            >
              Go to Login
            </Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
}

login page tsx:
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, TextField, Typography,
  Paper, CircularProgress, Divider,
} from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useSelector } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import type { RootState } from '../../../store/store';
import ErrorAlert from '../../../components/Error';


export default function Login() {
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const {
    isAuthenticated,
    loading,
    error,
    login,
    currentUser,
  } = useAuth();

  useEffect(() => {

    if (!loading && isAuthenticated) {
      navigate("/app/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(form).unwrap();
      await currentUser().unwrap();

      if (result.needsOnboarding) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/app/dashboard", { replace: true });
      }
    } catch {
      // Error is already stored in auth.error
    }
  };

  const BACKGROUNDCOLOR = themeMode === 'light' ? 'rgba(255, 255, 255, 0.73)' : 'rgba(34, 34, 34, 0.65)';

  return (
    <Box
      sx={{
        my: 5,
        mx: '5%',
        height: '70vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: '430px',
          height: '60vh',
          width: '75vw',
          maxHeight: '550px',
          minHeight: '450px',
          border: 1,
          justifySelf: 'center',
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: `${BACKGROUNDCOLOR}`,
        }}
      >

        <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
          Sign in to uniThread
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Enter your credentials to continue
        </Typography>

        {error && (
          <Box sx={{ mb: 2 }}>
            <ErrorAlert
              message={error}
            />
          </Box>
        )}

        <Box component="form" onSubmit={handleLogin}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email address"
              type="email"
              size="small"
              placeholder="loremipsum@gmail.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
              fullWidth
              autoFocus
              autoComplete="email"
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              size="small"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
              fullWidth
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="medium"
              disabled={loading || !form.email || !form.password}
            >
              {loading
                ? <CircularProgress size={22} color="inherit" />
                : 'Sign in'
              }
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" >
            <Link to="/register" style={{
              color: 'inherit', fontWeight: 500, display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}>
              Create account
            </Link>

          </Typography>
          <Link
            to="/forgot-password"
            style={{ fontSize: 14, color: 'inherit' }}
          >
            Forgot password?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}

Subscription backend service:
import { createSupabaseUserClient } from "../config/supabase";
import { AppError } from "../middleware/error.middleware";
import type {
  CreateSubscriptionDTO,
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from "../types/subscription";
import { table } from "../config/tables";

const tab = table.subscriptions;

export const createSubscriptionToDB = async (
  orgId: string,
  dto: CreateSubscriptionDTO,
  accessToken: string
): Promise<Subscription> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .insert({
      org_id: orgId,
      plan: dto.plan,
      billing_cycle: dto.billing_cycle,
      payment_provider: dto.payment_provider,
      provider_reference: dto.provider_reference ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to create subscription: ${error.message}`
    );
  }

  return data;
};

export const getSubscriptionByOrgIdFromDB = async (
  organizationId: string,
  accessToken: string
): Promise<Subscription> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .select("*")
    .eq("org_id", organizationId)
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to fetch subscription: ${error.message}`
    );
  }

  return data;
};

export const updateSubscriptionPlanToDB = async (
  organizationId: string,
  plan: SubscriptionPlan,
  accessToken: string
): Promise<Subscription> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .update({
      plan,
    })
    .eq("org_id", organizationId)
    .select()
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to update subscription plan: ${error.message}`
    );
  }

  return data;
};



export const updateSubscriptionStatusToDB = async (
  organizationId: string,
  status: SubscriptionStatus,
  accessToken: string
): Promise<Subscription> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(tab)
    .update({
      status,
    })
    .eq("org_id", organizationId)
    .select()
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to update subscription status: ${error.message}`
    );
  }

  return data;
};


subcription backend controller:
import { Request, Response, NextFunction } from "express";

import {
  createSubscriptionToDB,
  getSubscriptionByOrgIdFromDB,
  updateSubscriptionPlanToDB,
  updateSubscriptionStatusToDB,
} from "../services/subscriptions.service";

import {
  updateOnboardingStepToDB,
  completeOnboardingInDB,
} from "../services/profiles.service";

import { AppError } from "../middleware/error.middleware";



export const createFreeSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const subs = req.body;
    const userId = req.user?.sub;
    const orgId = req.user?.org_id;
    const accessToken = req.cookies.accessToken;

    if (!userId || !orgId || !accessToken) {
      throw new AppError(
        401,
        "Unauthorized"
      );
    }

    const subscription =
      await createSubscriptionToDB(
        orgId,
        {
          plan: subs.plan ?? "Free",
          billing_cycle: subs.billing_cycle ?? "none",
          payment_provider: subs.payment_provider ?? "none",
          provider_reference: subs.provider_reference ?? null,
        },
        accessToken
      );

    await updateOnboardingStepToDB(
      userId,
      3,
      accessToken
    );

    await completeOnboardingInDB(
      userId,
      accessToken
    );

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });

  } catch (err) {
    next(err);
  }
};



export const getSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const orgId = req.user?.org_id;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(
        401,
        "Unauthorized"
      );
    }

    const subscription =
      await getSubscriptionByOrgIdFromDB(
        orgId,
        accessToken
      );

    res.status(200).json({
      success: true,
      data: subscription,
    });

  } catch (err) {
    next(err);
  }
};



export const updateSubscriptionPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const orgId = req.user?.org_id;
    const role = req.user?.user_metadata?.role;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(
        401,
        "Unauthorized"
      );
    }

    if (role !== "owner") {
      throw new AppError(
        403,
        "Only workspace owners can change subscription plans."
      );
    }

    const { plan } = req.body;

    const subscription =
      await updateSubscriptionPlanToDB(
        orgId,
        plan,
        accessToken
      );

    res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully",
      data: subscription,
    });

  } catch (err) {
    next(err);
  }
};



export const updateSubscriptionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const orgId = req.user?.org_id;
    const role = req.user?.user_metadata?.role;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(
        401,
        "Unauthorized"
      );
    }

    if (role !== "owner") {
      throw new AppError(
        403,
        "Only workspace owners can change subscription status."
      );
    }

    const { status } = req.body;

    const subscription =
      await updateSubscriptionStatusToDB(
        orgId,
        status,
        accessToken
      );

    res.status(200).json({
      success: true,
      message: "Subscription status updated successfully",
      data: subscription,
    });

  } catch (err) {
    next(err);
  }
};

subscription types:
export const SUBSCRIPTION_PLANS = [
  "Free",
  "Starter",
  "Team",
  "Business",
  "Enterprise",
] as const;

export type SubscriptionPlan =
  typeof SUBSCRIPTION_PLANS[number];

export const BILLING_CYCLES = [
  "none",
  "monthly",
  "yearly",
] as const;

export type BillingCycle =
  typeof BILLING_CYCLES[number];

export const PAYMENT_PROVIDERS = [
  "stripe",
  "paypal",
  "gcash",
  "maya",
  "none",
] as const;

export type PaymentProvider =
  typeof PAYMENT_PROVIDERS[number];

export const LIMIT_TYPES = [
  "active_limit",
  "store_limit",
] as const;

export type LimitType =
  typeof LIMIT_TYPES[number];

export const SUBSCRIPTION_STATUSES = [
  "active",
  "cancelled",
  "expired",
  "past_due",
] as const;

export type SubscriptionStatus =
  typeof SUBSCRIPTION_STATUSES[number];


export const LIMITABLE_RESOURCES = [
  "members",
  "leads",
  "contacts",
  "deals",
  "customers",
  "tasks",
  "notes",
  "emails",
  "sms",
  "calls",
] as const;

export type LimitableResource =
  typeof LIMITABLE_RESOURCES[number];


export type CreateSubscriptionDTO = {
  plan: SubscriptionPlan;
  billing_cycle: BillingCycle;
  payment_provider: PaymentProvider;
  provider_reference?: string | null;
};


export const PLAN_LIMITS = {
  Free: {
    members: { active_limit: 3, store_limit: 5 },

    leads: { active_limit: 100, store_limit: 200 },
    contacts: { active_limit: 100, store_limit: 200 },
    deals: { active_limit: 50, store_limit: 100 },
    customers: { active_limit: 100, store_limit: 200 },

    notes: { active_limit: 500, store_limit: 1000 },
    tasks: { active_limit: 500, store_limit: 1000 },

    emails: { active_limit: 1000, store_limit: 2000 },
    sms: { active_limit: 500, store_limit: 1000 },
    calls: { active_limit: 500, store_limit: 1000 },
  },

  Starter: {
    members: { active_limit: 10, store_limit: 20 },

    leads: { active_limit: 1000, store_limit: 2000 },
    contacts: { active_limit: 1000, store_limit: 2000 },
    deals: { active_limit: 500, store_limit: 1000 },
    customers: { active_limit: 1000, store_limit: 2000 },

    notes: { active_limit: 3000, store_limit: 6000 },
    tasks: { active_limit: 3000, store_limit: 6000 },
    activities: { active_limit: 10000, store_limit: 20000 },

    messages: { active_limit: 25000, store_limit: 50000 },
    emails: { active_limit: 5000, store_limit: 10000 },
    sms: { active_limit: 2500, store_limit: 5000 },
    calls: { active_limit: 2500, store_limit: 5000 },
  },

  Team: {
    members: { active_limit: 50, store_limit: 100 },

    leads: { active_limit: 5000, store_limit: 10000 },
    contacts: { active_limit: 5000, store_limit: 10000 },
    deals: { active_limit: 2000, store_limit: 5000 },
    customers: { active_limit: 5000, store_limit: 10000 },

    notes: { active_limit: 10000, store_limit: 20000 },
    tasks: { active_limit: 10000, store_limit: 20000 },
    activities: { active_limit: 50000, store_limit: 100000 },

    messages: { active_limit: 100000, store_limit: 200000 },
    emails: { active_limit: 20000, store_limit: 50000 },
    sms: { active_limit: 10000, store_limit: 20000 },
    calls: { active_limit: 10000, store_limit: 20000 },
  },

  Business: {
    members: { active_limit: 200, store_limit: 400 },

    leads: { active_limit: 20000, store_limit: 40000 },
    contacts: { active_limit: 20000, store_limit: 40000 },
    deals: { active_limit: 10000, store_limit: 20000 },
    customers: { active_limit: 20000, store_limit: 40000 },

    notes: { active_limit: 50000, store_limit: 100000 },
    tasks: { active_limit: 50000, store_limit: 100000 },
    activities: { active_limit: 250000, store_limit: 500000 },

    messages: { active_limit: 500000, store_limit: 1000000 },
    emails: { active_limit: 50000, store_limit: 100000 },
    sms: { active_limit: 25000, store_limit: 50000 },
    calls: { active_limit: 25000, store_limit: 50000 },
  },

  Enterprise: {
    members: { active_limit: 500, store_limit: 1000 },

    leads: { active_limit: 100000, store_limit: 200000 },
    contacts: { active_limit: 100000, store_limit: 200000 },
    deals: { active_limit: 50000, store_limit: 100000 },
    customers: { active_limit: 100000, store_limit: 200000 },

    notes: { active_limit: 200000, store_limit: 400000 },
    tasks: { active_limit: 200000, store_limit: 400000 },
    activities: { active_limit: 1000000, store_limit: 2000000 },

    messages: { active_limit: 2000000, store_limit: 4000000 },
    emails: { active_limit: 200000, store_limit: 400000 },
    sms: { active_limit: 100000, store_limit: 200000 },
    calls: { active_limit: 100000, store_limit: 200000 },
  },
} as const;


export interface Subscription {
  id: string;
  org_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end: boolean;
  created_at?: string;
  updated_at?: string;
}



