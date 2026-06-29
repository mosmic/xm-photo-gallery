import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/photos/pages/photos-page/photos-page.component').then(
        (m) => m.PhotosPageComponent,
      ),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/pages/favorites-page/favorites-page.component').then(
        (m) => m.FavoritesPageComponent,
      ),
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./features/photo-details/pages/photo-details-page/photo-details-page.component').then(
        (m) => m.PhotoDetailsPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
