type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div className="relative">
      
      <div className="pt-32 pb-12 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-block mb-4">
          <p className="text-xs tracking-[0.3em] uppercase text-primary-600 mb-2 font-medium">
            {eyebrow}
          </p>
          {/* <div className="h-px w-full bg-primary-400" /> */}
        </div>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-text-primary mb-4 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
