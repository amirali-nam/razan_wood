import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = { title: 'پنل مدیریت', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminDashboard />;
}
