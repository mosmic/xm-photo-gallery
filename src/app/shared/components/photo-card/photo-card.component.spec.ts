import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PhotoCardComponent } from './photo-card.component';
import { Photo } from '../../models/photo.model';
import { PhotoCardSkeletonComponent } from '../photo-card-skeleton/photo-card-skeleton.component';

describe('PhotoCardComponent', () => {
  let fixture: ComponentFixture<PhotoCardComponent>;

  const photoMock: Photo = {
    id: 'photo-1',
    url: 'https://picsum.photos/200/300?random=photo-1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCardComponent);
    fixture.componentRef.setInput('photo', photoMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the photo image', () => {
    const image = fixture.nativeElement.querySelector(
      'img',
    ) as HTMLImageElement;

    expect(image).not.toBeNull();
    expect(image.src).toContain(photoMock.url);
    expect(image.getAttribute('width')).toBe('200');
    expect(image.getAttribute('height')).toBe('300');
  });

  it('should use the photo id as image alt text', () => {
    const image = fixture.nativeElement.querySelector(
      'img',
    ) as HTMLImageElement;

    expect(image.alt).toBe('Photo photo-1');
  });

  it('should emit photoClicked when the card is clicked', () => {
    const emitSpy = vi.spyOn(fixture.componentInstance.photoClicked, 'emit');

    const card = fixture.debugElement.query(By.css('button'));

    card.triggerEventHandler('click');

    expect(emitSpy).toHaveBeenCalledWith(photoMock);
  });

  it('should be rendered as a button for accessibility', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button).not.toBeNull();
    expect(button.getAttribute('type')).toBe('button');
  });

  it('should show the skeleton before the image loads', () => {
    const skeleton = fixture.debugElement.query(
      By.directive(PhotoCardSkeletonComponent),
    );
    const image = fixture.nativeElement.querySelector(
      'img',
    ) as HTMLImageElement;

    expect(skeleton).not.toBeNull();
    expect(image.classList.contains('photo-card__image--loaded')).toBe(false);
  });

  it('should hide the skeleton after the image loads', () => {
    const image = fixture.debugElement.query(By.css('img'));

    image.triggerEventHandler('load');
    fixture.detectChanges();

    const skeleton = fixture.debugElement.query(
      By.directive(PhotoCardSkeletonComponent),
    );
    const imageElement = image.nativeElement as HTMLImageElement;

    expect(skeleton).toBeNull();
    expect(fixture.componentInstance.imageLoaded()).toBe(true);
    expect(imageElement.classList.contains('photo-card__image--loaded')).toBe(
      true,
    );
  });
});
