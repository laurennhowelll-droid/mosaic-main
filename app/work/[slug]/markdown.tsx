import Image from "next/image";
import Link from "next/link";

function inlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <Link href={link[2]} key={index}>{link[1]}</Link>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export function MarkdownContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (line === "---") {
      blocks.push(<hr key={blocks.length} />);
      index += 1;
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      blocks.push(<Image src={image[2]} alt={image[1]} width={1100} height={720} sizes="(max-width: 900px) 84vw, 760px" key={blocks.length} />);
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(<h3 key={blocks.length}>{inlineMarkdown(line.slice(4))}</h3>);
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(<h2 key={blocks.length}>{inlineMarkdown(line.slice(3))}</h2>);
      index += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(<h2 key={blocks.length}>{inlineMarkdown(line.slice(2))}</h2>);
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (lines[index]?.trim().startsWith("> ")) {
        quoteLines.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push(<blockquote key={blocks.length}>{quoteLines.map((quote) => <p key={quote}>{inlineMarkdown(quote)}</p>)}</blockquote>);
      continue;
    }

    if (/^- /.test(line)) {
      const items: string[] = [];
      while (/^- /.test(lines[index]?.trim() ?? "")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push(<ul key={blocks.length}>{items.map((item) => <li key={item}>{inlineMarkdown(item)}</li>)}</ul>);
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (/^\d+\. /.test(lines[index]?.trim() ?? "")) {
        items.push(lines[index].trim().replace(/^\d+\. /, ""));
        index += 1;
      }
      blocks.push(<ol key={blocks.length}>{items.map((item) => <li key={item}>{inlineMarkdown(item)}</li>)}</ol>);
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (lines[index]?.trim() && !/^(#|> |- |\d+\. |---|!\[)/.test(lines[index].trim())) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={blocks.length}>{inlineMarkdown(paragraphLines.join(" "))}</p>);
  }

  return <div className="work-article-body">{blocks}</div>;
}
