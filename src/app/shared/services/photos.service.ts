import { Injectable } from '@angular/core';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private readonly baseUrl = 'https://picsum.photos/200/300';

  async getPhotos(count = 12): Promise<Photo[]> {
    await this.delay(this.getRandomDelay());

    return Array.from({ length: count }, () => this.createPhoto());
  }

  private createPhoto(): Photo {
    const id = crypto.randomUUID();

    return {
      id,
      url: `${this.baseUrl}?random=${id}`,
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
