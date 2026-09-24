import React from 'react';
import { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Painel Administrativo | SD Eventos',
  description: 'Gestão de orçamentos, cotações recebidas e controle de serviços da SD Eventos.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
