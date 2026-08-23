import { cn } from "@/lib/utils";

export function MarkdownBody({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  const blocks = parseMarkdown(markdown);
  return (
    <div className={cn("space-y-3 text-sm leading-relaxed text-foreground/90", className)}>
      {blocks.map((block, i) => {
        if (block.type === "h2")
          return (
            <h2 key={i} className="pt-3 text-base font-semibold tracking-tight">
              {block.text}
            </h2>
          );
        if (block.type === "h3")
          return (
            <h3 key={i} className="pt-2 text-sm font-semibold">
              {block.text}
            </h3>
          );
        if (block.type === "ul")
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 text-muted-foreground">
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i} className="text-pretty">
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:[^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        const link = part.match(/^\[([^\]]+)\]\((https?:[^)]+)\)$/);
        if (link)
          return (
            <a
              key={i}
              href={link[2]}
              className="text-primary underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {link[1]}
            </a>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

type Block =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] };

function parseMarkdown(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushP = () => {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ") });
      para = [];
    }
  };
  const flushL = () => {
    if (list.length) {
      blocks.push({ type: "ul", items: list });
      list = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushP();
      flushL();
      continue;
    }
    if (line.startsWith("## ")) {
      flushP();
      flushL();
      blocks.push({ type: "h2", text: line.replace(/^##\s+/, "") });
    } else if (line.startsWith("### ")) {
      flushP();
      flushL();
      blocks.push({ type: "h3", text: line.replace(/^###\s+/, "") });
    } else if (line.startsWith("# ")) {
      flushP();
      flushL();
      blocks.push({ type: "h2", text: line.replace(/^#\s+/, "") });
    } else if (line.startsWith("- ")) {
      flushP();
      list.push(line.slice(2));
    } else {
      flushL();
      para.push(line);
    }
  }
  flushP();
  flushL();
  return blocks;
}
