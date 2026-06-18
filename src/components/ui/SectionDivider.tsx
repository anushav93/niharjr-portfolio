type SectionDividerProps = {
  label: string;
};

export default function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <div className="h-px flex-1 bg-border-default" />
      <h2 className="text-xs tracking-[0.3em] uppercase text-primary-600 font-medium">{label}</h2>
      <div className="h-px flex-1 bg-border-default" />
    </div>
  );
}
