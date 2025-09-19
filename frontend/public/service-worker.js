/* public/service-worker.js */
/* eslint-disable no-restricted-globals */

const CACHE_PREFIX = "shop-project-cache";
const CACHE_VERSION = "v1"; // در هر بار ریلیز جدید این مقدار رو افزایش بده (مثلاً v2)
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

const PRECACHE_URLS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/favicon.ico",
    "/logo192.png",
    "/logo512.png",
    // مراقب باش فایل‌های main.*.js در build تغییر می‌کنند — ما آن‌ها را در runtime cache می‌کنیم
];

// Install: precache files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
    );
    // منتظر پیام SKIP_WAITING می‌مانیم تا نهایتاً کاربر تصمیم بگیرد
    // اگر می‌خواهی به‌صورت فوری فعال شود، self.skipWaiting() را اینجا صدا بزن
});

// Activate: cleanup old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                    return Promise.resolve();
                })
            )
        )
    );
    // take control asap
    return self.clients.claim();
});

// Message from client (e.g. SKIP_WAITING)
self.addEventListener("message", (event) => {
    if (!event.data) return;
    if (event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

// Fetch strategy:
// - For navigation (document) -> network-first with cache fallback (so new HTML fetched when online)
// - For same-origin assets -> cache-first then network (fast UI, updates cached on fetch)
// - For cross-origin requests -> network-first fallback cache
self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Ignore non-GET
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Navigation requests (HTML)
    if (request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html")) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    // update cache with latest index.html
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, networkResponse.clone()).catch(() => { });
                    });
                    return networkResponse;
                })
                .catch(() => caches.match("/index.html"))
        );
        return;
    }

    // For same-origin assets -> try cache first
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) {
                    // Background update of the cache (stale-while-revalidate)
                    fetch(request)
                        .then((networkResponse) => {
                            caches.open(CACHE_NAME).then((cache) => {
                                if (networkResponse && networkResponse.status === 200) {
                                    cache.put(request, networkResponse.clone()).catch(() => { });
                                }
                            });
                        })
                        .catch(() => { });
                    return cached;
                }
                // if not cached, fetch and cache
                return fetch(request)
                    .then((networkResponse) => {
                        caches.open(CACHE_NAME).then((cache) => {
                            if (networkResponse && networkResponse.status === 200) {
                                cache.put(request, networkResponse.clone()).catch(() => { });
                            }
                        });
                        return networkResponse;
                    })
                    .catch(() => {
                        // fallback for images etc. (optional)
                        return caches.match("/index.html");
                    });
            })
        );
        return;
    }

    // Cross-origin -> network first fallback cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                return response;
            })
            .catch(() => caches.match(request))
    );
});
