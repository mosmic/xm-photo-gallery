import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PhotosPageComponent } from './photos-page.component';
import { PhotosService } from '../../../../shared/services/photos.service';
import { Photo } from '../../../../shared/models/photo.model';
import { PhotoCardComponent } from '../../../../shared/components/photo-card/photo-card.component';

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
  priority = input(false);
  photoClicked = output<Photo>();
}

describe('PhotosPageComponent', () => {
  let fixture: ComponentFixture<PhotosPageComponent>;
  let intersectionObserverCallback: IntersectionObserverCallback;
  let observeMock: ReturnType<typeof vi.fn<(target: Element) => void>>;
  let disconnectMock: ReturnType<typeof vi.fn<() => void>>;

  const photosServiceMock = {
    getPhotos: vi.fn(),
  };

  beforeEach(async () => {
    intersectionObserverCallback = vi.fn();
    observeMock = vi.fn<(target: Element) => void>();
    disconnectMock = vi.fn<() => void>();

    class IntersectionObserverMock implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = '300px';
      readonly scrollMargin = '0px';
      readonly thresholds = [];

      constructor(callback: IntersectionObserverCallback) {
        intersectionObserverCallback = callback;
      }

      disconnect(): void {
        disconnectMock();
      }

      observe(target: Element): void {
        observeMock(target);
      }

      takeRecords = (): IntersectionObserverEntry[] => [];

      unobserve(): void {}
    }

    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    photosServiceMock.getPhotos.mockReset();

    photosServiceMock.getPhotos.mockResolvedValue(photosMock);

    await TestBed.configureTestingModule({
      imports: [PhotosPageComponent],
      providers: [
        {
          provide: PhotosService,
          useValue: photosServiceMock,
        },
      ],
    })
      .overrideComponent(PhotosPageComponent, {
        remove: {
          imports: [PhotoCardComponent],
        },
        add: {
          imports: [PhotoCardStubComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PhotosPageComponent);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load initial photos when the page is initialized', async () => {
    fixture.detectChanges();

    await fixture.whenStable();
    await vi.waitFor(() => expect(observeMock).toHaveBeenCalled());
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
    await vi.waitFor(() => expect(observeMock).toHaveBeenCalled());
    fixture.detectChanges();

    const photoCards = fixture.nativeElement.querySelectorAll('app-photo-card');

    expect(photoCards.length).toBe(2);
  });

  it('should observe the sentinel after initial photos load', async () => {
    fixture.detectChanges();

    await fixture.whenStable();
    await vi.waitFor(() => expect(observeMock).toHaveBeenCalled());

    const sentinel = fixture.nativeElement.querySelector(
      '[data-testid="photos-sentinel"]',
    );

    expect(observeMock).toHaveBeenCalledWith(sentinel);
  });

  it('should load more photos', async () => {
    photosServiceMock.getPhotos
      .mockResolvedValueOnce(photosMock)
      .mockResolvedValueOnce(morePhotosMock);

    fixture.detectChanges();

    await fixture.whenStable();
    await vi.waitFor(() => expect(observeMock).toHaveBeenCalled());
    fixture.detectChanges();

    await fixture.componentInstance.loadMorePhotos();
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
    await vi.waitFor(() => expect(observeMock).toHaveBeenCalled());
    fixture.detectChanges();

    void fixture.componentInstance.loadMorePhotos();

    fixture.detectChanges();

    const loader = fixture.nativeElement.querySelector(
      '[data-testid="photos-loader"]',
    );

    expect(loader).not.toBeNull();
  });
});
