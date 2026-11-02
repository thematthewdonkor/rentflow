import { ResetPasswordForm } from "@/components/reset-password-form";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) => {
  const { token, error } = await searchParams;

  // Better Auth redirects here with ?error=INVALID_TOKEN for bad or expired links.
  return <ResetPasswordForm token={error ? undefined : token} />;
};

export default ResetPasswordPage;
