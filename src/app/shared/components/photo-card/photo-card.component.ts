import { Component, input, output } from '@angular/core';
import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-photo-card',
  imports: [],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  readonly photo = input.required<Photo>();

  readonly photoClicked = output<Photo>();

  onPhotoClick(): void {
    this.photoClicked.emit(this.photo());
  }
}
