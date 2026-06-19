export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:block focus:w-auto focus:h-auto focus:p-3 focus:overflow-visible focus:whitespace-normal focus:bg-brand-dark focus:text-brand-light focus:text-sm focus:tracking-wide focus:uppercase focus:rounded-sm"
    >
      Skip to main content
    </a>
  );
}
