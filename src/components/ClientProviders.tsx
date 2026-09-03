"use client";

import React from "react";
import { LanguageProvider } from "./LanguageContext";
import AiPageTranslator from "./AiPageTranslator";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AiPageTranslator />
      {children}
    </LanguageProvider>
  );
}
