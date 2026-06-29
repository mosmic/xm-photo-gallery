import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PhotosPageComponent } from './photos-page.component';
import { PhotosService } from '../../../../shared/services/photos.service';
import { Photo } from '../../../../shared/models/photo.model';

const photosMock: Photo[] = [
  {
    id: '1',
    url: 'https://picsum.photos/200/300?random=1',
  },
  {
    id: '2',
    url: 'https://picsum.photos/200/300?random=2',
  },
];

const morePhotosMock: Photo[] = [
  {
    id: '3',
    url: 'https://picsum.photos/200/300?random=3',
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
      <img [src]="photo().url" [alt]="'Photo ' + photo().id" />
    </button>
  `,
})
class PhotoCardStubComponent {
  photo = input.required<Photo>();
  photoClicked = output<Photo>();
}

@Component({
  selector: 'app-infinite-scroll-trigger',
  template: `
    <button
      type="button"
      class="infinite-scroll-trigger"
      (click)="loadMore.emit()"
    >
      Load more
    </button>
  `,
})
class InfiniteScrollTriggerStubComponent {
  loadMore = output<void>();
}

describe('PhotosPageComponent', () => {
  let fixture: ComponentFixture<PhotosPageComponent>;

  const photosServiceMock = {
    getPhotos: vi.fn(),
  };

  const favoritesStorageServiceMock = {
    add: vi.fn(),
  };

  beforeEach(async () => {
    photosServiceMock.getPhotos.mockReset();
    favoritesStorageServiceMock.add.mockReset();

    photosServiceMock.getPhotos.mockResolvedValue(photosMock);

    await TestBed.configureTestingModule({
      imports: [PhotosPageComponent],
      providers: [
        {
          provide: PhotosService,
          useValue: photosServiceMock,
        },
        // {
        //   provide: FavoritesStorageService,
        //   useValue: favoritesStorageServiceMock,
        // },
      ],
    })
      .overrideComponent(PhotosPageComponent, {
        remove: {
          imports: [],
        },
        add: {
          imports: [PhotoCardStubComponent, InfiniteScrollTriggerStubComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PhotosPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load initial photos when the page is initialized', async () => {
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(photosServiceMock.getPhotos).toHaveBeenCalledTimes(1);
  });

  it('should display a loader while photos are loading', () => {
    photosServiceMock.getPhotos.mockReturnValue(new Promise(() => {}));

    fixture.detectChanges();

    const loader = fixture.nativeElement.querySelector(
      '[data-testid="photos-loader"]',
    );

    expect(loader).not.toBeNull();
  });

  it('should render loaded photos', async () => {
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const photoCards = fixture.nativeElement.querySelectorAll('app-photo-card');

    expect(photoCards.length).toBe(2);
  });

  it('should add a photo to favorites when clicking a photo', async () => {
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const firstPhotoCard = fixture.debugElement.queryAll(
      By.directive(PhotoCardStubComponent),
    )[0];

    firstPhotoCard.triggerEventHandler('photoClicked', photosMock[0]);

    expect(favoritesStorageServiceMock.add).toHaveBeenCalledWith(photosMock[0]);
  });

  it('should load more photos when infinite scroll is triggered', async () => {
    photosServiceMock.getPhotos
      .mockResolvedValueOnce(photosMock)
      .mockResolvedValueOnce(morePhotosMock);

    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const infiniteScrollTrigger = fixture.debugElement.query(
      By.directive(InfiniteScrollTriggerStubComponent),
    );

    infiniteScrollTrigger.triggerEventHandler('loadMore');

    await fixture.whenStable();
    fixture.detectChanges();

    expect(photosServiceMock.getPhotos).toHaveBeenCalledTimes(2);

    const photoCards = fixture.nativeElement.querySelectorAll('app-photo-card');

    expect(photoCards.length).toBe(3);
  });

  it('should show loader while loading more photos', async () => {
    photosServiceMock.getPhotos
      .mockResolvedValueOnce(photosMock)
      .mockReturnValueOnce(new Promise(() => {}));

    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const infiniteScrollTrigger = fixture.debugElement.query(
      By.directive(InfiniteScrollTriggerStubComponent),
    );

    infiniteScrollTrigger.triggerEventHandler('loadMore');

    fixture.detectChanges();

    const loader = fixture.nativeElement.querySelector(
      '[data-testid="photos-loader"]',
    );

    expect(loader).not.toBeNull();
  });
});
