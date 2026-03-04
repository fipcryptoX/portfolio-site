import util from "../styles/util.module.css";

function RichText({ richText }) {
  return (
    <>
      {(richText || []).map((text, index) => {
        const content = text.plain_text || "";
        const href = text.href || text.text?.link?.url || null;
        const classes = [];
        if (text.annotations?.bold) classes.push("bold");
        if (text.annotations?.italic) classes.push("italic");
        if (text.annotations?.code) classes.push("code");
        if (text.annotations?.strikethrough) classes.push("strikethrough");
        if (text.annotations?.underline) classes.push("underline");
        const className = classes.join(" ");

        if (href) {
          return (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer" className={className}>
              {content}
            </a>
          );
        }
        return (
          <span key={index} className={className}>
            {content}
          </span>
        );
      })}
    </>
  );
}

function NotionBlock({ block }) {
  switch (block.type) {
    case "heading_1":
      return (
        <h1>
          <RichText richText={block.heading_1.rich_text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2>
          <RichText richText={block.heading_2.rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3>
          <RichText richText={block.heading_3.rich_text} />
        </h3>
      );
    case "paragraph":
      return (
        <p>
          <RichText richText={block.paragraph.rich_text} />
        </p>
      );
    case "quote":
      return (
        <blockquote>
          <RichText richText={block.quote.rich_text} />
        </blockquote>
      );
    case "bulleted_list_item":
      return (
        <p>
          {"• "}
          <RichText richText={block.bulleted_list_item.rich_text} />
        </p>
      );
    case "numbered_list_item":
      return (
        <p>
          {"1. "}
          <RichText richText={block.numbered_list_item.rich_text} />
        </p>
      );
    case "code":
      return <pre>{block.code.rich_text?.map((t) => t.plain_text).join("")}</pre>;
    case "divider":
      return <hr />;
    case "image": {
      const src =
        block.image.local_url ||
        (block.image.type === "external" ? block.image.external?.url : block.image.file?.url);
      if (!src) return null;
      return (
        <p>
          <img src={src} alt={block.image.caption?.[0]?.plain_text || "Project image"} style={{ width: "100%", borderRadius: "8px" }} />
        </p>
      );
    }
    default:
      return null;
  }
}

export default function NotionBlockRenderer({ blocks }) {
  return (
    <div className={util.read}>
      {(blocks || []).map((block) => (
        <NotionBlock key={block.id} block={block} />
      ))}
    </div>
  );
}
