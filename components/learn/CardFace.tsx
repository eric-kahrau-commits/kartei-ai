interface CardFaceProps {
  text: string;
  imageUrl?: string;
  side: 'front' | 'back';
}

export default function CardFace({ text, imageUrl, side }: CardFaceProps) {
  const hasText = text && text !== '<br>' && text.replace(/<[^>]*>/g, '').trim().length > 0;

  if (imageUrl) {
    return (
      <div className="w-full flex flex-col">
        {/* Image — original aspect ratio preserved */}
        <img
          src={imageUrl}
          alt={side === 'front' ? 'Frage' : 'Antwort'}
          className="w-full h-auto block"
          style={{ objectFit: 'contain', background: '#0f172a', maxHeight: '60vh' }}
        />
        {hasText && (
          <div className="p-4 bg-slate-900/80">
            <div
              className="text-white text-sm sm:text-base leading-relaxed [&_strong]:font-bold [&_em]:italic [&_u]:underline"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full px-6 sm:px-8 min-h-[120px]">
      <div
        className="text-white text-base sm:text-lg leading-relaxed [&_strong]:font-bold [&_em]:italic [&_u]:underline whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: text || (side === 'front' ? 'Frage' : 'Antwort') }}
      />
    </div>
  );
}
