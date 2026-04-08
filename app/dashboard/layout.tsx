import { DFSDynamicMenu } from '@/components/DFSDynamicMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DFSDynamicMenu userRole="admin" />
      <main className="pt-16">{children}</main>
    </>
  );
}
