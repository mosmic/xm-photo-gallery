import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PhotoCardComponent } from '../../../../shared/components/photo-card/photo-card.component';
import { Photo } from '../../../../shared/models/photo.model';
import { PhotosService } from '../../../../shared/services/photos.service';

@Component({
  selector: 'app-photos-page',
  imports: [PhotoCardComponent, MatProgressSpinnerModule],
  templateUrl: './photos-page.component.html',
  styleUrl: './photos-page.component.scss',
})
export class PhotosPageComponent {
  private readonly photosService = inject(PhotosService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly scrollContainerRef =
    viewChild<ElementRef<HTMLElement>>('scrollContainer');

  private readonly sentinelRef = viewChild<ElementRef<HTMLElement>>('sentinel');

  private sentinelVisible = false;

  readonly photos = signal<Photo[]>([]);
  readonly loading = signal(false);

  constructor() {
    afterNextRender(() => {
      this.observeInfiniteScroll();
      void this.loadMorePhotos();
    });
  }

  async loadMorePhotos(): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    try {
      const newPhotos = await this.photosService.getPhotos();

      this.photos.update((photos) => [...photos, ...newPhotos]);
    } finally {
      this.loading.set(false);

      if (this.sentinelVisible) {
        void this.loadMorePhotos();
      }
    }
  }

  private observeInfiniteScroll(): void {
    const scrollContainer = this.scrollContainerRef()?.nativeElement;
    const sentinel = this.sentinelRef()?.nativeElement;

    if (!scrollContainer || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        this.sentinelVisible = entry.isIntersecting;

        if (entry.isIntersecting) {
          void this.loadMorePhotos();
        }
      },
      {
        root: scrollContainer,
        rootMargin: '300px',
      },
    );

    observer.observe(sentinel);

    this.destroyRef.onDestroy(() => {
      observer.disconnect();
    });
  }
}
