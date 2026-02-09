import React from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      {eyebrow ? (
        <div className="text-xs uppercase tracking-wide text-text-muted">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-2xl md:text-3xl font-medium text-text-primary">
        {title}
      </h2>
    </div>
  );
}
