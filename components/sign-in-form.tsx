"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean(),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSubmit(values: SignInValues) {
    const { error } = await signIn.email(values);

    if (error) {
      form.setError("root", {
        message: error.message ?? "Something went wrong. Please try again.",
      });
      return;
    }

    router.push("/");
  }

  const { isSubmitting, errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <Image
            src="/assets/user.svg"
            alt=""
            width={64}
            height={64}
            className="mb-3"
          />
          <h1 className="text-xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Glad to see you again. Log in to your account.
          </p>
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sign-in-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="sign-in-email"
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

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
              <InputGroup className="h-10 bg-background">
                <InputGroupInput
                  {...field}
                  id="sign-in-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

        <div className="flex items-center justify-between gap-4">
          <Controller
            name="rememberMe"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal" className="w-auto">
                <Checkbox
                  id="sign-in-remember-me"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel
                  htmlFor="sign-in-remember-me"
                  className="font-normal"
                >
                  Keep me logged in
                </FieldLabel>
              </Field>
            )}
          />
          <Link
            href="/forgot-password"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Field>
          {errors.root && <FieldError className="text-center" errors={[errors.root]} />}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-full"
          >
            {isSubmitting && <Spinner data-icon="inline-start" />}
            Login
          </Button>
        </Field>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have account?{" "}
          <Link href="/sign-up" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
