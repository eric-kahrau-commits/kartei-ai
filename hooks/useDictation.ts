'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function useDictation(activeRef: React.MutableRefObject<HTMLDivElement | null>) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setIsSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  const insertText = useCallback((text: string) => {
    const el = activeRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel?.rangeCount) {
      el.innerText += text;
      return;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text + ' ');
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, [activeRef]);

  const start = useCallback(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.lang = 'de-DE';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const list = e.results as SpeechRecognitionResultList;
      let transcript = '';
      for (let i = e.resultIndex; i < list.length; i++) {
        transcript += list[i][0].transcript;
      }
      insertText(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [insertText]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return { isListening, isSupported, start, stop };
}
