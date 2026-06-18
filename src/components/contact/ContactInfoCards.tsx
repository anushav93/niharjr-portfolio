import CornerFrameCard from '@/components/ui/CornerFrameCard';

type ContactInfoCardsProps = {
  email?: string;
  phone?: string;
  location?: string;
};

export default function ContactInfoCards({ email, phone, location }: ContactInfoCardsProps) {
  const cards = [
    email ? { label: 'Email', content: email, href: `mailto:${email}` } : null,
    phone ? { label: 'Phone', content: phone, href: `tel:${phone}` } : null,
    location ? { label: 'Location', content: location } : null,
  ].filter(Boolean) as { label: string; content: string; href?: string }[];

  if (cards.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <CornerFrameCard
            key={card.label}
            cornerSize="sm"
            className="p-6 border border-stone-900 hover:border-stone-900/0 transition-all bg-[#f5e9df]"
          >
            <div className="text-center">
              <p className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-3 font-medium">
                {card.label}
              </p>
              {card.href ? (
                <a
                  href={card.href}
                  className="text-sm text-text-primary hover:text-primary-600 transition-colors break-all"
                >
                  {card.content}
                </a>
              ) : (
                <p className="text-sm text-text-secondary">{card.content}</p>
              )}
            </div>
          </CornerFrameCard>
        ))}
      </div>
    </div>
  );
}
