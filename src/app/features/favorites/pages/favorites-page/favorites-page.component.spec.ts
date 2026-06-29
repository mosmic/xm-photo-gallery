import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FavoritesPageComponent } from './favorites-page.component';
import { Photo } from '../../../../shared/models/photo.model';
import { FavoritesStorageService } from '../../../../shared/services/favorites-storage.service';
import { PhotoCardComponent } from '../../../../shared/components/photo-card/photo-card.component';
import { By } from '@angular/platform-browser';

const favoritePhotosMock: Photo[] = [
  {
    id: '1',
    thumbnailUrl: 'https://picsum.photos/seed/1/200/300',
    fullSizeUrl: 'https://picsum.photos/seed/1/800/1200',
  },
  {
    id: '2',
    thumbnailUrl: 'https://picsum.photos/seed/2/200/300',
    fullSizeUrl: 'https://picsum.photos/seed/2/800/1200',
  },
];

@Component({
  selector: 'app-photo-card',
  template: `
    <button
      type="button"
      class="photo-card"
      (click)="photoClicked.emit(photo())"
    >
      {{ photo().id }}
    </button>
  `,
})
class PhotoCardStubComponent {
  photo = input.required<Photo>();
  priority = input(false);

  photoClicked = output<Photo>();
}

describe('FavoritesPageComponent', () => {
  let fixture: ComponentFixture<FavoritesPageComponent>;

  const favoritesSignal = signal<Photo[]>([]);

  const favoritesStorageServiceMock = {
    favorites: favoritesSignal.asReadonly(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    favoritesSignal.set([]);
    routerMock.navigate.mockReset();

    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent],
      providers: [
        {
          provide: FavoritesStorageService,
          useValue: favoritesStorageServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    })
      .overrideComponent(FavoritesPageComponent, {
        remove: {
          imports: [PhotoCardComponent],
        },
        add: {
          imports: [PhotoCardStubComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FavoritesPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show an empty state when there are no favorite photos', () => {
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector(
      '[data-testid="favorites-empty-state"]',
    );

    expect(emptyState).not.toBeNull();
    expect(emptyState.textContent).toContain('No favorites yet');
  });

  it('should render favorite photos', () => {
    favoritesSignal.set(favoritePhotosMock);

    fixture.detectChanges();

    const photoCards = fixture.nativeElement.querySelectorAll('app-photo-card');

    expect(photoCards.length).toBe(2);
  });

  it('should not show the empty state when there are favorite photos', () => {
    favoritesSignal.set(favoritePhotosMock);

    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector(
      '[data-testid="favorites-empty-state"]',
    );

    expect(emptyState).toBeNull();
  });

  it('should navigate to photo details when clicking a favorite photo', () => {
    favoritesSignal.set(favoritePhotosMock);

    fixture.detectChanges();

    const photoCards = fixture.debugElement.queryAll(
      By.directive(PhotoCardStubComponent),
    );

    expect(photoCards.length).toBe(2);

    photoCards[0].triggerEventHandler('photoClicked', favoritePhotosMock[0]);

    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/photos',
      favoritePhotosMock[0].id,
    ]);
  });
});
