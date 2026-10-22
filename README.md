<div align="center">

# Airbnb × NativeScript-Vue

An Airbnb clone built with NativeScript-Vue and [vue-router-ns](https://github.com/rafaelaugustos/vue-router-ns).

[![NativeScript](https://img.shields.io/badge/NativeScript-65ADF1?style=for-the-badge&logo=nativescript&logoColor=white)](https://nativescript.org)
[![Vue](https://img.shields.io/badge/Vue-3-42B883?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://nativescript-vue.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![vue-router-ns](https://img.shields.io/badge/vue--router--ns-native_navigation-FF385C?style=for-the-badge)](https://github.com/rafaelaugustos/vue-router-ns)

</div>

I'm using this app to test my router, [vue-router-ns](https://github.com/rafaelaugustos/vue-router-ns), in something more involved than a navigation demo. The scope is the home feed, tabs, favorites, search, and listing details. All screens use native views, and all navigation goes through the router.

**Only the README is published for now.** The prototype is working locally. I'll publish the code and setup instructions after addressing the router issues listed below.

## What's implemented

- Home feed with photos, categories, and destination/price filters.
- Five native tabs: Explore, Favorites, Trips, Messages, and Profile. The last three are placeholders for now.
- Separate navigation stacks for Explore and Favorites.
- Listing details with photos, host information, amenities, and a fixed reservation bar.
- Native card-to-page zoom on supported iOS 18+ runtimes, with a shared-image transition configured as the fallback, including Android.
- A search sheet that returns filters to the feed. Cancelling keeps the previous filters.
- Favorites saved locally across app restarts.

The UI is in Brazilian Portuguese. Listings are fictional, photos and icons are bundled, and there's no backend. The reservation button shows a demo summary.

## How it uses vue-router-ns

| Part                     | API                                                        |
| ------------------------ | ---------------------------------------------------------- |
| Tab bar                  | `RouterTabs` + `RouterTab`                                 |
| Navigation stack per tab | Named `RouterView` instances                               |
| Listing details          | `/stays/:id` with `props: true`                            |
| Zoom from the card       | `RouterLink zoom` / `zoomFrom`                             |
| Shared-image fallback    | NativeScript `SharedTransition`, passed through the router |
| Search sheet             | `router.pushForResult()`                                   |
| Return search filters    | `router.back({ result })`                                  |

Vue handles the UI state and filters. NativeScript's `ApplicationSettings` stores favorites.

## Before publishing the code

Building the app exposed a few things to fix or add in the router:

- [ ] Investigate `backToRootOnReselect` on iOS 26. Switching between Explore and Favorites with details open returned Explore to its root in the tested flow. Disabling the option preserved both stacks.
- [ ] Add consistent tab styling across platforms. The Android Material bar currently needs native code to set colors and label visibility.
- [ ] Add per-page tab bar visibility, including restoration after back navigation or a cancelled gesture. The bar currently stays visible on detail pages.
- [ ] Integrate those changes, test again, and publish the app with setup instructions and recordings.

The main flow has been tested in an iOS simulator. The Android APK builds and opens; transitions and back gestures still need a full pass on Android.

Found a router issue? Track it in [vue-router-ns](https://github.com/rafaelaugustos/vue-router-ns/issues). App-specific feedback can go [here](https://github.com/rafaelaugustos/airbnb-nativescript-vue-router/issues).

---

By [Rafael Augusto](https://github.com/rafaelaugustos). Independent project, not affiliated with Airbnb.
