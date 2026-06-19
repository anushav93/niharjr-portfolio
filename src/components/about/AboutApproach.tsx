import type { Principle } from '@/types/contentful';
import CornerFrameCard from '@/components/ui/CornerFrameCard';

type AboutApproachProps = {
  title?: string;
  description?: string;
  principles?: Principle[];
};

export default function AboutApproach({ title, description, principles }: AboutApproachProps) {
  if (!title && (!principles || principles.length === 0)) return null;

  return (
    <section className="py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px flex-1 bg-border-default" />
          <div className="w-2 h-2 bg-primary-500 rounded-full" />
          <div className="h-px flex-1 bg-border-default" />
        </div>

        {(title || description) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4">{title}</h2>
            )}
            {description && (
              <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}

        {principles && principles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {principles.map((item, idx) => (
              <CornerFrameCard key={idx} cornerSize="lg" className="p-6 text-center">
                <p className="text-4xl font-light text-primary-400 mb-4">{item.icon}</p>
                <h3 className="font-serif text-xl text-text-primary mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{item.description}</p>
              </CornerFrameCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
