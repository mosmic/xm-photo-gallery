import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'photos',
    pathMatch: 'full',
  },
  {
    path: 'photos',
    loadChildren: () =>
      import('./features/photos/photos.routes').then((m) => m.PHOTOS_ROUTES),
  },
];
