import { z } from "zod";

// Image Schema
export const ChurchImageSchema = z.object({
  id: z.number().optional(),
  image: z.string().min(1, "Image URL is required"),
  churchId: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Base Church Schema
export const ChurchSchema = z.object({
  id: z.number().optional(),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().int("Latitude must be an integer"),
  longitude: z.number().int("Longitude must be an integer"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  images: z.array(ChurchImageSchema).optional(),
});

// Create Schema
export const ChurchCreateSchema = ChurchSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  images: z.array(ChurchImageSchema.omit({ churchId: true, id: true })).optional(),
});

// Update Schema
export const ChurchUpdateSchema = ChurchCreateSchema.partial().extend({
  id: z.number(),
});

// Response Schema
export const ChurchResponseSchema = ChurchSchema.extend({
  images: z.array(ChurchImageSchema),
});

// Query Parameters Schema (for GET all)
export const ChurchQuerySchema = z.object({
  address: z.string().optional(),
  latitude: z.coerce.number().int().optional(),
  longitude: z.coerce.number().int().optional(),
  createdAtFrom: z.coerce.date().optional(),
  createdAtTo: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  sort: z.string().optional(),
});

// Paginated Response Schema
export const ChurchPaginatedResponseSchema = z.object({
  data: z.array(ChurchResponseSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

// Type exports
export type ChurchCreateType = z.infer<typeof ChurchCreateSchema>;
export type ChurchUpdateType = z.infer<typeof ChurchUpdateSchema>;
export type ChurchResponseType = z.infer<typeof ChurchResponseSchema>;
export type ChurchQueryType = z.infer<typeof ChurchQuerySchema>;
export type ChurchPaginatedResponseType = z.infer<typeof ChurchPaginatedResponseSchema>;



const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
});

export const PositionSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  User: z.array(UserSchema).optional(),
});

export const PositionCreateSchema = PositionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  User: true,
});

export const PositionUpdateSchema = PositionCreateSchema.partial().extend({
  id: z.number(),
});

export const PositionResponseSchema = PositionSchema.extend({
  User: z.array(UserSchema).optional(),
});

export const PositionQuerySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  createdAtFrom: z.coerce.date().optional(),
  createdAtTo: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  sort: z.string().optional(),
  includeUsers: z.coerce.boolean().default(false),
});

// Paginated Response Schema
export const PositionPaginatedResponseSchema = z.object({
  data: z.array(PositionResponseSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

// Type exports
export type PositionCreateType = z.infer<typeof PositionCreateSchema>;
export type PositionUpdateType = z.infer<typeof PositionUpdateSchema>;
export type PositionResponseType = z.infer<typeof PositionResponseSchema>;
export type PositionQueryType = z.infer<typeof PositionQuerySchema>;
export type PositionPaginatedResponseType = z.infer<typeof PositionPaginatedResponseSchema>;


// UserSubjects Schema
const UserSubjectsSchema = z.object({
  id: z.number(),
  userId: z.number(),
  subjectId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: UserSchema,
});

// Base Subject Schema
export const SubjectSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  disabled: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userSubjects: z.array(UserSubjectsSchema).optional(),
});

// Create Schema
export const SubjectCreateSchema = SubjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userSubjects: true,
});

// Update Schema
export const SubjectUpdateSchema = SubjectCreateSchema.partial().extend({
  id: z.number(),
});

// Response Schema
export const SubjectResponseSchema = SubjectSchema.extend({
  userSubjects: z.array(UserSubjectsSchema).optional(),
});

// Query Parameters Schema
export const SubjectQuerySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  disabled: z.coerce.boolean().optional(),
  createdAtFrom: z.coerce.date().optional(),
  createdAtTo: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  sort: z.string().optional(),
  includeUsers: z.coerce.boolean().default(false),
});

