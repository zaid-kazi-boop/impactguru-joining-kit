import { eq, count, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, joiningKitSubmissions, InsertJoiningKitSubmission, notificationsLog, InsertNotificationLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createJoiningKitSubmission(data: InsertJoiningKitSubmission) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(joiningKitSubmissions).values(data);
  // Return the inserted ID
  return (result as any).insertId || 0;
}

export async function getJoiningKitSubmissions(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { desc } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(joiningKitSubmissions)
    .orderBy(desc(joiningKitSubmissions.submittedAt))
    .limit(limit)
    .offset(offset);

  return result;
}

export async function getJoiningKitSubmissionById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(joiningKitSubmissions)
    .where(eq(joiningKitSubmissions.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function searchJoiningKitSubmissions(searchTerm: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { like, desc, or } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(joiningKitSubmissions)
    .where(
      or(
        like(joiningKitSubmissions.fullName, `%${searchTerm}%`),
        like(joiningKitSubmissions.personalEmail, `%${searchTerm}%`),
        like(joiningKitSubmissions.employeeId, `%${searchTerm}%`)
      )
    )
    .orderBy(desc(joiningKitSubmissions.submittedAt));

  return result;
}

export async function getJoiningKitSubmissionsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { gte, lte, desc } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(joiningKitSubmissions)
    .where(
      gte(joiningKitSubmissions.submittedAt, startDate) &&
      lte(joiningKitSubmissions.submittedAt, endDate)
    )
    .orderBy(desc(joiningKitSubmissions.submittedAt));

  return result;
}

export async function getJoiningKitSubmissionCount() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select({ count: count() })
    .from(joiningKitSubmissions);

  return result[0]?.count || 0;
}

export async function getJoiningKitSubmissionsByStatus(status: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { desc } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(joiningKitSubmissions)
    .where(eq(joiningKitSubmissions.status, status as any))
    .orderBy(desc(joiningKitSubmissions.submittedAt));

  return result;
}

export async function createNotificationLog(notification: InsertNotificationLog) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(notificationsLog).values(notification);
  return result;
}

export async function getNotificationsBySubmissionId(submissionId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { desc } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(notificationsLog)
    .where(eq(notificationsLog.submissionId, submissionId))
    .orderBy(desc(notificationsLog.createdAt));

  return result;
}

export async function getAllNotifications() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { desc } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(notificationsLog)
    .orderBy(desc(notificationsLog.createdAt))
    .limit(100);

  return result;
}

// TODO: add feature queries here as your schema grows.
