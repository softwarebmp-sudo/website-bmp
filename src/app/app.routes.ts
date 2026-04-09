import { Routes } from '@angular/router';

export const routes: Routes = [
     {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
   {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then(c => c.Home),
    title: 'BMP Company',
    data: {
      description: 'BMP Company S.A.S. - Soluciones integrales de ingeniería y tecnología. Seguridad electrónica, data centers, cableado estructurado, automatización, paneles solares y más. Desde 2017 en Colombia.',
      canonical: '/',
    },
  },
  
];
