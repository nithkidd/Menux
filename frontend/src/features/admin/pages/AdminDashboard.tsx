import { useState } from 'react';
import PageTransition from '../../../shared/components/PageTransition';
import AdminLayout from '../components/AdminLayout';
import AdminOverview from './AdminOverview';
import AdminBusinesses from './AdminBusinesses';
import AdminUsers from './AdminUsers';

type Tab = 'overview' | 'businesses' | 'users';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <PageTransition>
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'businesses' && <AdminBusinesses />}
        {activeTab === 'users' && <AdminUsers />}
      </AdminLayout>
    </PageTransition>
  );
}
