import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeech, isSpeaking } from '../utils/speech';

interface SpeechButtonProps {
  text: string;
  lang?: 'hi-IN' | 'ur-PK' | 'en-US';
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const SpeechButton: React.FC<SpeechButtonProps> = ({
  text,
  lang = 'hi-IN',
  label = 'सुनें',
  className = '',
  size = 'sm',
}) => {
  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing) {
      stopSpeech();
      setPlaying(false);
    } else {
      setPlaying(true);
      const ok = speakText(text, lang, () => {
        setPlaying(false);
      });
      if (!ok) {
        setPlaying(false);
      }
    }
  };

  const isSm = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleClick}
      title={playing ? 'आवाज बंद करें' : 'बोलकर सुनें (Voice Read)'}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
        playing
          ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300 animate-pulse'
          : 'bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200'
      } ${isSm ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} ${className}`}
    >
      {playing ? (
        <VolumeX className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : (
        <Volume2 className={isSm ? 'w-3.5 h-3.5 text-amber-700' : 'w-4 h-4 text-amber-700'} />
      )}
      <span>{playing ? 'रुकें' : label}</span>
    </button>
  );
};
