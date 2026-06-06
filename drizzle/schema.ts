import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Joining Kit Submissions table
 * Stores all submitted joining kit forms with employee details
 */
export const joiningKitSubmissions = mysqlTable("joining_kit_submissions", {
  id: int("id").autoincrement().primaryKey(),
  // Personal Details
  fullName: varchar("fullName", { length: 255 }).notNull(),
  fathersName: varchar("fathersName", { length: 255 }).notNull(),
  mothersName: varchar("mothersName", { length: 255 }),
  spouseName: varchar("spouseName", { length: 255 }),
  dateOfBirth: varchar("dateOfBirth", { length: 20 }).notNull(),
  gender: varchar("gender", { length: 50 }).notNull(),
  maritalStatus: varchar("maritalStatus", { length: 50 }).notNull(),
  nationality: varchar("nationality", { length: 100 }),
  bloodGroup: varchar("bloodGroup", { length: 10 }),
  religion: varchar("religion", { length: 100 }),
  // Address Details
  currentAddress: text("currentAddress").notNull(),
  currentLandmark: varchar("currentLandmark", { length: 255 }),
  permanentAddress: text("permanentAddress"),
  village: varchar("village", { length: 255 }),
  state: varchar("state", { length: 100 }),
  // Contact Details
  mobileNumber: varchar("mobileNumber", { length: 20 }).notNull(),
  landline: varchar("landline", { length: 20 }),
  personalEmail: varchar("personalEmail", { length: 320 }).notNull(),
  placeOfSigning: varchar("placeOfSigning", { length: 255 }),
  // Employment Details
  employeeId: varchar("employeeId", { length: 50 }).notNull().unique(),
  designation: varchar("designation", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }).notNull(),
  reportingManager: varchar("reportingManager", { length: 255 }).notNull(),
  dateOfJoining: varchar("dateOfJoining", { length: 20 }).notNull(),
  employmentType: varchar("employmentType", { length: 50 }).notNull(),
  workLocation: varchar("workLocation", { length: 255 }).notNull(),
  ctc: varchar("ctc", { length: 50 }),
  officeEmail: varchar("officeEmail", { length: 320 }),
  // KYC & Bank Details
  panNumber: varchar("panNumber", { length: 20 }).notNull(),
  aadhaarNumber: varchar("aadhaarNumber", { length: 20 }).notNull(),
  bankAccountNumber: varchar("bankAccountNumber", { length: 50 }).notNull(),
  bankName: varchar("bankName", { length: 255 }).notNull(),
  ifscCode: varchar("ifscCode", { length: 20 }).notNull(),
  accountHolderName: varchar("accountHolderName", { length: 255 }).notNull(),
  // Family & PF Details
  emergencyContactName: varchar("emergencyContactName", { length: 255 }).notNull(),
  emergencyContactRelation: varchar("emergencyContactRelation", { length: 100 }).notNull(),
  emergencyContactPhone: varchar("emergencyContactPhone", { length: 20 }).notNull(),
  pfNumber: varchar("pfNumber", { length: 50 }),
  esiNumber: varchar("esiNumber", { length: 50 }),
  dependents: int("dependents").default(0),
  // Signature & Submission
  signature: text("signature"), // Base64 encoded signature
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  submittedBy: int("submittedBy"), // Reference to user who submitted
  status: mysqlEnum("status", ["draft", "submitted", "reviewed", "approved"]).default("submitted").notNull(),
  notes: text("notes"), // HR notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JoiningKitSubmission = typeof joiningKitSubmissions.$inferSelect;
export type InsertJoiningKitSubmission = typeof joiningKitSubmissions.$inferInsert;

/**
 * Notifications Log table
 * Stores all notifications sent to owner about joining kit submissions
 */
export const notificationsLog = mysqlTable("notifications_log", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submissionId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).default("submission").notNull(),
  status: varchar("status", { length: 50 }).default("sent").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NotificationLog = typeof notificationsLog.$inferSelect;
export type InsertNotificationLog = typeof notificationsLog.$inferInsert;