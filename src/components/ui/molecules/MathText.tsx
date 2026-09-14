import { Fragment } from "react";
import { KaTeX } from "@/components/ui/atoms/KaTeX";
import { splitMathSegments } from "@/lib/mathText";

type MathTextProps = {
  text: string;
};

export function MathText({ text }: MathTextProps) {
  return (
    <>
      {splitMathSegments(text).map((segment, index) =>
        segment.kind === "math" ? (
          <KaTeX key={index} tex={segment.value} />
        ) : (
          <Fragment key={index}>{segment.value}</Fragment>
        ),
      )}
    </>
  );
}
