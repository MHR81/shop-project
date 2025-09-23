// src/components/common/UpdatePrompt.jsx
import React, { useEffect, useState } from "react";

/**
 * UpdatePrompt listens for the "swUpdated" custom event (dispatched in index.js)
 * and shows a dismissible banner/toast. When user clicks Update it sends
 * { type: 'SKIP_WAITING' } to the waiting service-worker and listens for controllerchange
 * to reload the page.
 */
export default function UpdatePrompt() {
    const [registration, setRegistration] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function onSWUpdated(e) {
            setRegistration(e.detail);
            setVisible(true);
        }
        window.addEventListener("swUpdated", onSWUpdated);

        return () => {
            window.removeEventListener("swUpdated", onSWUpdated);
        };
    }, []);

    useEffect(() => {
        if (!registration) return;

        // When the new service worker takes control, reload
        const onControllerChange = () => {
            window.location.reload();
        };
        navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

        return () => {
            navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
        };
    }, [registration]);

    const doUpdate = () => {
        if (!registration || !registration.waiting) {
            // fallback: force reload
            window.location.reload();
            return;
        }
        // send message to service worker to skip waiting
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        // hide UI, waiting for controllerchange to reload
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className="update-prompt fixed-top d-flex justify-content-center align-items-center p-3"
            style={{ zIndex: 1080 }}
        >
            <div className="toast show align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        A new version of the app is available.
                    </div>
                    <button onClick={doUpdate} className="btn btn-outline-danger btn-sm me-2">
                        Update
                    </button>
                    <button onClick={() => setVisible(false)} className="btn btn-link btn-sm me-2">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
