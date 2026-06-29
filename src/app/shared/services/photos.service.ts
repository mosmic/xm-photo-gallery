import { Injectable } from '@angular/core';

import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private readonly imageWidth = 200;
  private readonly imageHeight = 300;

  async getPhotos(count = 12): Promise<Photo[]> {
    await this.delay(this.getRandomDelay());

    return Array.from({ length: count }, () => this.createPhoto());
  }

  private createPhoto(): Photo {
    const id = crypto.randomUUID();

    return {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/300`,
      fullSizeUrl: `https://picsum.photos/seed/${id}/800/1200`,
    };
  }

  private getRandomDelay(): number {
    return Math.floor(Math.random() * 101) + 200;
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}
