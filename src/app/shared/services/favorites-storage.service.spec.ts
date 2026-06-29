import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FavoritesStorageService } from './favorites-storage.service';
import { Photo } from '../models/photo.model';

const photoMock: Photo = {
  id: '1',
  thumbnailUrl: 'https://picsum.photos/seed/1/200/300',
  fullSizeUrl: 'https://picsum.photos/seed/1/800/1200',
};

const secondPhotoMock: Photo = {
  id: '2',
  thumbnailUrl: 'https://picsum.photos/seed/2/200/300',
  fullSizeUrl: 'https://picsum.photos/seed/2/800/1200',
};

describe('FavoritesStorageService', () => {
  let service: FavoritesStorageService;

  const snackBarMock = {
    open: vi.fn(),
  };

  beforeEach(() => {
    localStorage.clear();
    snackBarMock.open.mockReset();

    TestBed.configureTestingModule({
      providers: [
        FavoritesStorageService,
        {
          provide: MatSnackBar,
          useValue: snackBarMock,
        },
      ],
    });

    service = TestBed.inject(FavoritesStorageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty favorites list when localStorage is empty', () => {
    expect(service.favorites()).toEqual([]);
  });

  it('should add a photo to favorites', () => {
    service.add(photoMock);

    expect(service.favorites()).toEqual([photoMock]);
  });

  it('should persist favorites to localStorage', () => {
    service.add(photoMock);

    const storedFavorites = JSON.parse(
      localStorage.getItem('favorite_photos') ?? '[]',
    ) as Photo[];

    expect(storedFavorites).toEqual([photoMock]);
  });

  it('should load favorites from localStorage', () => {
    TestBed.resetTestingModule();

    localStorage.setItem('favorite_photos', JSON.stringify([photoMock]));

    TestBed.configureTestingModule({
      providers: [
        FavoritesStorageService,
        {
          provide: MatSnackBar,
          useValue: snackBarMock,
        },
      ],
    });

    const newService = TestBed.inject(FavoritesStorageService);

    expect(newService.favorites()).toEqual([photoMock]);
  });

  it('should prevent duplicate favorites', () => {
    service.add(photoMock);
    service.add(photoMock);

    expect(service.favorites()).toEqual([photoMock]);
  });

  it('should not show snackbar when adding a duplicate favorite', () => {
    service.add(photoMock);
    snackBarMock.open.mockReset();

    service.add(photoMock);

    expect(snackBarMock.open).not.toHaveBeenCalled();
  });

  it('should show snackbar when a photo is added successfully', () => {
    service.add(photoMock);

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Photo added to favorites',
      'Close',
      {
        duration: 2500,
      },
    );
  });

  it('should remove a photo from favorites', () => {
    service.add(photoMock);
    service.add(secondPhotoMock);

    service.remove(photoMock.id);

    expect(service.favorites()).toEqual([secondPhotoMock]);
  });

  it('should persist removed favorites to localStorage', () => {
    service.add(photoMock);
    service.add(secondPhotoMock);

    service.remove(photoMock.id);

    const storedFavorites = JSON.parse(
      localStorage.getItem('favorite_photos') ?? '[]',
    ) as Photo[];

    expect(storedFavorites).toEqual([secondPhotoMock]);
  });

  it('should show snackbar when a photo is removed successfully', () => {
    service.add(photoMock);
    snackBarMock.open.mockReset();

    service.remove(photoMock.id);

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Photo removed from favorites',
      'Close',
      {
        duration: 2500,
      },
    );
  });

  it('should not show snackbar when removing a non-existing photo', () => {
    service.remove(photoMock.id);

    expect(snackBarMock.open).not.toHaveBeenCalled();
  });

  it('should return true when a photo is favorite', () => {
    service.add(photoMock);

    expect(service.isFavorite(photoMock.id)).toBe(true);
  });

  it('should return false when a photo is not favorite', () => {
    expect(service.isFavorite(photoMock.id)).toBe(false);
  });
});
