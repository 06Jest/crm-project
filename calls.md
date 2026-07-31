export interface CallsState {
  items: CallListItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const CALL_STATUSES = [
  "scheduled",
  "active",
  "completed",
  "cancelled",
] as const;

export type CallStatus = typeof CALL_STATUSES[number];

export const CALL_TYPES = [
  "sales",
  "follow_up",
  "support",
  "demo",
  "onboarding",
  "renewal",
  "other",
] as const;

export type CallType = typeof CALL_TYPES[number];

export const CALL_OUTCOMES = [
  "interested",
  "not_interested",
  "callback_requested",
  "resolved",
  "other",
] as const;

export type CallOutcome = typeof CALL_OUTCOMES[number];

export const CALL_PRIORITIES = [
  "low",
  "medium",
  "high",
] as const;

export type CallPriority = typeof CALL_PRIORITIES[number];

export interface Call {
  id: string;
  org_id: string;
  lead_id: string | null;
  contact_id: string | null;
  created_by: string;
  assigned_to: string;
  subject: string;
  notes: string | null;
  type: CallType;
  status: CallStatus;
  outcome: CallOutcome | null;
  priority: CallPriority;
  scheduled_for: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateCall {
  lead_id?: string;
  contact_id?: string;
  assigned_to?: string;
  subject: string;
  notes?: string;
  type: CallType;
  priority?: CallPriority;
  scheduled_for?: string;
}

export interface UpdateCall {
  subject?: string;
  notes?: string;
  type?: CallType;
  priority?: CallPriority;
  scheduled_for?: string;
}

export interface EndCall {
  notes?: string;
  outcome: CallOutcome;
}

export interface CallListItem extends Call {
  assigned_user: {
    id: string;
    first_name: string;
    last_name: string;
  };

  creator: {
    id: string;
    first_name: string;
    last_name: string;
  };

  lead?: {
    id: string;
    first_name: string;
    last_name: string;
  };

  contact?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface CallFilters {
  status?: CallStatus;
  type?: CallType;
  priority?: CallPriority;
  assigned_to?: string;
  search?: string;
}

import { supabaseAdmin } from "../config/supabase";
import { table } from "../config/tables";

import { AppError } from "../middleware/error.middleware";

import type {
  CallListItem,
  CreateCall,
  UpdateCall,
  EndCall,
} from "../types//calls";

const tab = table.calls;

const creatorFKey = "fk_call_creator";
const assignedFKey = "fk_call_assigned";

const selectAllWithUsers = `
  *,
  creator:profiles!${creatorFKey}(
    id,
    first_name,
    last_name
  ),
  assigned_user:profiles!${assignedFKey}(
    id,
    first_name,
    last_name
  )
`;

const all = selectAllWithUsers;

export const getCallsFromDB = async (
  orgId: string
): Promise<CallListItem[]> => {

  const { data, error } = await supabaseAdmin
    .from(tab)
    .select(all)
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new AppError(
      500,
      `Failed to fetch Calls: ${error.message}`
    );
  }

  return data ?? [];

};

export const getCallByIDFromDB = async (
  id: string,
  orgId: string
): Promise<CallListItem> => {

  const { data, error } = await supabaseAdmin
    .from(tab)
    .select(all)
    .eq("id", id)
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to fetch Call: ${error.message}`
    );
  }

  return data;

};

export const getLeadCallsFromDB = async (
  orgId: string,
  leadId: string
): Promise<CallListItem[]> => {

  const { data, error } = await supabaseAdmin
    .from(tab)
    .select(all)
    .eq("org_id", orgId)
    .eq("lead_id", leadId)
    .is("deleted_at", null)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new AppError(
      500,
      `Failed to fetch Lead Calls: ${error.message}`
    );
  }

  return data ?? [];

};

export const getContactCallsFromDB = async (
  orgId: string,
  contactId: string
): Promise<CallListItem[]> => {

  const { data, error } = await supabaseAdmin
    .from(tab)
    .select(all)
    .eq("org_id", orgId)
    .eq("contact_id", contactId)
    .is("deleted_at", null)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new AppError(
      500,
      `Failed to fetch Contact Calls: ${error.message}`
    );
  }

  return data ?? [];

};

export const addCallToDB = async (
  orgId: string,
  userId: string,
  call: CreateCall
): Promise<CallListItem> => {

  const isScheduled = !!call.scheduled_for;

  const { data, error } = await supabaseAdmin
    .from(tab)
    .insert([
      {
        ...call,

        org_id: orgId,

        created_by: userId,

        assigned_to:
          call.assigned_to ?? userId,

        status:
          isScheduled
            ? "scheduled"
            : "active",

        started_at:
          isScheduled
            ? null
            : new Date().toISOString(),
      },
    ])
    .select(all)
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to add Call: ${error.message}`
    );
  }

  return data;

};

