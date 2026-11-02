"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon, MailCheckIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      form.setError("root", {
        message: error.message ?? "Something went wrong. Please try again.",
      });
      return;
    }

    setSentTo(values.email);
  }

  const { isSubmitting, errors } = form.formState;

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <IconBadge>
          <MailCheckIcon />
        </IconBadge>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            If an account exists for{" "}
            <span className="font-medium text-foreground">{sentTo}</span>,
            you&apos;ll receive password reset instructions shortly.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 w-full rounded-full"
          render={<Link href="/sign-in" />}
          nativeButton={false}
        >
          Back to Login
        </Button>
        <p className="text-sm text-muted-foreground">
          Didn&apos;t get the email?{" "}
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="font-medium text-primary hover:underline"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <IconBadge className="mb-3">
            <LockIcon />
          </IconBadge>
          <h1 className="text-xl font-bold">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you password reset
            instructions.
          </p>
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
              <Input
                {...field}
                id="forgot-password-email"
                type="email"
                placeholder="demo@gmail.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="h-10 bg-background"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          {errors.root && <FieldError className="text-center" errors={[errors.root]} />}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-full"
          >
            {isSubmitting && <Spinner data-icon="inline-start" />}
            Forgot Password
          </Button>
        </Field>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have access anymore?
          <br />
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Try another method
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}

export function IconBadge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex size-16 items-center justify-center rounded-full border border-primary/20 bg-primary/5",
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary [&_svg]:size-4">
        {children}
      </div>
    </div>
  );
}
