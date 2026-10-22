<div align="center">

# Airbnb × NativeScript-Vue

### Find your next getaway. Take the native route.

An Airbnb-inspired mobile app built with **NativeScript-Vue** and **vue-router-ns**.<br />
Real native screens, independent tab stacks, and a stay that opens right out of its card.

[![NativeScript](https://img.shields.io/badge/NativeScript-65ADF1?style=for-the-badge&logo=nativescript&logoColor=white)](https://nativescript.org)
[![Vue](https://img.shields.io/badge/Vue-3-42B883?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://nativescript-vue.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![vue-router-ns](https://img.shields.io/badge/vue--router--ns-native_navigation-FF385C?style=for-the-badge)](https://github.com/rafaelaugustos/vue-router-ns)

**iOS & Android** · **Native UI** · **Vue 3 Composition API**

[The experience](#the-experience) · [Under the hood](#under-the-hood) · [Project status](#project-status) · [The router](https://github.com/rafaelaugustos/vue-router-ns)

</div>

---

> **Source release in preparation.** This repository currently contains the project README. The working prototype is being refined alongside `vue-router-ns`; app source, setup instructions, and previews will follow after the navigation improvements below.

## The idea

Build a small, polished slice of a familiar app and see how far a native Vue router can take it.

The scope is deliberately focused: discover a place, save it for later, open its details, and move between tabs without losing your place. Every navigation goes through [vue-router-ns](https://github.com/rafaelaugustos/vue-router-ns), with NativeScript rendering the platform's native views.

## The experience

**A place worth stopping for**

Browse a photo-led feed of fictional Brazilian stays. Switch between cabins, beach escapes, pools, and city stays, or narrow the list by destination and nightly budget.

**From a card to a getaway**

Tap a stay's photo and open its detail page with UIKit's native zoom on supported iOS 18+ runtimes. Go back and the page returns to its source card. A shared-image transition is configured as the fallback, including Android.

**Five tabs, room to explore**

Explore, Favorites, Trips, Messages, and Profile sit behind a native tab bar. Explore and Favorites can each keep their own detail stack. Trips, Messages, and Profile have simple placeholder screens in this first slice.

**Little interactions that work**

Save a favorite without opening the card. Keep it after restarting the app. Search in a native sheet, apply the result to the feed, or cancel without changing the current filters.

## Under the hood

| Experience                       | Powered by                                                 |
| -------------------------------- | ---------------------------------------------------------- |
| Native tab navigation            | `RouterTabs` + `RouterTab`                                 |
| Independent navigation stacks    | Named `RouterView` instances                               |
| Stay routes and parameters       | `createRouter`, `/stays/:id`, `props: true`                |
| Card-to-page zoom                | `RouterLink zoom` → `zoomFrom` → UIKit                     |
| Shared-image fallback            | NativeScript `SharedTransition`, passed through the router |
| Search sheet with a return value | `router.pushForResult()` + `router.back({ result })`       |
| Reactive UI and filters          | NativeScript-Vue Composition API                           |
| Favorites across app restarts    | NativeScript `ApplicationSettings`                         |

Photos and the icon font are bundled for offline use. The initial catalog is local sample data; there is no backend, authentication, payment flow, or real booking. The reservation action shows a demo summary.

## Project status

The prototype already exercises the core discovery and detail flow. Before publishing its source here, the next round focuses on three improvements in `vue-router-ns`:

- [ ] **Reliable tab reselection.** Investigate and fix the iOS 26 case where `backToRootOnReselect` resets a stack when switching tabs. The prototype currently leaves that option disabled to preserve history.
- [ ] **Consistent tab appearance.** Expose a public styling surface for colors and labels across UIKit and Android Material tabs. The prototype currently needs a small native Android styling adapter.
- [ ] **Tab bar visibility per page.** Add declarative control for hiding the bar on detail screens and restoring it correctly on back navigation, including cancelled interactive gestures.
- [ ] **Publish the app.** Bring in the source, runnable setup, screenshots, and recordings after integrating the router updates.

The iOS prototype flow has been exercised in a simulator. Android bundles and an APK have been built, and startup has been checked; full Android transition and gesture validation is still pending.

## Built to learn from

This app is also a practical test case for [vue-router-ns](https://github.com/rafaelaugustos/vue-router-ns): native navigation, platform differences, and the small details that become visible when a router powers an actual interface.

App ideas and feedback belong in [this repository's issues](https://github.com/rafaelaugustos/airbnb-nativescript-vue-router/issues). Router behavior and API discussions belong in [vue-router-ns issues](https://github.com/rafaelaugustos/vue-router-ns/issues).

---

<div align="center">

Built by [Rafael Augusto](https://github.com/rafaelaugustos) with [NativeScript-Vue](https://nativescript-vue.org) and [vue-router-ns](https://github.com/rafaelaugustos/vue-router-ns).

<sub>An independent learning project inspired by Airbnb. Not affiliated with or endorsed by Airbnb. Listings, hosts, prices, and reviews are fictional.</sub>

</div>
