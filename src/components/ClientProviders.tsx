"use client";

import React, { useEffect } from "react";
import { LanguageProvider } from "./LanguageContext";
import AiPageTranslator from "./AiPageTranslator";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const isAbort =
        reason?.name === "AbortError" ||
        reason?.code === 20 ||
        (typeof reason === "string" && reason.toLowerCase().includes("aborted")) ||
        reason?.message?.toLowerCase().includes("aborted") ||
        reason?.name === "CanceledError";

      if (isAbort) {
        event.preventDefault();
        if (typeof event.stopImmediatePropagation === "function") {
          event.stopImmediatePropagation();
        }
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection, { capture: true });
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection, { capture: true });
    };
  }, []);

  return (
    <LanguageProvider>
      <AiPageTranslator />
      {children}
    </LanguageProvider>
  );
}