export const updateCallFromDB = async (
  id: string,
  orgId: string,
  call: UpdateCall
): Promise<CallListItem> => {

  const { data, error } = await supabaseAdmin
    .from(tab)
    .update(call)
    .eq("id", id)
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .select(all)
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to update Call: ${error.message}`
    );
  }

  return data;

};

export const startCallFromDB = async (
  id: string,
  orgId: string
): Promise<CallListItem> => {

  const { data, error } = await supabaseAdmin
    .from(tab)
    .update({
      status: "active",

      started_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .select(all)
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to start Call: ${error.message}`
    );
  }

  return data;

};

export const endCallFromDB = async (
  id: string,
  orgId: string,
  call: EndCall
): Promise<CallListItem> => {

  const existing = await getCallByIDFromDB(
    id,
    orgId
  );

  if (!existing.started_at) {
    throw new AppError(
      400,
      "Call has not been started."
    );
  }

  const endedAt = new Date().toISOString();

  const durationSeconds = Math.floor(
    (
      new Date(endedAt).getTime() -
      new Date(existing.started_at).getTime()
    ) / 1000
  );

  const { data, error } = await supabaseAdmin
    .from(tab)
    .update({
      status: "completed",

      outcome: call.outcome,

      notes: call.notes,

      ended_at: endedAt,

      duration_seconds: durationSeconds,
    })
    .eq("id", id)
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .select(all)
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to end Call: ${error.message}`
    );
  }

  return data;

};

export const cancelCallFromDB = async (
  id: string,
  orgId: string
): Promise<CallListItem> => {

  const { data, error } = await supabaseAdmin
    .from(tab)
    .update({
      status: "cancelled",
    })
    .eq("id", id)
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .select(all)
    .single();

  if (error) {
    throw new AppError(
      500,
      `Failed to cancel Call: ${error.message}`
    );
  }

  return data;

};

export const deleteCallFromDB = async (
  id: string,
  orgId: string
): Promise<string> => {

  const { error } = await supabaseAdmin
    .from(tab)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("org_id", orgId);

  if (error) {
    throw new AppError(
      500,
      `Failed to delete Call: ${error.message}`
    );
  }

  return id;

};


import { Request, Response, NextFunction } from "express";

import { AppError } from "../middleware/error.middleware";

import { uuidSchema } from "../schema/global.schema";

import {
  getCallsFromDB,
  getCallByIDFromDB,
  getLeadCallsFromDB,
  getContactCallsFromDB,
  addCallToDB,
  updateCallFromDB,
  startCallFromDB,
  endCallFromDB,
  cancelCallFromDB,
  deleteCallFromDB,
} from "../services/calls.service";

export const getCalls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const orgId = req.user?.orgId;

    if (!orgId) {
      throw new AppError(401, "Unauthorized user");
    }

    const data = await getCallsFromDB(orgId);

    return res.status(200).json({
      success: true,
      message: "Calls fetch successful",
      data,
    });

  } catch (err) {
    next(err);
  }
};

export const getCallByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const id = uuidSchema.parse(req.params.id);

    const orgId = req.user?.orgId;

    if (!orgId) {
      throw new AppError(401, "Unauthorized user");
    }

    const data = await getCallByIDFromDB(
      id,
      orgId
    );

    return res.status(200).json({
      success: true,
      message: "Call fetch successful",
      data,
    });

  } catch (err) {
    next(err);
  }
};

export const getLeadCalls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const leadId = uuidSchema.parse(req.params.leadId);

    const orgId = req.user?.orgId;

    if (!orgId) {
      throw new AppError(401, "Unauthorized user");
    }

    const data = await getLeadCallsFromDB(
      orgId,
      leadId
    );

    return res.status(200).json({
      success: true,
      message: "Lead Calls fetch successful",
      data,
    });

  } catch (err) {
    next(err);
  }
};

export const getContactCalls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const contactId = uuidSchema.parse(req.params.contactId);

    const orgId = req.user?.orgId;

    if (!orgId) {
      throw new AppError(401, "Unauthorized user");
    }

    const data = await getContactCallsFromDB(
      orgId,
      contactId
    );

    return res.status(200).json({
      success: true,
      message: "Contact Calls fetch successful",
      data,
    });

  } catch (err) {
    next(err);
  }
};

export const addCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const orgId = req.user?.orgId;

    const userId = req.user?.sub;

    const call = req.body;

    if (!orgId || !userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const data = await addCallToDB(
      orgId,
      userId,
      call
    );

    return res.status(201).json({
      success: true,
      message: "Add Call successful",
      data,
    });

  } catch (err) {
    next(err);
  }
};

export const updateCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const id = uuidSchema.parse(req.params.id);

    const orgId = req.user?.orgId;

    const call = req.body;

    if (!orgId) {
      throw new AppError(401, "Unauthorized user");
    }

    const check = await getCallByIDFromDB(
      id,
      orgId
    );

    if (
      check.status === "completed"
    ) {
      throw new AppError(
        400,
        "Completed calls cannot be updated"
      );
    }

    if (
      check.status === "cancelled"
    ) {
      throw new AppError(
        400,
        "Cancelled calls cannot be updated"
      );
    }

    const data = await updateCallFromDB(
      id,
      orgId,
      call
    );

    return res.status(200).json({
      success: true,
      message: "Update Call successful",
      data,
    });

  } catch (err) {
    next(err);
  }
};

export const startCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const id = uuidSchema.parse(req.params.id);

    const orgId = req.user?.orgId;

    if (!orgId) {
      throw new AppError(401, "Unauthorized user");
    }

    const check = await getCallByIDFromDB(
      id,
      orgId
    );

    if (check.status === "active") {
      throw new AppError(
        400,
        "Call is already active"
      );
    }

    if (check.status === "completed") {
      throw new AppError(
        400,
        "Completed calls cannot be started"
      );
    }

    if (check.status === "cancelled") {
      throw new AppError(
        400,
        "Cancelled calls cannot be started"
      );
    }

    const data = await startCallFromDB(
      id,
      orgId
    );

    return res.status(200).json({
      success: true,
      message: "Call started successfully",
      data,
    });

  } catch (err) {
    next(err);
  }
};

export const endCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const id = uuidSchema.parse(req.params.id);

    const orgId = req.user?.orgId;

    const callData = req.body;

    if (!orgId) {
      throw new AppError(401, "Unauthorized user");
    }


    const check = await getCallByIDFromDB(
      id,
      orgId
    );


    if (check.status !== "active") {
      throw new AppError(
        400,
        "Only active calls can be completed"
      );
    }


    const data = await endCallFromDB(
      id,
      orgId,
      callData
    );


    return res.status(200).json({
      success: true,
      message: "Call completed successfully",
      data,
    });


  } catch (err) {
    next(err);
  }
};

export const cancelCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const id = uuidSchema.parse(req.params.id);

    const orgId = req.user?.orgId;


    if (!orgId) {
      throw new AppError(
        401,
        "Unauthorized user"
      );
    }


    const check = await getCallByIDFromDB(
      id,
      orgId
    );


    if (check.status === "completed") {
      throw new AppError(
        400,
        "Completed calls cannot be cancelled"
      );
    }


    if (check.status === "cancelled") {
      throw new AppError(
        400,
        "Call is already cancelled"
      );
    }


    const data = await cancelCallFromDB(
      id,
      orgId
    );


    return res.status(200).json({
      success: true,
      message: "Call cancelled successfully",
      data,
    });


  } catch (err) {
    next(err);
  }
};

export const deleteCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const id = uuidSchema.parse(req.params.id);

    const orgId = req.user?.orgId;


    if (!orgId) {
      throw new AppError(
        401,
        "Unauthorized user"
      );
    }


    const data = await deleteCallFromDB(
      id,
      orgId
    );


    return res.status(200).json({
      success: true,
      message: "Delete Call successful",
      data,
    });


  } catch (err) {
    next(err);
  }
};

import { z } from "zod";
import { GENDERS, PREFERRED_CONTACT_TIMES, PRIORITIES, ROLES, SOURCES, SUFFIXES } from "../types/global";
import { CONTACT_STATUSES } from "../types/contact";
import { LEAD_STATUSES } from "../types/lead";
import { DEAL_STAGES } from "../types/deal";
import { PROFILE_STATUSES } from "../types/profile";
import { CUSTOMER_STATUSES } from "../types/customer";
import { NOTE_TARGET_TYPES, NOTE_VISIBILITIES } from "../types/note";
import { EMAIL_PROVIDERS, EMAIL_STATUSES } from "../types/email";
import { TASK_PRIORITIES, TASK_STATUSES, TASK_TARGET_TYPES, TASK_TYPES, TASK_VISIBILITIES } from "../types/task";
import { CHAT_TARGET_TYPES, CONVERSATION_TYPES } from "../types/chat";
import { CALL_STATUSES, CALL_OUTCOMES } from "../types/calls";

export const sourceSchema = z.enum(SOURCES);

export const contactStatusSchema = z.enum(CONTACT_STATUSES);

export const leadStatusSchema = z.enum(LEAD_STATUSES);

export const CustomerStatusSchema = z.enum(CUSTOMER_STATUSES);

export const dealStageSchema = z.enum(DEAL_STAGES);

export const profileStatusSchema = z.enum(PROFILE_STATUSES);

export const roleSchema = z.enum(ROLES);

export const genderSchema = z.enum(GENDERS);

export const prioritySchema = z.enum(PRIORITIES);

export const suffixSchema = z.enum(SUFFIXES);

export const noteVisibilitySchema = z.enum(NOTE_VISIBILITIES);

export const noteTargetTypeSchema = z.enum(NOTE_TARGET_TYPES);

export const preferedTimeSchema = z.enum(PREFERRED_CONTACT_TIMES);

export const emailStatusSchema = z.enum(EMAIL_STATUSES);

export const taskStatusSchema = z.enum(TASK_STATUSES);

export const taskPrioritySchema = z.enum(TASK_PRIORITIES);

export const taskTargetTypeSchema = z.enum(TASK_TARGET_TYPES);

export const emailProviderSchema = z.enum(EMAIL_PROVIDERS);

export const taskVisibilitySchema = z.enum(TASK_VISIBILITIES);

export const taskTypesSchema = z.enum(TASK_TYPES);

export const conversationTypeSchema = z.enum(CONVERSATION_TYPES);

export const chatTargetTypeSchema = z.enum(CHAT_TARGET_TYPES);

export const callStatusSchema = z.enum(CALL_STATUSES);

export const callOutcomeSchema = z.enum(CALL_OUTCOMES);



export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 12 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const emailSchema = z
  .email("Invalid email address")
  .trim();

export const firstNameSchema = z
  .string()
  .trim()
  .min(2, "Please provide a valid First Name.")
  .max(50)
  .refine(
    (value) => !/(.)\1{3,}/.test(value),
    "A character cannot be repeated 4 or more times consecutively."
  );

export const lastNameSchema = z
  .string()
  .trim()
  .min(2, "Please provide a valid Last Name.")
  .max(50)
  .refine(
    (value) => !/(.)\1{3,}/.test(value),
    "A character cannot be repeated 4 or more times consecutively."
  );

export const orgNameSchema = z
  .string()
  .trim()
  .min(3, "Please provide a valid Organization Name.")
  .max(100)
  

export const uuidSchema = z
  .uuid("Invalid ID");

export const phoneSchema = z
  .string()
  .regex(/^09\d{9}$/, "Invalid Philippine mobile number");

export const avatarSchema = z
  .url("Avatar URL must be a valid URL.");

export const birthdateSchema = z
  .iso
  .date()
  .refine(
    (date) => new Date(date) <= new Date(),
    {
      message: "Birthdate cannot be in the future.",
    }
  ).nullable();

export const companyNameSchema = z
  .string()
  .trim()
  .max(100);

export const industrySchema = z
  .string()
  .trim()
  .max(100);

export const positionSchema = z
  .string()
  .trim()
  .max(50)
  .refine(
    (value) => !/(.)\1{3,}/.test(value),
    "A character cannot be repeated 4 or more times consecutively."
  );

export const departmentSchema = z
  .string()
  .trim()
  .max(50)
  .refine(
    (value) => !/(.)\1{3,}/.test(value),
    "A character cannot be repeated 4 or more times consecutively."
  );

export const websiteSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      /^https?:\/\/.+/i.test(value),
    {
      message: "Website must start with http:// or https://",
    }
  );


export const longTextSchema = z
  .string()
  .trim()
  .min(1, "Text cannot be empty.")
  .max(5000, "Text cannot exceed 5000 characters.");

export const displayNameSchema = z
  .string()
  .trim()
  .max(100);

export const titleSchema = z
  .string()
  .trim()
  .max(150)
  .refine(
    (value) => !/(.)\1{3,}/.test(value),
    "A character cannot be repeated 4 or more times consecutively."
  );

export const valueSchema = z
  .number()
  .nonnegative("Deal value cannot be negative.")
  .max(999_999_999.99, "Value is too large.");

export const socialUsernameSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" || /^[A-Za-z0-9._-]{2,100}$/.test(value),
    {
      message: "Invalid username.",
    }
  ).transform((value) => (value === "" ? null : value));;

 export const messagingNumberSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" || /^\+?[0-9]{7,15}$/.test(value),
    {
      message: "Invalid phone number.",
    }
  ).transform((value) => (value === "" ? null : value));;


  export const emailSubjectSchema = z
  .string()
  .trim()
  .min(1, "Subject is required.")
  .max(200, "Subject is too long.");


export const emailBodySchema = z
  .string()
  .trim()
  .min(1, "Email body cannot be empty.")
  .max(50000, "Email body is too long.");


export const previewTextSchema = z
  .string()
  .trim()
  .max(300);


export const senderNameSchema = z
  .string()
  .trim()
  .max(100);


export const senderEmailSchema = z
  .email("Invalid sender email.")
  .trim(); 

  import { z } from "zod";

import {
  uuidSchema,
  titleSchema,
  longTextSchema,
  callOutcomeSchema,
} from "./global.schema";


export const addCallSchema = z.object({

  lead_id:
    uuidSchema.optional().nullable(),

  contact_id:
    uuidSchema.optional().nullable(),

  customer_id:
    uuidSchema.optional().nullable(),


  assigned_to:
    uuidSchema,


  title:
    titleSchema,


  scheduled_for:
    z.iso.datetime()
      .optional()
      .nullable(),

});


export const updateCallSchema = z.object({

  assigned_to:
    uuidSchema.optional(),

  title:
    titleSchema.optional(),

  scheduled_for:
    z.iso.datetime()
      .optional()
      .nullable(),

});


export const endCallSchema = z.object({

  outcome:
    callOutcomeSchema.optional(),

  notes:
    longTextSchema.optional(),

});

import { Router } from "express";

import {
  authenticateUser,
  verifyToken,
} from "../middleware/auth.middleware";

import { validateBody } from "../middleware/validate";

import {
  getCalls,
  getCallByID,
  getLeadCalls,
  getContactCalls,
  addCall,
  updateCall,
  startCall,
  endCall,
  cancelCall,
  deleteCall,
} from "../controllers/call.controller";

import {
  addCallSchema,
  updateCallSchema,
  endCallSchema,
} from "../schema/calls.schema";


const router = Router();


router.use(verifyToken);
router.use(authenticateUser);



router.get(
  "/show-calls",
  getCalls
);


router.get(
  "/show-call/:id",
  getCallByID
);


router.get(
  "/show-lead-calls/:leadId",
  getLeadCalls
);


router.get(
  "/show-contact-calls/:contactId",
  getContactCalls
);



router.post(
  "/add-call",
  validateBody(addCallSchema),
  addCall
);



router.patch(
  "/update-call/:id",
  validateBody(updateCallSchema),
  updateCall
);



router.patch(
  "/start-call/:id",
  startCall
);



router.patch(
  "/end-call/:id",
  validateBody(endCallSchema),
  endCall
);



router.patch(
  "/cancel-call/:id",
  cancelCall
);



router.delete(
  "/delete-call/:id",
  deleteCall
);


export default router;

import type {
  CallListItem,
  UpdateCall,
  EndCall,
  CreateCall,
} from "../types/call";

import { apiClient } from "./apiClient";


export const fetchCallsAPI = async (): Promise<CallListItem[]> => {

  const result = await apiClient("/api/calls/show-calls", {
    method: "GET",
  });

  return result.data as CallListItem[];

};


export const fetchCallByIDAPI = async (
  id: string
): Promise<CallListItem> => {

  const result = await apiClient(`/api/calls/show-call/${id}`, {
    method: "GET",
  });

  return result.data as CallListItem;

};


export const fetchLeadCallsAPI = async (
  leadId: string
): Promise<CallListItem[]> => {

  const result = await apiClient(
    `/api/calls/show-lead-calls/${leadId}`,
    {
      method: "GET",
    }
  );

  return result.data as CallListItem[];

};


export const fetchContactCallsAPI = async (
  contactId: string
): Promise<CallListItem[]> => {

  const result = await apiClient(
    `/api/calls/show-contact-calls/${contactId}`,
    {
      method: "GET",
    }
  );

  return result.data as CallListItem[];

};



export const addCallAPI = async (
  call: CreateCall
): Promise<CallListItem> => {

  const result = await apiClient("/api/calls/add-call", {
    method: "POST",
    body: JSON.stringify(call),
  });


  return result.data as CallListItem;

};



export const updateCallAPI = async (
  id: string,
  call: UpdateCall
): Promise<CallListItem> => {

  const result = await apiClient(
    `/api/calls/update-call/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(call),
    }
  );


  return result.data as CallListItem;

};



