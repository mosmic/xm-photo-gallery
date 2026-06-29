import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PhotosService } from './photos.service';

describe('PhotosService', () => {
  let service: PhotosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotosService],
    });

    service = TestBed.inject(PhotosService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return the requested number of photos', async () => {
    const photos = await service.getPhotos(5);

    expect(photos.length).toBe(5);
  });

  it('should create photos with ids', async () => {
    const photos = await service.getPhotos(3);

    expect(photos.every((photo) => Boolean(photo.id))).toBe(true);
  });

  it('should use picsum photo urls', async () => {
    const photos = await service.getPhotos(3);

    expect(
      photos.every((photo) =>
        photo.url.startsWith('https://picsum.photos/200/300'),
      ),
    ).toBe(true);
  });

  it('should create unique random image urls', async () => {
    const photos = await service.getPhotos(5);

    const urls = photos.map((photo) => photo.url);
    const uniqueUrls = new Set(urls);

    expect(uniqueUrls.size).toBe(5);
  });

  it('should delay loading by at least 200ms', async () => {
    vi.useFakeTimers();

    vi.spyOn(Math, 'random').mockReturnValue(0);

    const photosPromise = service.getPhotos(3);

    let resolved = false;

    photosPromise.then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(199);

    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);

    expect(await photosPromise).toHaveLength(3);
  });

  it('should delay loading by no more than 300ms', async () => {
    vi.useFakeTimers();

    vi.spyOn(Math, 'random').mockReturnValue(0.999999);

    const photosPromise = service.getPhotos(3);

    await vi.advanceTimersByTimeAsync(300);

    expect(await photosPromise).toHaveLength(3);
  });

  it('should use 12 photos as the default count', async () => {
    const photos = await service.getPhotos();

    expect(photos.length).toBe(12);
  });
});
