import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FavoritesStorageService } from '../../../../shared/services/favorites-storage.service';

@Component({
  selector: 'app-photo-details-page',
  imports: [NgOptimizedImage, MatButtonModule, RouterLink],
  templateUrl: './photo-details-page.component.html',
  styleUrl: './photo-details-page.component.scss',
})
export class PhotoDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly favoritesStorageService = inject(FavoritesStorageService);

  private readonly photoId = this.route.snapshot.paramMap.get('id');

  readonly photo = computed(() => {
    if (!this.photoId) {
      return undefined;
    }

    return this.favoritesStorageService.findById(this.photoId);
  });

  removeFromFavorites(): void {
    if (!this.photoId) {
      return;
    }

    this.favoritesStorageService.remove(this.photoId);

    void this.router.navigate(['/favorites']);
  }
}
