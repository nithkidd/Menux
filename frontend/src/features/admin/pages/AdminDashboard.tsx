import { useState } from 'react';
import { usePermissions } from '../../../shared/hooks/usePermissions';
import PageTransition from '../../../shared/components/PageTransition';
import AdminLayout from '../components/AdminLayout';
import AdminOverview from './AdminOverview';
import AdminBusinesses from './AdminBusinesses';
import AdminUsers from './AdminUsers';

type Tab = 'overview' | 'businesses' | 'users';

export default function AdminDashboard() {
  const { isSuperAdmin } = usePermissions();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <PageTransition>
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'businesses' && <AdminBusinesses />}
        {activeTab === 'users' && isSuperAdmin && <AdminUsers />}
      </AdminLayout>
    </PageTransition>
  );
}
