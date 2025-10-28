import { PageProps as InertiaPageProps } from '@inertiajs/core';

// Extiende los props globales de Inertia
declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps {
    auth?: {
      user?: {
        id: number;
        name: string;
        email: string;
        role_id?: number;
      };
    };
    flash?: {
      success?: string;
      error?: string;
    };
  }
}
