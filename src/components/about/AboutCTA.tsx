import CornerFrameButton from '@/components/CornerFrameButton';

type AboutCTAProps = {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
};

export default function AboutCTA({
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
}: AboutCTAProps) {
  if (!title && !primaryButtonText) return null;

  return (
    <section className="py-20 px-6 text-center border-t border-border-default">
      <div className="max-w-2xl mx-auto mb-12">
        {title && (
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4">{title}</h2>
        )}
        {description && <p className="text-sm md:text-base text-text-secondary">{description}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {primaryButtonText && (
          <CornerFrameButton href="/contact" variant="primary">{primaryButtonText}</CornerFrameButton>
        )}
        {secondaryButtonText && (
          <CornerFrameButton href="/gallery" variant="secondary">{secondaryButtonText}</CornerFrameButton>
        )}
      </div>
    </section>
  );
}
