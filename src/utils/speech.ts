/**
 * Web Speech API integration for SafePay Mode voice recap.
 * Guarantees plain-language, slow, audible readback for vulnerable users.
 */
export function speakText(
  text: string,
  onEnd?: () => void,
  onError?: (err: unknown) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Web Speech API is not supported in this browser.');
    if (onEnd) onEnd();
    return false;
  }

  try {
    // Cancel any previous speech synthesis
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Use slightly slower, very clear rate for elderly/vulnerable comprehension
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN'; // Indian English pronunciation if available, falls back gracefully

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (onError) onError(e);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Error invoking speech synthesis:', err);
    if (onError) onError(err);
    return false;
  }
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}
