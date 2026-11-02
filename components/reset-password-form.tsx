"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { IconBadge } from "@/components/forgot-password-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be at most 128 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({ token }: { token?: string }) {
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordValues) {
    const { error } = await authClient.resetPassword({
      newPassword: values.newPassword,
      token,
    });

    if (error) {
      form.setError("root", {
        message: error.message ?? "Something went wrong. Please try again.",
      });
      return;
    }

    setIsReset(true);
  }

  const { isSubmitting, errors } = form.formState;

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <IconBadge>
          <CircleAlertIcon />
        </IconBadge>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Link Expired</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired. Please request
            a new one.
          </p>
        </div>
        <Button
          className="h-10 w-full rounded-full"
          render={<Link href="/forgot-password" />}
          nativeButton={false}
        >
          Request New Link
        </Button>
      </div>
    );
  }

  if (isReset) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <IconBadge>
          <CircleCheckIcon />
        </IconBadge>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Password Reset</h1>
          <p className="text-sm text-muted-foreground">
            Your password has been changed successfully. You can now log in
            with your new password.
          </p>
        </div>
        <Button
          className="h-10 w-full rounded-full"
          render={<Link href="/sign-in" />}
          nativeButton={false}
        >
          Back to Login
        </Button>
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
          <h1 className="text-xl font-bold">Create New Password</h1>
          <p className="text-sm text-muted-foreground">
            Please enter a new password. Your new password must be different
            from previous password.
          </p>
        </div>

        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reset-password-new">New Password</FieldLabel>
              <InputGroup className="h-10 bg-background">
                <InputGroupInput
                  {...field}
                  id="reset-password-new"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reset-password-confirm">
                Confirm New Password
              </FieldLabel>
              <InputGroup className="h-10 bg-background">
                <InputGroupInput
                  {...field}
                  id="reset-password-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
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
            Reset Password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
