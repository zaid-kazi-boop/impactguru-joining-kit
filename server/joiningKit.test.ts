import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("joiningKit procedures", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    const authContext = createAuthContext();
    ctx = authContext.ctx;
  });

  it("should validate required fields in submission", async () => {
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.joiningKit.submit({
        fullName: "",
        fathersName: "",
        dateOfBirth: "",
        gender: "",
        maritalStatus: "",
        currentAddress: "",
        mobileNumber: "",
        personalEmail: "invalid",
        employeeId: "",
        designation: "",
        department: "",
        reportingManager: "",
        dateOfJoining: "",
        employmentType: "",
        workLocation: "",
        panNumber: "",
        aadhaarNumber: "",
        bankAccountNumber: "",
        bankName: "",
        ifscCode: "",
        accountHolderName: "",
        emergencyContactName: "",
        emergencyContactRelation: "",
        emergencyContactPhone: "",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("should list joining kit submissions", async () => {
    const caller = appRouter.createCaller(ctx);

    const result = await caller.joiningKit.list({
      limit: 10,
      offset: 0,
    });

    expect(result).toHaveProperty("submissions");
    expect(result).toHaveProperty("count");
    expect(Array.isArray(result.submissions)).toBe(true);
    expect(typeof result.count).toBe("number");
  });

  it("should search joining kit submissions by name", async () => {
    const caller = appRouter.createCaller(ctx);

    const result = await caller.joiningKit.search({
      query: "test",
    });

    expect(Array.isArray(result)).toBe(true);
  });
});
