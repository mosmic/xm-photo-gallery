import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/photos/pages/photos-page/photos-page.component').then(
        (m) => m.PhotosPageComponent,
      ),
  },
];
