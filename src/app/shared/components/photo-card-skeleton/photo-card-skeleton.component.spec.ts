import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCardSkeletonComponent } from './photo-card-skeleton.component';

describe('PhotoCardSkeletonComponent', () => {
  let component: PhotoCardSkeletonComponent;
  let fixture: ComponentFixture<PhotoCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCardSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoCardSkeletonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
