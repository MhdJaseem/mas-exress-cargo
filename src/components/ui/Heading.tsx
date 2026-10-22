import type { ReactNode } from 'react';

/** A heading written as [plain text, highlighted text] — the second part renders in <em> (brand red / red box). */
export type Heading = readonly [plain: string, em: string];

export const HeadingText = ({ h }: { h: Heading }) => (
  <>
    {h[0]}
    {h[1] && <em>{h[1]}</em>}
  </>
);

/** Section heading block used on service and company pages (.blk-h). */
export function SectionHead({ eyebrow, heading, lead }: { eyebrow?: string; heading: Heading; lead?: ReactNode }) {
  return (
    <div className="blk-h reveal">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="big">
        <HeadingText h={heading} />
      </h2>
      {lead && <p className="lead2">{lead}</p>}
    </div>
  );
}
