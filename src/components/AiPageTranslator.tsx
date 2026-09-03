"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation, LanguageCode } from "./LanguageContext";

// Store original English text for text nodes
const originalTextMap = new WeakMap<Node, string>();
const translatedCache = new Map<string, string>();

// Tags that should NEVER be touched
const IGNORED_TAGS = new Set([
  "SCRIPT", "STYLE", "SVG", "PATH", "CODE", "PRE",
  "INPUT", "TEXTAREA", "SELECT", "NOSCRIPT", "CANVAS"
]);

export default function AiPageTranslator() {
  const { currentLang } = useTranslation();
  const observerRef = useRef<MutationObserver | null>(null);
  const queueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingNodes = useRef<Map<string, Node[]>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Read stored cache for this language
    try {
      const stored = localStorage.getItem(`mineguard_ai_tx_${currentLang}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([k, v]) => {
          translatedCache.set(`${currentLang}:${k}`, v as string);
        });
      }
    } catch { }

    const shouldBypass = (element: Element | null): boolean => {
      if (!element) return false;
      if (IGNORED_TAGS.has(element.tagName)) return true;
      if (element.hasAttribute("data-no-translate")) return true;
      if (element.classList?.contains("no-translate")) return true;
      if (element.closest("[data-no-translate='true']")) return true;
      if (element.closest(".no-translate")) return true;
      return false;
    };

    const flushQueue = async () => {
      if (pendingNodes.current.size === 0 || currentLang === "en") return;

      const keysToFetch: string[] = [];
      pendingNodes.current.forEach((nodes, text) => {
        const cacheKey = `${currentLang}:${text}`;
        if (!translatedCache.has(cacheKey)) {
          keysToFetch.push(text);
        }
      });

      if (keysToFetch.length > 0) {
        window.dispatchEvent(new CustomEvent("mineguard_ai_translating", {
          detail: { active: true, count: keysToFetch.length, lang: currentLang }
        }));

        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts: keysToFetch, targetLang: currentLang })
          });

          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.translated)) {
              const newEntries: Record<string, string> = {};
              keysToFetch.forEach((original, idx) => {
                const tx = data.translated[idx] || original;
                const cacheKey = `${currentLang}:${original}`;
                translatedCache.set(cacheKey, tx);
                newEntries[original] = tx;

                // Update text nodes
                const nodes = pendingNodes.current.get(original);
                if (nodes) {
                  nodes.forEach(node => {
                    if (node.isConnected) {
                      node.nodeValue = tx;
                    }
                  });
                }
              });

              // Persist to localStorage
              try {
                const existing = JSON.parse(localStorage.getItem(`mineguard_ai_tx_${currentLang}`) || "{}");
                localStorage.setItem(`mineguard_ai_tx_${currentLang}`, JSON.stringify({ ...existing, ...newEntries }));
              } catch { }
            }
          }
        } catch (err) {
          console.error("AI batch translation error:", err);
        } finally {
          window.dispatchEvent(new CustomEvent("mineguard_ai_translating", {
            detail: { active: false, count: 0, lang: currentLang }
          }));
        }
      }

      pendingNodes.current.clear();
    };

    const processTextNode = (node: Node) => {
      const parent = node.parentElement;
      if (shouldBypass(parent)) return;

      const currentVal = node.nodeValue;
      if (!currentVal) return;

      // If switched back to English, restore original
      if (currentLang === "en") {
        if (originalTextMap.has(node)) {
          node.nodeValue = originalTextMap.get(node)!;
        }
        return;
      }

      // Check if original English is already recorded
      let original = originalTextMap.get(node);
      if (!original) {
        const trimmed = currentVal.trim();
        // Skip pure numbers, symbols, single characters
        if (!trimmed || trimmed.length < 2 || /^[\d\s\W_]+$/.test(trimmed)) return;
        original = currentVal;
        originalTextMap.set(node, original);
      }

      const trimmedOriginal = original.trim();
      if (!trimmedOriginal) return;

      // Check cache
      const cacheKey = `${currentLang}:${trimmedOriginal}`;
      if (translatedCache.has(cacheKey)) {
        const translated = translatedCache.get(cacheKey)!;
        if (node.nodeValue !== translated) {
          node.nodeValue = translated;
        }
        return;
      }

      // Enqueue for AI translation
      const list = pendingNodes.current.get(trimmedOriginal) || [];
      list.push(node);
      pendingNodes.current.set(trimmedOriginal, list);

      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);
      queueTimeoutRef.current = setTimeout(flushQueue, 180);
    };

    const walkNode = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        processTextNode(root);
        return;
      }

      if (root.nodeType === Node.ELEMENT_NODE) {
        if (shouldBypass(root as Element)) return;
        for (let i = 0; i < root.childNodes.length; i++) {
          walkNode(root.childNodes[i]);
        }
      }
    };

    // Initial pass over the page
    walkNode(document.body);

    // Watch for dynamic DOM changes (route change, modals, tabs)
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => walkNode(n));
        } else if (m.type === "characterData") {
          // If node was modified by external script, verify
          const node = m.target;
          if (currentLang !== "en" && !originalTextMap.has(node)) {
            processTextNode(node);
          }
        }
      });
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);
    };
  }, [currentLang]);

  return null;
}
