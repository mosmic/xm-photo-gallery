import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PhotoCardComponent } from '../../../../shared/components/photo-card/photo-card.component';
import { Photo } from '../../../../shared/models/photo.model';
import { FavoritesStorageService } from '../../../../shared/services/favorites-storage.service';

@Component({
  selector: 'app-favorites-page',
  imports: [PhotoCardComponent],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.scss',
})
export class FavoritesPageComponent {
  private readonly favoritesStorageService = inject(FavoritesStorageService);
  private readonly router = inject(Router);

  readonly favorites = this.favoritesStorageService.favorites;

  openPhotoDetails(photo: Photo): void {
    void this.router.navigate(['/photos', photo.id]);
  }
}
