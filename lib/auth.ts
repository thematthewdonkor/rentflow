import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Resend } from "resend";
import { ResetPasswordEmail } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url }) => {
      void resend.emails.send({
        from: "Rentflow <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({ name: user.name, url }),
      });
    },
    revokeSessionsOnPasswordReset: true,
  },
});
