import type { AboutPageFields } from '@/types/contentful';
import { imageUrl } from '@/lib/contentful';
import { 
  MapPinIcon, 
  UserIcon, 
  PhotoIcon, 
  CalendarDaysIcon,
  TagIcon // Fallback icon in case a new skill is added in Contentful later
} from '@heroicons/react/24/outline';
type AboutStoryProps = {
  fields: Pick<
    AboutPageFields,
    'portraitImage' | 'mainTitle' | 'storyParagraphs' | 'skills'
  >;
};

// Dictionary mapping the Contentful text string to the Heroicon component
const ICON_LOOKUP: Record<string, React.ComponentType<{ className?: string }>> = {
  'street photography': MapPinIcon,
  'portrait photography': UserIcon,
  'landscape photography': PhotoIcon,
  'event coverage': CalendarDaysIcon,
};

export default function AboutStory({ fields }: AboutStoryProps) {
  const portraitUrl = fields.portraitImage
    ? imageUrl(fields.portraitImage, { width: 800, height: 1000, format: 'webp', quality: 85 })
    : '';

  return (
    <section className="py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {portraitUrl && (
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-primary-400 " />
            <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative z-10">
              <img src={portraitUrl} alt={fields.mainTitle || ''} className="w-full h-full object-cover" />
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
          {/* {fields.skills && fields.skills.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {fields.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 text-xs tracking-wider uppercase bg-primary-50 text-primary-700 border border-stone-300 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )} */}
          {fields.skills && fields.skills.length > 0 && (
        /* Swapped flex-wrap for a clean, scannable vertical list stacked via space-y-4 */
        <div className="space-y-4 border-t border-stone-200 pt-6 mt-6">
          {fields.skills.map((skill) => {
            // Normalize string to match keys in lookup dictionary (lowercase, trimmed)
            const normalizedKey = skill.toLowerCase().trim();
            const IconComponent = ICON_LOOKUP[normalizedKey] || TagIcon;

            return (
              <div 
                key={skill} 
                className="flex items-center gap-3 py-1"
              >
                {/* Minimalist icon perfectly matching your certification strokes */}
                <IconComponent className="w-5 h-5 text-stone-700 stroke-[2]" />
                
                {/* Styled text matching the clean, un-boxed look */}
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
