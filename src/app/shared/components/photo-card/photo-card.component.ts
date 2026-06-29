import { Component, input, output, signal } from '@angular/core';
import { Photo } from '../../models/photo.model';
import { NgOptimizedImage } from '@angular/common';
import { PhotoCardSkeletonComponent } from '../photo-card-skeleton/photo-card-skeleton.component';

@Component({
  selector: 'app-photo-card',
  imports: [NgOptimizedImage, PhotoCardSkeletonComponent],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  readonly photo = input.required<Photo>();
  readonly priority = input(false);

  readonly photoClicked = output<Photo>();

  readonly imageLoaded = signal(false);

  onPhotoClick(): void {
    this.photoClicked.emit(this.photo());
  }

  onImageLoad(): void {
    this.imageLoaded.set(true);
  }
}
