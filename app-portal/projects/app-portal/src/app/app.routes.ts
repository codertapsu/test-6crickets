import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'preview',
    loadComponent: () =>
      import('./modules/countdown-preview/countdown-preview.component').then(m => m.CountdownPreviewComponent),
  },
  {
    path: 'camera',
    loadComponent: () => import('./modules/camera/camera.component').then(m => m.CameraComponent),
  },
];
