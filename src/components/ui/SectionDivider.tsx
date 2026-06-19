type SectionDividerProps = {
  label: string;
  id?: string;
};

export default function SectionDivider({ label, id }: SectionDividerProps) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <div className="h-px flex-1 bg-border-default" aria-hidden="true" />
      <h2 id={id} className="text-xs tracking-[0.3em] uppercase text-primary-600 font-medium">{label}</h2>
      <div className="h-px flex-1 bg-border-default" aria-hidden="true" />
    </div>
  );
}
