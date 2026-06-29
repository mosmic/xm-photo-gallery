# Gallery Template

Gallery Template is a small Angular photo gallery application built around three core flows:

- a random photostream with infinite scrolling;
- a favorites library persisted in the browser;
- a single-photo details page for favorited photos.

The project uses the latest Angular setup available in this workspace, standalone components, Angular Router, Angular Material, SCSS, and Vitest-based unit tests.

## Features

### Random photostream

The home page is available at `/` and displays a grid of photos. New photos are loaded as the user reaches the end of the list.

The infinite scroll implementation uses a custom `IntersectionObserver` sentinel instead of a third-party infinite-scroll library. This keeps the implementation dependency-free and avoids running logic on every scroll event.

### Favorites

Clicking a photo on the photostream adds it to favorites. Favorites are stored in `localStorage`, so they survive browser refreshes without requiring a backend server.

A Material snackbar confirms successful add and remove actions.

### Photo details

The details page is available at `/photos/:id`. It displays the selected favorite as a larger single image and includes a `Remove from favorites` button.

The header stays visible across all pages because it lives in the root app shell outside the routed page outlet.

## Routes

| Route         | Page               | Purpose                         |
| ------------- | ------------------ | ------------------------------- |
| `/`           | Photos page        | Random infinite photostream     |
| `/favorites`  | Favorites page     | Saved favorite photos           |
| `/photos/:id` | Photo details page | Single full-size favorite photo |

## Technology choices

### Angular standalone architecture

The app uses standalone components and route-level lazy loading. This keeps the app lightweight and avoids unnecessary NgModule boilerplate while still using Angular Router as required.

### Feature-first folder structure

The code is organized by application feature instead of by technical type only:

```text
src/app/
  features/
    photos/
      pages/photos-page/
    favorites/
      pages/favorites-page/
    photo-details/
      pages/photo-details-page/

  shared/
    components/
      header/
      photo-card/
      photo-card-skeleton/
    models/
    services/
```

This structure keeps route-specific pages close to their feature while placing reusable UI and shared state services under `shared`.

### Custom infinite scroll

The photos page uses an `IntersectionObserver` with a sentinel element at the bottom of the page. When the sentinel enters the scroll container viewport, the next batch of photos is requested.

This was chosen over scroll event listeners because it is more efficient and easier to reason about. The browser handles intersection detection, and the app only reacts when the sentinel becomes visible.

### Local browser persistence

Favorites are persisted with `localStorage` through `FavoritesStorageService`. Components do not access `localStorage` directly. This keeps persistence logic centralized and makes the components easier to test.

### Picsum seeded images

The app uses Picsum seed URLs:

```text
https://picsum.photos/seed/{id}/200/300
https://picsum.photos/seed/{id}/800/1200
```

The seed keeps the image stable across refreshes. The thumbnail URL is used in grids, while the full-size URL is used on the details page.

### Image performance

`NgOptimizedImage` is used for photo rendering. Images define explicit dimensions to reduce layout shift:

- thumbnails: `200x300`;
- details image: `800x1200`.

The first few photos in the grid are marked as priority because they are likely to be above the fold and can become LCP candidates. The rest are left non-priority.

### Loading feedback

The app uses two loading patterns:

- a `mat-spinner` for API batch loading;
- an internal photo-card skeleton while each image is still loading.

This separates network loading state from individual image loading state.

### Angular Material

Angular Material is used for the header toolbar, buttons, snackbar, and spinner. Material animations are provided in `app.config.ts`.

## Running locally

### Prerequisites

Use a Node.js version supported by Angular 22. Recommended:

```bash
nvm install 24
nvm use 24
```

Then install dependencies:

```bash
npm install
```

### Start the development server

```bash
npm start
```

Open:

```text
http://localhost:4200
```

### Run unit tests

```bash
npm test
```

This project is configured to run Angular unit tests with Vitest.

### Build

```bash
npm run build
```

The production build output is written to `dist/gallery-template`.

## Testing strategy

The project includes unit tests for:

- app shell rendering;
- header navigation and active state;
- photo loading service behavior, including the artificial 200-300ms delay;
- photo card rendering, events, image loading skeleton, and accessibility basics;
- infinite-scroll page behavior;
- favorites persistence and snackbar feedback;
- favorites page empty/content states and navigation;
- photo details display and remove behavior.

The tests use stubs where appropriate so that page tests focus on page behavior instead of child component internals.

## Notes for reviewers

The implementation intentionally avoids a backend server. All retained state is stored in the browser through `localStorage`.

The infinite scroll is implemented manually with `IntersectionObserver`, satisfying the requirement to avoid infinite-scroll libraries.

The app favors small reusable components: `PhotoCardComponent` is intentionally dumb and emits events. Pages decide whether a click means “add to favorites” or “open details”. This makes the card reusable across the photostream and favorites pages.
