import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PhotoCardComponent } from './photo-card.component';
import { Photo } from '../../models/photo.model';

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
});
