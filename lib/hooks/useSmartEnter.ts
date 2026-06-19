"use client";

import { useEffect, useCallback } from "react";

/**
 * Hook to implement smart Enter-key navigation across the application.
 */
export const useSmartEnterNavigation = () => {
  const getFocusableElements = (container: HTMLElement) => {
    const selectors = [
      'input:not([disabled]):not([type="hidden"]):not([readonly])',
      'textarea:not([disabled]):not([readonly])',
      'select:not([disabled]):not([readonly])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]:not([disabled])'
    ].join(',');

    const allFocusable = Array.from(container.querySelectorAll(selectors)) as HTMLElement[];
    
    // Filter visible and interactive elements
    return allFocusable.filter(el => {
      // Basic visibility check
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      if (el.offsetWidth === 0 || el.offsetHeight === 0) return false;
      
      // Additional check for area-hidden or inert
      if (el.closest('[aria-hidden="true"]') || el.closest('[inert]')) return false;

      return true;
    });
  };

  const findPrimaryAction = (container: HTMLElement) => {
    // Priority 1: Explicitly marked primary action
    const explicit = container.querySelector('[data-primary-action="true"], [data-primary-action="submit"]') as HTMLElement;
    if (explicit) return explicit;

    // Priority 2: Submit button
    const submit = container.querySelector('button[type="submit"]') as HTMLElement;
    if (submit) return submit;

    // Priority 3: Common primary action patterns in this codebase
    const gfPrimary = container.querySelector('button.gf-btn-primary, button.bg-primary') as HTMLElement;
    if (gfPrimary) return gfPrimary;

    // Priority 4: Last button that looks like a primary action (not cancel/close/back)
    const buttons = Array.from(container.querySelectorAll('button:not([disabled])')) as HTMLButtonElement[];
    const nonSecondaryButtons = buttons.filter(btn => {
      const text = btn.innerText.toLowerCase();
      const secondaryTerms = ['cancel', 'close', 'back', 'delete', 'remove', 'skip'];
      return !secondaryTerms.some(term => text.includes(term));
    });

    return nonSecondaryButtons[nonSecondaryButtons.length - 1];
  };

  const handleFocus = useCallback((e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";
    if (!isInput) return;

    // Determine container
    const container = target.closest('form') || 
                      target.closest('[role="dialog"]') || 
                      target.closest('.glass-card') || 
                      target.closest('[data-smart-container="true"]') ||
                      document.body;

    const focusable = getFocusableElements(container as HTMLElement);
    const inputs = focusable.filter(el => 
      el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT"
    );

    const currentIndex = inputs.indexOf(target);
    if (currentIndex === -1) return;

    // Set enterKeyHint for mobile
    if (currentIndex === inputs.length - 1) {
      target.setAttribute('enterkeyhint', 'done');
    } else {
      target.setAttribute('enterkeyhint', 'next');
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Enter") return;

    const target = e.target as HTMLElement;
    if (!target) return;

    const isInput = target.tagName === "INPUT";
    const isTextArea = target.tagName === "TEXTAREA";
    const isSelect = target.tagName === "SELECT";
    
    if (!isInput && !isTextArea && !isSelect) return;

    // Special handling for textareas
    if (isTextArea) {
      const isModifierPressed = e.ctrlKey || e.metaKey;
      if (!isModifierPressed) {
        // Normal Enter in textarea = new line
        return;
      }
      // Ctrl/Cmd + Enter in textarea = trigger submission logic
    }

    // Prevent default Enter behavior (like form submission) if we are manually handling it
    // But we only prevent it if we find something to do.

    // Determine container
    const container = target.closest('form') || 
                      target.closest('[role="dialog"]') || 
                      target.closest('.glass-card') || 
                      target.closest('[data-smart-container="true"]') ||
                      document.body;

    const focusable = getFocusableElements(container as HTMLElement);
    
    // Inputs include textareas and selects for navigation purposes
    const inputs = focusable.filter(el => 
      el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT"
    );

    const currentIndex = inputs.indexOf(target);
    if (currentIndex === -1) return;

    const nextInput = inputs[currentIndex + 1];

    if (nextInput) {
      e.preventDefault();
      nextInput.focus();
    } else {
      // Last input, trigger primary action
      const primaryAction = findPrimaryAction(container as HTMLElement);
      if (primaryAction && primaryAction !== target) {
        e.preventDefault();
        primaryAction.click();
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown as EventListener, true);
    window.addEventListener("focusin", handleFocus as EventListener, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown as EventListener, true);
      window.removeEventListener("focusin", handleFocus as EventListener, true);
    };
  }, [handleKeyDown, handleFocus]);
};