export const startCallAPI = async (
  id: string
): Promise<CallListItem> => {

  const result = await apiClient(
    `/api/calls/start-call/${id}`,
    {
      method: "PATCH",
    }
  );


  return result.data as CallListItem;

};



export const endCallAPI = async (
  id: string,
  call: EndCall
): Promise<CallListItem> => {

  const result = await apiClient(
    `/api/calls/end-call/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(call),
    }
  );


  return result.data as CallListItem;

};



export const cancelCallAPI = async (
  id: string
): Promise<CallListItem> => {

  const result = await apiClient(
    `/api/calls/cancel-call/${id}`,
    {
      method: "PATCH",
    }
  );


  return result.data as CallListItem;

};



export const deleteCallAPI = async (
  id: string
): Promise<string> => {

  const result = await apiClient(
    `/api/calls/delete-call/${id}`,
    {
      method: "DELETE",
    }
  );


  return result.data as string;

};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  CreateCall,
  UpdateCall,
  EndCall,
  CallsState,
} from "../types/call";

import {
  fetchCallsAPI,
  addCallAPI,
  updateCallAPI,
  startCallAPI,
  endCallAPI,
  cancelCallAPI,
  deleteCallAPI,
} from "../services/callsService";


const initialState: CallsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchCalls = createAsyncThunk(
  "calls/show-calls",
  async (_, thunkAPI) => {

    try {

      return await fetchCallsAPI();

    } catch(err) {

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch calls"
      );
    }
  }
);

export const addCall = createAsyncThunk(
  "calls/add-call",
  async (
    call: CreateCall,
    thunkAPI
  ) => {

    try {

      return await addCallAPI(call);

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const updateCall = createAsyncThunk(
  "calls/update-call",
  async (
    {
      id,
      call,
    }: {
      id:string;
      call:UpdateCall;
    },
    thunkAPI
  ) => {

    try {

      return await updateCallAPI(
        id,
        call
      );

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const startCall = createAsyncThunk(
  "calls/start-call",
  async (
    id:string,
    thunkAPI
  ) => {

    try {

      return await startCallAPI(id);

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const endCall = createAsyncThunk(
  "calls/end-call",
  async (
    {
      id,
      call,
    }: {
      id:string;
      call:EndCall;
    },
    thunkAPI
  ) => {

    try {

      return await endCallAPI(
        id,
        call
      );

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);


export const cancelCall = createAsyncThunk(
  "calls/cancel-call",
  async (
    id:string,
    thunkAPI
  ) => {

    try {

      return await cancelCallAPI(id);

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const deleteCall = createAsyncThunk(
  "calls/delete-call",
  async (
    id:string,
    thunkAPI
  ) => {

    try {

      return await deleteCallAPI(id);

    } catch(err){

      if(err instanceof Error){
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

const callsSlice = createSlice({

  name:"calls",

  initialState,

  reducers:{
    clearError(state){
      state.error = null;
    },
  },


  extraReducers:(builder)=>{


    builder.addCase(fetchCalls.pending,(state)=>{
      state.loading = true;
      state.error = null;
    });


    builder.addCase(fetchCalls.fulfilled,(state,action)=>{
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });


    builder.addCase(fetchCalls.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });




    builder.addCase(addCall.fulfilled,(state,action)=>{
      state.items.unshift(action.payload);
      state.loading = false;
    });



    builder.addCase(updateCall.fulfilled,(state,action)=>{

      const index =
        state.items.findIndex(
          c => c.id === action.payload.id
        );


      if(index !== -1){
        state.items[index] = action.payload;
      }

      state.loading = false;
    });




    builder.addCase(startCall.fulfilled,(state,action)=>{

      const index =
        state.items.findIndex(
          c => c.id === action.payload.id
        );


      if(index !== -1){
        state.items[index] = action.payload;
      }

      state.loading = false;
    });




    builder.addCase(endCall.fulfilled,(state,action)=>{

      const index =
        state.items.findIndex(
          c => c.id === action.payload.id
        );


      if(index !== -1){
        state.items[index] = action.payload;
      }

      state.loading = false;
    });




    builder.addCase(cancelCall.fulfilled,(state,action)=>{

      const index =
        state.items.findIndex(
          c => c.id === action.payload.id
        );


      if(index !== -1){
        state.items[index] = action.payload;
      }

      state.loading = false;
    });




    builder.addCase(deleteCall.fulfilled,(state,action)=>{

      state.items =
        state.items.filter(
          c => c.id !== action.payload
        );

      state.loading = false;

    });



    builder.addCase(addCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(updateCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(startCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(endCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(cancelCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(deleteCall.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload as string;
    });


  }

});


export const {
  clearError
} = callsSlice.actions;


export default callsSlice.reducer; 



  const API_URL = import.meta.env.VITE_BACKEND_URL;

  export async function apiClient(
    endpoint: string,
    options: RequestInit = {}
  ) {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      }
    );

    if (response.status === 401) {

      const refreshResponse = await fetch(
        `${API_URL}/api/auth/refresh`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        const retryResponse = await fetch(
          `${API_URL}${endpoint}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...options.headers,
            },
            ...options,
          }
        );

        const retryData = await retryResponse.json().catch(() => null);

        if (!retryResponse.ok) {
          throw new Error(
            retryData?.error ??
            retryData?.message ??
            `API Error: ${retryResponse.status}`
          );
        }

        return retryData;
      }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        typeof data?.error === "string"
          ? data.error
          : data?.error?.[0]?.message ??
            data?.message ??
            `API Error: ${response.status}`;

      throw new Error(message);
    }

    return data;
  }

  
  import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import profileReducer from "./ProfileSlice"
