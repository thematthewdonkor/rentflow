import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "react-email";

type ResetPasswordEmailProps = {
  name: string;
  url: string;
};

export function ResetPasswordEmail({ name, url }: ResetPasswordEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your RentFlow password</Preview>
      <Body style={{ backgroundColor: "#fafafa", fontFamily: "sans-serif" }}>
        <Container
          style={{
            margin: "40px auto",
            maxWidth: "480px",
            padding: "32px",
            borderRadius: "16px",
            backgroundColor: "#ffffff",
          }}
        >
          <Heading as="h1" style={{ fontSize: "20px", color: "#0a0a0a" }}>
            Reset your password
          </Heading>
          <Text style={{ fontSize: "14px", color: "#525252" }}>
            Hi {name}, we received a request to reset your RentFlow password.
            Click the button below to choose a new one.
          </Text>
          <Button
            href={url}
            style={{
              display: "block",
              padding: "12px 24px",
              borderRadius: "9999px",
              backgroundColor: "#f26722",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Reset Password
          </Button>
          <Text style={{ fontSize: "12px", color: "#a3a3a3" }}>
            This link expires in 1 hour. If you didn&apos;t request a password
            reset, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ResetPasswordEmail;
