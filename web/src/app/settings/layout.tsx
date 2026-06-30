import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, name: true, email: true, image: true },
  });

  return (
    <div className="gradient-bg flex min-h-screen">
      <DashboardSidebar user={{ ...session.user, plan: user?.plan ?? session.user.plan }} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
