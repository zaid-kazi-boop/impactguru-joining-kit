import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createJoiningKitSubmission, getJoiningKitSubmissions, getJoiningKitSubmissionById, searchJoiningKitSubmissions, getJoiningKitSubmissionCount, getJoiningKitSubmissionsByDateRange, createNotificationLog, getAllNotifications, getNotificationsBySubmissionId } from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  joiningKit: router({
    submit: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1),
          fathersName: z.string().min(1),
          mothersName: z.string().optional(),
          spouseName: z.string().optional(),
          dateOfBirth: z.string().min(1),
          gender: z.string().min(1),
          maritalStatus: z.string().min(1),
          nationality: z.string().optional(),
          bloodGroup: z.string().optional(),
          religion: z.string().optional(),
          currentAddress: z.string().min(1),
          currentLandmark: z.string().optional(),
          permanentAddress: z.string().optional(),
          village: z.string().optional(),
          state: z.string().optional(),
          mobileNumber: z.string().min(1),
          landline: z.string().optional(),
          personalEmail: z.string().email(),
          placeOfSigning: z.string().optional(),
          employeeId: z.string().min(1),
          designation: z.string().min(1),
          department: z.string().min(1),
          reportingManager: z.string().min(1),
          dateOfJoining: z.string().min(1),
          employmentType: z.string().min(1),
          workLocation: z.string().min(1),
          ctc: z.string().optional(),
          officeEmail: z.string().email().optional(),
          panNumber: z.string().min(1),
          aadhaarNumber: z.string().min(1),
          bankAccountNumber: z.string().min(1),
          bankName: z.string().min(1),
          ifscCode: z.string().min(1),
          accountHolderName: z.string().min(1),
          emergencyContactName: z.string().min(1),
          emergencyContactRelation: z.string().min(1),
          emergencyContactPhone: z.string().min(1),
          pfNumber: z.string().optional(),
          esiNumber: z.string().optional(),
          dependents: z.number().optional(),
          signature: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Generate a unique submission reference
        const submissionRef = `JK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const submission = await createJoiningKitSubmission({
          ...input,
          submittedBy: ctx.user?.id || 0,
          submittedAt: new Date(),
          status: "submitted",
        });

        // Notify owner of new submission
        const notificationResult = await notifyOwner({
          title: "New Joining Kit Submission",
          content: `${input.fullName} (Employee ID: ${input.employeeId}) has submitted their joining kit. Submission Reference: ${submissionRef}`,
        });

        // Log the notification
        if (submission && submission > 0) {
          await createNotificationLog({
            submissionId: submission,
            title: "New Joining Kit Submission",
            content: `${input.fullName} (${input.employeeId}) has submitted their joining kit.`,
            type: "submission",
            status: notificationResult ? "sent" : "failed",
          });
        }

        return { success: true, submissionId: submission, reference: submissionRef };
      }),

    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        const submissions = await getJoiningKitSubmissions(input.limit, input.offset);
        const count = await getJoiningKitSubmissionCount();
        return { submissions, count };
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getJoiningKitSubmissionById(input.id);
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await searchJoiningKitSubmissions(input.query);
      }),

    filterByDateRange: publicProcedure
      .input(
        z.object({
          startDate: z.date(),
          endDate: z.date(),
        })
      )
      .query(async ({ input }) => {
        return await getJoiningKitSubmissionsByDateRange(input.startDate, input.endDate);
      }),

    getNotifications: publicProcedure
      .query(async () => {
        return await getAllNotifications();
      }),

    getNotificationsBySubmission: publicProcedure
      .input(z.object({ submissionId: z.number() }))
      .query(async ({ input }) => {
        return await getNotificationsBySubmissionId(input.submissionId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
