const SENTENCE_END = /([.!?])\s+/g;

export function autoFormatText(text: string): string {
  if (text.length < 80) return text;
  return text.replace(SENTENCE_END, (_, punct) => `${punct}\n\n`);
}

export function applyAutoFormat(el: HTMLDivElement): void {
  const text = el.innerText;
  if (text.length < 80) return;

  const formatted = autoFormatText(text);
  if (formatted === text) return;

  const sel = window.getSelection();
  const offset = sel?.focusOffset ?? 0;
  el.innerText = formatted;

  try {
    const range = document.createRange();
    const textNode = el.firstChild;
    if (textNode) {
      range.setStart(textNode, Math.min(offset, formatted.length));
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  } catch {
    // cursor restore failed, ignore
  }
}
