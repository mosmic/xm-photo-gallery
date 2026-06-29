import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PhotoDetailsPageComponent } from './photo-details-page.component';
import { FavoritesStorageService } from '../../../../shared/services/favorites-storage.service';
import { Photo } from '../../../../shared/models/photo.model';

const photoMock: Photo = {
  id: '1',
  thumbnailUrl: 'https://picsum.photos/seed/1/200/300',
  fullSizeUrl: 'https://picsum.photos/seed/1/800/1200',
};

describe('PhotoDetailsPageComponent', () => {
  let fixture: ComponentFixture<PhotoDetailsPageComponent>;

  const favoritesSignal = signal<Photo[]>([photoMock]);

  const favoritesStorageServiceMock = {
    favorites: favoritesSignal.asReadonly(),
    findById: vi.fn((photoId: string) =>
      favoritesSignal().find((photo) => photo.id === photoId),
    ),
    remove: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    favoritesSignal.set([photoMock]);
    favoritesStorageServiceMock.findById.mockImplementation((photoId: string) =>
      favoritesSignal().find((photo) => photo.id === photoId),
    );
    favoritesStorageServiceMock.remove.mockReset();
    routerMock.navigate.mockReset();

    await TestBed.configureTestingModule({
      imports: [PhotoDetailsPageComponent],
      providers: [
        {
          provide: FavoritesStorageService,
          useValue: favoritesStorageServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue(photoMock.id),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailsPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the selected favorite photo', () => {
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector(
      '.photo-details-page__image',
    ) as HTMLImageElement;

    expect(image).not.toBeNull();
    expect(image.getAttribute('ng-reflect-ng-src') ?? image.src).toContain(
      photoMock.fullSizeUrl,
    );
  });

  it('should show the remove from favorites button', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      '.photo-details-page__remove-button',
    ) as HTMLButtonElement;

    expect(button).not.toBeNull();
    expect(button.textContent).toContain('Remove from favorites');
  });

  it('should remove the photo from favorites and navigate back to favorites', () => {
    fixture.detectChanges();

    fixture.componentInstance.removeFromFavorites();

    expect(favoritesStorageServiceMock.remove).toHaveBeenCalledWith(
      photoMock.id,
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/favorites']);
  });

  it('should show empty state when the photo is not found in favorites', async () => {
    await TestBed.resetTestingModule();

    const emptyFavoritesServiceMock = {
      favorites: signal<Photo[]>([]).asReadonly(),
      findById: vi.fn().mockReturnValue(undefined),
      remove: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PhotoDetailsPageComponent],
      providers: [
        {
          provide: FavoritesStorageService,
          useValue: emptyFavoritesServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue(photoMock.id),
              },
            },
          },
        },
      ],
    }).compileComponents();

    const emptyFixture = TestBed.createComponent(PhotoDetailsPageComponent);

    emptyFixture.detectChanges();

    const emptyState = emptyFixture.nativeElement.querySelector(
      '.photo-details-page__empty-state',
    );

    expect(emptyState).not.toBeNull();
    expect(emptyState.textContent).toContain('Photo not found');
  });
});
