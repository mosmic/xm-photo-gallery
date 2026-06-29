import { computed, inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesStorageService {
  private readonly storageKey = 'favorite_photos';

  private readonly favoritesSignal = signal<Photo[]>(this.loadFavorites());

  readonly favorites = this.favoritesSignal.asReadonly();

  readonly favoriteIds = computed(() => {
    return new Set(this.favoritesSignal().map((photo) => photo.id));
  });

  private readonly snackBar = inject(MatSnackBar);

  add(photo: Photo): void {
    if (this.isFavorite(photo.id)) {
      return;
    }

    this.updateFavorites([...this.favoritesSignal(), photo]);

    this.snackBar.open('Photo added to favorites', 'Close', {
      duration: 2500,
    });
  }

  remove(photoId: string): void {
    this.updateFavorites(
      this.favoritesSignal().filter((photo) => photo.id !== photoId),
    );
  }

  isFavorite(photoId: string): boolean {
    return this.favoriteIds().has(photoId);
  }

  private updateFavorites(photos: Photo[]): void {
    this.favoritesSignal.set(photos);
    localStorage.setItem(this.storageKey, JSON.stringify(photos));
  }

  private loadFavorites(): Photo[] {
    const storedFavorites = localStorage.getItem(this.storageKey);

    if (!storedFavorites) {
      return [];
    }

    try {
      return JSON.parse(storedFavorites) as Photo[];
    } catch {
      return [];
    }
  }
}
