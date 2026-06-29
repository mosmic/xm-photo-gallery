import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter, RouterOutlet } from '@angular/router';
import { describe, beforeEach, expect, it } from 'vitest';

import { HeaderComponent } from './header.component';

@Component({
  template: `
    <app-header />
    <router-outlet />
  `,
  imports: [HeaderComponent, RouterOutlet],
})
class TestHostComponent {}

@Component({
  template: '<p>Photos page</p>',
})
class PhotosStubComponent {}

@Component({
  template: '<p>Favorites page</p>',
})
class FavoritesStubComponent {}

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([
          {
            path: 'photos',
            component: PhotosStubComponent,
          },
          {
            path: 'favorites',
            component: FavoritesStubComponent,
          },
          {
            path: '',
            redirectTo: 'photos',
            pathMatch: 'full',
          },
        ]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HeaderComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render two navigation links', () => {
    const fixture = TestBed.createComponent(HeaderComponent);

    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a');

    expect(links.length).toBe(2);
  });

  it('should render a Photos link', () => {
    const fixture = TestBed.createComponent(HeaderComponent);

    fixture.detectChanges();

    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a'),
    ) as HTMLAnchorElement[];

    const photosLink = links.find(
      (link) => link.textContent?.trim() === 'Photos',
    );

    expect(photosLink).toBeTruthy();
    expect(photosLink?.getAttribute('href')).toBe('/');
  });

  it('should render a Favorites link', () => {
    const fixture = TestBed.createComponent(HeaderComponent);

    fixture.detectChanges();

    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a'),
    ) as HTMLAnchorElement[];

    const favoritesLink = links.find(
      (link) => link.textContent?.trim() === 'Favorites',
    );

    expect(favoritesLink).toBeTruthy();
    expect(favoritesLink?.getAttribute('href')).toBe('/favorites');
  });

  it('should navigate to photos when clicking the Photos link', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const router = TestBed.inject(Router);

    fixture.detectChanges();
    await fixture.whenStable();

    const photosLink = Array.from(
      fixture.nativeElement.querySelectorAll('a'),
    ).find(
      (link): link is HTMLAnchorElement =>
        link instanceof HTMLAnchorElement &&
        link.textContent?.trim() === 'Photos',
    );

    photosLink?.click();

    await fixture.whenStable();

    expect(router.url).toBe('/photos');
  });

  it('should navigate to favorites when clicking the Favorites link', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const router = TestBed.inject(Router);

    fixture.detectChanges();
    await fixture.whenStable();

    const favoritesLink = Array.from(
      fixture.nativeElement.querySelectorAll('a'),
    ).find(
      (link): link is HTMLAnchorElement =>
        link instanceof HTMLAnchorElement &&
        link.textContent?.trim() === 'Favorites',
    );

    favoritesLink?.click();

    await fixture.whenStable();

    expect(router.url).toBe('/favorites');
  });

  it('should highlight Photos when the active route is /photos', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/photos');

    fixture.detectChanges();
    await fixture.whenStable();

    const photosLink = Array.from(
      fixture.nativeElement.querySelectorAll('a'),
    ).find(
      (link): link is HTMLAnchorElement =>
        link instanceof HTMLAnchorElement &&
        link.textContent?.trim() === 'Photos',
    );

    expect(photosLink?.classList.contains('app-header__link--active')).toBe(
      true,
    );
  });

  it('should highlight Favorites when the active route is /favorites', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/favorites');

    fixture.detectChanges();
    await fixture.whenStable();

    const favoritesLink = Array.from(
      fixture.nativeElement.querySelectorAll('a'),
    ).find(
      (link): link is HTMLAnchorElement =>
        link instanceof HTMLAnchorElement &&
        link.textContent?.trim() === 'Favorites',
    );

    expect(favoritesLink?.classList.contains('app-header__link--active')).toBe(
      true,
    );
  });
});
