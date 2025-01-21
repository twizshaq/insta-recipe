"use client";
import { useEffect } from "react";
import { app } from "../../firebase";

export default function AnalyticsLoader() {
    useEffect(() => {
        // Only load firebase/analytics in the browser
        import("firebase/analytics").then(({ isSupported, getAnalytics }) => {
        isSupported().then((yes) => {
            if (yes) {
            getAnalytics(app);
            console.log("Analytics initialized");
            }
        });
        });
    }, []);

    return null;
}