import contactsReducer from "./contactsSlice"
import leadsReducer from "./leadsSlice"
import uiReducer from './uiSlice'
// import activitiesReducer from './activitiesSlice';
import customersReducer from './customersSlice';
import callsReducer from './callsSlice';
import dealsReducer from './dealsSlice';
import emailsReducer from './emailSlice';
import notesReducer from './notesSlice';
import tasksReducer from './tasksSlice'
import conversatiosReducer from './conversationsSlice'
import messagesReducer from './messagesSlice'
// import superAdminReducer from './superAdminSlice';

export const store = configureStore({
  reducer: {
    user: userReducer, 
    profile: profileReducer,
    contacts: contactsReducer,
    leads: leadsReducer,
    deals: dealsReducer,
    notes: notesReducer,
    emails: emailsReducer,
    tasks: tasksReducer,
    conversations: conversatiosReducer,
    messages: messagesReducer,
    // activities: activitiesReducer,
    customers: customersReducer,
    calls: callsReducer,
    // superAdmin: superAdminReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 


import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip,
} from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DialpadIcon from '@mui/icons-material/Dialpad';
import SearchIcon from '@mui/icons-material/Search';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';

type CallStatus = 'dialing' | 'ringing' | 'active' | 'ended';
type LogType = 'outgoing' | 'incoming' | 'missed';

interface CallLogEntry {
  id: string;
  name: string;
  type: LogType;
  timestamp: number;
  duration: number; // seconds, 0 for missed
}

const seedLog: CallLogEntry[] = [
  { id: '1', name: 'Sarah Lee', type: 'outgoing', timestamp: Date.now() - 1000 * 60 * 45, duration: 184 },
  { id: '2', name: 'Unknown', type: 'missed', timestamp: Date.now() - 1000 * 60 * 60 * 5, duration: 0 },
  { id: '3', name: 'Devon Park', type: 'incoming', timestamp: Date.now() - 1000 * 60 * 60 * 22, duration: 512 },
];

const dialpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CallsPanel() {
  const [log, setLog] = useState<CallLogEntry[]>(seedLog);
  const [query, setQuery] = useState('');
  const [dialInput, setDialInput] = useState('');

  const [status, setStatus] = useState<CallStatus | null>(null); // null = no active call screen
  const [activeName, setActiveName] = useState('');
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
    };
  }, []);

  const visibleLog = useMemo(() => {
    return log
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [log, query]);

  const startCall = (name: string) => {
    if (!name.trim()) return;
    setActiveName(name.trim());
    setStatus('dialing');
    setMuted(false);
    setSpeaker(false);
    setElapsed(0);
    setDialInput('');

    // simulate dialing -> ringing -> answered, after random-ish delays
    ringTimeoutRef.current = setTimeout(() => {
      setStatus('ringing');
      ringTimeoutRef.current = setTimeout(() => {
        setStatus('active');
        timerRef.current = setInterval(() => {
          setElapsed((prev) => prev + 1);
        }, 1000);
      }, 1800);
    }, 1000);
  };

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);

    if (activeName) {
      setLog((prev) => [
        {
          id: crypto.randomUUID(),
          name: activeName,
          type: 'outgoing',
          timestamp: Date.now(),
          duration: elapsed,
        },
        ...prev,
      ]);
    }

    setStatus(null);
    setActiveName('');
    setElapsed(0);
  };

  const redial = (entry: CallLogEntry) => startCall(entry.name);

  const logIcon = (type: LogType) => {
    if (type === 'missed') return <CallMissedIcon sx={{ fontSize: 16, color: '#e0453c' }} />;
    if (type === 'incoming') return <CallReceivedIcon sx={{ fontSize: 16, color: '#4caf50' }} />;
    return <CallMadeIcon sx={{ fontSize: 16, color: '#6a6a6a' }} />;
  };

  // ---------- ACTIVE CALL SCREEN ----------
  if (status) {
    const statusLabel =
      status === 'dialing' ? 'Dialing…' : status === 'ringing' ? 'Ringing…' : formatDuration(elapsed);

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Avatar sx={{ width: 64, height: 64, fontSize: '1.5rem', mb: 1.5 }}>
            {activeName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={700}>
            {activeName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.6,
              mt: 0.5,
              ...(status === 'active' && { fontVariantNumeric: 'tabular-nums' }),
            }}
          >
            {statusLabel}
          </Typography>
        </Box>

        {status === 'active' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title={muted ? 'Unmute' : 'Mute'}>
              <IconButton
                onClick={() => setMuted((m) => !m)}
                sx={{
                  bgcolor: muted ? 'primary.main' : 'action.hover',
                  color: muted ? 'primary.contrastText' : 'inherit',
                }}
              >
                {muted ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title={speaker ? 'Speaker off' : 'Speaker on'}>
              <IconButton
                onClick={() => setSpeaker((s) => !s)}
                sx={{
                  bgcolor: speaker ? 'primary.main' : 'action.hover',
                  color: speaker ? 'primary.contrastText' : 'inherit',
                }}
              >
                <VolumeUpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <IconButton
          onClick={endCall}
          sx={{
            bgcolor: '#e0453c',
            color: '#fff',
            width: 52,
            height: 52,
            '&:hover': { bgcolor: '#c53a32' },
          }}
        >
          <CallEndIcon />
        </IconButton>
      </Box>
    );
  }

  // ---------- LIST / DIALPAD SCREEN ----------
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TextField
        size="small"
        placeholder="Search or enter name/number..."
        value={query || dialInput}
        onChange={(e) => {
          setQuery(e.target.value);
          setDialInput(e.target.value);
        }}
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (dialInput || query) && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  setQuery('');
                  setDialInput('');
                }}
              >
                <BackspaceOutlinedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* recent log */}
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 1 }}>
        {visibleLog.length === 0 ? (
          <Typography variant="body2" sx={{ opacity: 0.5, textAlign: 'center', mt: 4 }}>
            No call history
          </Typography>
        ) : (
          visibleLog.map((entry) => (
            <Box
              key={entry.id}
              onClick={() => redial(entry)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 0.5,
                py: 0.75,
                borderRadius: 1,
                cursor: 'pointer',
                borderBottom: '1px solid',
                borderColor: '#63636322',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                {entry.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: 600,
                    color: entry.type === 'missed' ? '#e0453c' : 'inherit',
                  }}
                >
                  {entry.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {logIcon(entry.type)}
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>
                    {new Date(entry.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {entry.duration > 0 && ` · ${formatDuration(entry.duration)}`}
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Call">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    redial(entry);
                  }}
                >
                  <CallIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))
        )}
      </Box>

      {/* mini dialpad, always visible at bottom */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0.5,
          mb: 1,
        }}
      >
        {dialpadKeys.map((key) => (
          <Box
            key={key}
            onClick={() => setDialInput((prev) => prev + key)}
            sx={{
              textAlign: 'center',
              py: 0.75,
              borderRadius: 1,
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            {key}
          </Box>
        ))}
      </Box>

      <IconButton
        onClick={() => startCall(dialInput || 'Unknown')}
        disabled={!dialInput.trim()}
        sx={{
          bgcolor: dialInput.trim() ? '#4caf50' : 'action.disabledBackground',
          color: '#fff',
          alignSelf: 'center',
          width: 44,
          height: 44,
          '&:hover': { bgcolor: '#43a047' },
        }}
      >
        <DialpadIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

No Tanstack

STACK: MUI, TypeScript, React

Please enhance the ui, the ui uses simulations. Now that i have backend and other resources such as database, please make me a better ui, Check everything above. 1 file only please. 