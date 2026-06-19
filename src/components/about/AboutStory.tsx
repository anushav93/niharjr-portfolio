import Image from 'next/image';
import type { AboutPageFields } from '@/types/contentful';
import { imageUrl } from '@/lib/contentful';
import {
  MapPinIcon,
  UserIcon,
  PhotoIcon,
  CalendarDaysIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

type AboutStoryProps = {
  fields: Pick<
    AboutPageFields,
    'portraitImage' | 'mainTitle' | 'storyParagraphs' | 'skills'
  >;
};

const ICON_LOOKUP: Record<string, React.ComponentType<{ className?: string }>> = {
  'street photography': MapPinIcon,
  'portrait photography': UserIcon,
  'landscape photography': PhotoIcon,
  'event coverage': CalendarDaysIcon,
};

export default function AboutStory({ fields }: AboutStoryProps) {
  const portraitUrl = fields.portraitImage
    ? imageUrl(fields.portraitImage, { width: 800, height: 1000, quality: 80 })
    : '';

  return (
    <section className="py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {portraitUrl && (
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-primary-400 " />
            <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative z-10">
              <Image
                src={portraitUrl}
                alt={fields.mainTitle || 'Portrait'}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                quality={80}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-b-2 border-r-2 border-primary-400" />
          </div>
        )}

        <div className="space-y-8 flex flex-col justify-center">
          {fields.mainTitle && (
            <h2 className="font-serif text-3xl md:text-4xl text-text-primary">{fields.mainTitle}</h2>
          )}
          {fields.storyParagraphs && fields.storyParagraphs.length > 0 && (
            <div className="space-y-6 text-sm md:text-base leading-relaxed text-text-secondary">
              {fields.storyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
          {fields.skills && fields.skills.length > 0 && (
            <div className="space-y-4 border-t border-stone-200 pt-6 mt-6">
              {fields.skills.map((skill) => {
                const normalizedKey = skill.toLowerCase().trim();
                const IconComponent = ICON_LOOKUP[normalizedKey] || TagIcon;

                return (
                  <div key={skill} className="flex items-center gap-3 py-1">
                    <IconComponent className="w-5 h-5 text-stone-700 stroke-[2]" />
                    <span className="text-xs font-medium tracking-[0.2em] uppercase text-stone-900">
                      {skill}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
