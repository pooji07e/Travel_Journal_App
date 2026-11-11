import React from "react";

interface TiptapRendererProps {
  content: any;
}

export function TiptapRenderer({ content }: TiptapRendererProps) {
  if (!content || !content.content || !Array.isArray(content.content)) {
    return <p className="font-body text-ink-muted italic">This page has no inscribed text yet.</p>;
  }

  const renderNode = (node: any, index: number): React.ReactNode => {
    switch (node.type) {
      case "paragraph":
        return (
          <p key={index} className="font-body text-base text-ink leading-relaxed my-3">
            {node.content?.map((child: any, cIdx: number) => renderInline(child, cIdx))}
          </p>
        );

      case "heading":
        if (node.attrs?.level === 2) {
          return (
            <h2 key={index} className="font-heading font-bold text-2xl text-ink mt-6 mb-3 border-b border-vintage-border/40 pb-1">
              {node.content?.map((child: any, cIdx: number) => renderInline(child, cIdx))}
            </h2>
          );
        }
        return (
          <h3 key={index} className="font-heading font-semibold text-xl text-ink mt-4 mb-2">
            {node.content?.map((child: any, cIdx: number) => renderInline(child, cIdx))}
          </h3>
        );

      case "bulletList":
        return (
          <ul key={index} className="list-disc list-inside space-y-1.5 my-3 pl-2 text-ink">
            {node.content?.map((item: any, iIdx: number) => (
              <li key={iIdx} className="font-body text-base">
                {item.content?.map((p: any, pIdx: number) =>
                  p.content?.map((child: any, cIdx: number) => renderInline(child, `${pIdx}-${cIdx}`))
                )}
              </li>
            ))}
          </ul>
        );

      case "orderedList":
        return (
          <ol key={index} className="list-decimal list-inside space-y-1.5 my-3 pl-2 text-ink">
            {node.content?.map((item: any, iIdx: number) => (
              <li key={iIdx} className="font-body text-base">
                {item.content?.map((p: any, pIdx: number) =>
                  p.content?.map((child: any, cIdx: number) => renderInline(child, `${pIdx}-${cIdx}`))
                )}
              </li>
            ))}
          </ol>
        );

      case "blockquote":
        return (
          <blockquote
            key={index}
            className="border-l-3 border-teal pl-4 my-4 italic font-body text-ink-light bg-paper-warm/50 py-2 rounded-r"
          >
            {node.content?.map((p: any, pIdx: number) => renderNode(p, pIdx))}
          </blockquote>
        );

      case "horizontalRule":
        return <div key={index} className="torn-divider my-6 opacity-40" />;

      default:
        return null;
    }
  };

  const renderInline = (inline: any, key: any): React.ReactNode => {
    if (!inline.text) return null;

    let element: React.ReactNode = inline.text;

    if (inline.marks && Array.isArray(inline.marks)) {
      for (const mark of inline.marks) {
        if (mark.type === "bold") {
          element = <strong key="bold" className="font-bold">{element}</strong>;
        } else if (mark.type === "italic") {
          element = <em key="italic" className="italic">{element}</em>;
        }
      }
    }

    return <React.Fragment key={key}>{element}</React.Fragment>;
  };

  return (
    <div className="space-y-2">
      {content.content.map((node: any, idx: number) => renderNode(node, idx))}
    </div>
  );
}