// Paginated Response Schema
export const SubjectPaginatedResponseSchema = z.object({
  data: z.array(SubjectResponseSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

// Type exports
export type SubjectCreateType = z.infer<typeof SubjectCreateSchema>;
export type SubjectUpdateType = z.infer<typeof SubjectUpdateSchema>;
export type SubjectResponseType = z.infer<typeof SubjectResponseSchema>;
export type SubjectQueryType = z.infer<typeof SubjectQuerySchema>;
export type SubjectPaginatedResponseType = z.infer<typeof SubjectPaginatedResponseSchema>;


// Login Schema
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Session User Schema
export const SessionUserSchema = z.object({
  id: z.string(),
  role: z.enum(["admin", "worker"]),
  name: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  image: z.string().optional().nullable(),
});

// Session Response Schema
export const SessionResponseSchema = z.object({
  user: SessionUserSchema,
  expires: z.string(),
});

// Error Response Schema
export const ErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
});

// Logout Response Schema
export const LogoutResponseSchema = z.object({
  message: z.literal("Logout successful"),
});

// Type exports
export type LoginType = z.infer<typeof LoginSchema>;
export type SessionUserType = z.infer<typeof SessionUserSchema>;
export type SessionResponseType = z.infer<typeof SessionResponseSchema>;
export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>;
export type LogoutResponseType = z.infer<typeof LogoutResponseSchema>;


// Base Admin Schema
export const AdminSchema = z.object({
  id: z.number().optional(),
  email: z.string().email("Invalid email address"),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  middlename: z.string().optional(),
  createdAt: z.date().optional(),
});

// Create Schema
export const AdminCreateSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirmation is required"),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  middlename: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Update Schema
export const AdminUpdateSchema = z.object({
  id: z.number(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  confirmPassword: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  middlename: z.string().optional(),
}).refine(data => {
  if (data.password && !data.confirmPassword) return false;
  if (data.password !== data.confirmPassword) return false;
  return true;
}, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

// Response Schema
export const AdminResponseSchema = AdminSchema.extend({
  id: z.number(),
  createdAt: z.date(),
});

// Array Response Schema
export const AdminArrayResponseSchema = z.array(AdminResponseSchema);

// Type exports
export type AdminCreateType = z.infer<typeof AdminCreateSchema>;
export type AdminUpdateType = z.infer<typeof AdminUpdateSchema>;
export type AdminResponseType = z.infer<typeof AdminResponseSchema>;
export type AdminArrayResponseType = z.infer<typeof AdminArrayResponseSchema>;


export const UserRolesSchema = z.enum(['admin', 'worker']);
export const UserGenderSchema = z.enum(['male', 'female']);
export const UserStatusSchema = z.enum(['widowed', 'single', 'married']);

export const WorkerSchema = z.object({
  // Core Information
  id: z.number().optional(),
  profilePicture: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  middlename: z.string().optional(),
  birthday: z.coerce.date(),
  contact: z.string().optional(),
  gender: UserGenderSchema.optional(),
  email: z.string().email(),
  address: z.string().optional(),
  password: z.string().optional(),
  role: UserRolesSchema.default('worker'),
  description: z.string().optional(),
  status: UserStatusSchema.optional(),

  // Government IDs
  sss: z.string().optional(),
  sssimage: z.string().optional(),
  pagibig: z.string().optional(),
  pagibigimage: z.string().optional(),
  tin: z.string().optional(),
  tinimage: z.string().optional(),
  psn: z.string().optional(),
  psnimage: z.string().optional(),
  philhealth: z.string().optional(),
  philhealthimage: z.string().optional(),

  // Relationships
  churchId: z.number().optional(),
  positionId: z.number().optional(),
  children: z.array(z.object({
    firstname: z.string(),
    lastname: z.string(),
    middlename: z.string().optional(),
    birthday: z.coerce.date(),
    gender: UserGenderSchema
  })).optional(),
  eudcationalAttainment: z.array(z.object({
    schoolname: z.string(),
    education: z.string()
  })).optional(),
  cases: z.array(z.object({
    year: z.number(),
    where: z.string(),
    case: z.string(),
    reason: z.string()
  })).optional(),
  userSubjects: z.array(z.object({
    subjectId: z.number()
  })).optional(),

  // Timestamps
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
});

// Create Schema
export const WorkerCreateSchema = WorkerSchema.omit({
  id: true,
  role: true,
  createdAt: true,
  updatedAt: true
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirmation is required"),
  subjects: z.array(z.number()).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Update Schema
export const WorkerUpdateSchema = WorkerSchema
  .omit({
    password: true,
    createdAt: true,
    updatedAt: true
  })
  .extend({
    id: z.number(),
    password: z.string().optional(),
    confirmPassword: z.string().optional().refine((val): val is string => true),
  })
  .refine(data => {
    if (data.password && !data.confirmPassword) return false;
    return !(data.password && data.password !== data.confirmPassword);
  }, {
    message: "Passwords must match",
    path: ["confirmPassword"]
  });

// Response Schema
export const WorkerResponseSchema = WorkerSchema.extend({
  id: z.number(),
  church: z.lazy(() => ChurchSchema).optional(),
  position: z.lazy(() => PositionSchema).optional(),
  userSubjects: z.array(z.object({
    subject: SubjectSchema
  })).optional(),
  cases: z.array(z.object({
    id: z.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
  })).optional(),
  children: z.array(z.object({
    id: z.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
  })).optional(),
  eudcationalAttainment: z.array(z.object({
    id: z.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
  })).optional()
}).omit({ password: true });

// Type exports
export type WorkerCreateType = z.infer<typeof WorkerCreateSchema>;
export type WorkerUpdateType = z.infer<typeof WorkerUpdateSchema>;
export type WorkerResponseType = z.infer<typeof WorkerResponseSchema>;