// src/serviceWorkerRegistration.js
const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(window.location.hostname)
);

export function register(config) {
    if ("serviceWorker" in navigator) {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

        if (isLocalhost) {
            // Check if a service worker still exists or has been removed
            checkValidServiceWorker(swUrl, config);
            navigator.serviceWorker.ready.then(() => {
                console.log("Service Worker ready (localhost).");
            });
        } else {
            registerValidSW(swUrl, config);
        }
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            // when an update is found
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (!installingWorker) return;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === "installed") {
                        // if there's an existing controller, then new update is available
                        if (navigator.serviceWorker.controller) {
                            console.log("New content is available; please refresh.");

                            // call onUpdate callback
                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            console.log("Content cached for offline use.");
                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch((error) => {
            console.error("Error during service worker registration:", error);
        });
}

function checkValidServiceWorker(swUrl, config) {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl, { headers: { "Service-Worker": "script" } })
        .then((response) => {
            const contentType = response.headers.get("content-type");
            if (response.status === 404 || (contentType && contentType.indexOf("javascript") === -1)) {
                // No service worker found. Probably a different app. Unregister.
                navigator.serviceWorker.ready.then((registration) => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                // Service worker found. Proceed as normal.
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log("No internet connection found. App is running in offline mode.");
        });
}

export function unregister() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => registration.unregister())
            .catch((error) => console.error(error));
    }
}
