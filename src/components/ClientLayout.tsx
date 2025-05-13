"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ToastProvider as ShadcnToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ReactNode } from 'react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ShadcnToastProvider>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <Toaster />
      </ShadcnToastProvider>
    </AuthProvider>
  );
} 