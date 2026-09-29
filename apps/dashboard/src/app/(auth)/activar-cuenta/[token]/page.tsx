import { ActivationScreen } from "@/features/auth/components/activation-screen";

export default async function ActivateAccountPage({ params }: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ActivationScreen key={token} token={token} />;
}
