import { Routes } from '@angular/router';
import {About} from './pages/about/about';
import {Portfolio} from './pages/portfolio/portfolio';
import {Services} from './pages/services/services';
import {Blog} from './pages/blog/blog';
import {Contact} from './pages/contact/contact';
import {LoginComponent} from './pages/dashboard/section/login/login';
import {Dash} from './pages/dashboard/section/dash/dash';

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
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about').then(c => c.About),
    title: 'BMP Company',
    data: {
      description: 'BMP Company S.A.S. - Soluciones integrales de ingeniería y tecnología. Seguridad electrónica, data centers, cableado estructurado, automatización, paneles solares y más. Desde 2017 en Colombia.',
      canonical: '/',
    },
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('./pages/portfolio/portfolio').then(c => c.Portfolio),
    title: 'BMP Company',
    data: {
      description: 'BMP Company S.A.S. - Soluciones integrales de ingeniería y tecnología. Seguridad electrónica, data centers, cableado estructurado, automatización, paneles solares y más. Desde 2017 en Colombia.',
      canonical: '/',
    },
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services/services').then(c => c.Services),
    title: 'BMP Company',
    data: {
      description: 'BMP Company S.A.S. - Soluciones integrales de ingeniería y tecnología. Seguridad electrónica, data centers, cableado estructurado, automatización, paneles solares y más. Desde 2017 en Colombia.',
      canonical: '/',
    },
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/blog').then(c => c.Blog),
    title: 'BMP Company',
    data: {
      description: 'BMP Company S.A.S. - Soluciones integrales de ingeniería y tecnología. Seguridad electrónica, data centers, cableado estructurado, automatización, paneles solares y más. Desde 2017 en Colombia.',
      canonical: '/',
    },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact').then(c => c.Contact),
    title: 'BMP Company',
    data: {
      description: 'BMP Company S.A.S. - Soluciones integrales de ingeniería y tecnología. Seguridad electrónica, data centers, cableado estructurado, automatización, paneles solares y más. Desde 2017 en Colombia.',
      canonical: '/',
    },
  },
{
  path: 'admin/login',
  loadComponent: () =>
    import('./pages/dashboard/section/login/login').then(c => c.LoginComponent),
},
{
  path: 'admin',
  loadComponent: () =>
    import('./pages/dashboard/dashboard').then(c => c.Dashboard),
  children: [
    {
      path: 'panel',
      loadComponent: () =>
        import('./pages/dashboard/section/dash/dash').then(c => c.Dash),
    },
    {
      path: 'portfolio',
      loadComponent: () =>
        import('./pages/dashboard/section/portfolio/portfolio').then(c => c.Portfolio),
    },
    {
        path: 'services',
        loadComponent: () =>
          import('./pages/dashboard/section/services/services').then(c => c.Services),
        title: 'Administrar Servicios | BMP Company'
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./pages/dashboard/section/blog/blog').then(c => c.Blog),
        title: 'Administrar Blog | BMP Company'
      },
      {
        path: 'add-portfolio',
        loadComponent: () =>
          import('./pages/dashboard/section/add-portfolio/add-portfolio').then(c => c.AddPortfolio),
        title: 'Agregar Portafolio | BMP Company'
      },
      {
        path: 'add-services',
        loadComponent: () =>
          import('./pages/dashboard/section/add-services/add-services').then(c => c.AddServices),
        title: 'Agregar Servicios | BMP Company'
      },
      {
        path: 'add-post',
        loadComponent: () =>
          import('./pages/dashboard/section/add-post/add-post').then(c => c.AddPost),
        title: 'Agregar Post | BMP Company'
      }
  ]
}
  
];
