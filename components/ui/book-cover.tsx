import { cn } from "@/lib/utils";

const gradients: Record<string, string> = {
  blue: "linear-gradient(135deg,#3a6db5,#2d5da1)",
  pink: "linear-gradient(135deg,#ff7aa8,#ff5d92)",
  orange: "linear-gradient(135deg,#ff8a5c,#ff6b3d)",
  purple: "linear-gradient(135deg,#b07ad6,#9457c4)",
  mint: "linear-gradient(135deg,#5fce9b,#2e9e6b)",
  yellow: "linear-gradient(135deg,#ffe27a,#f5c400)",
};

export type CoverColor = keyof typeof gradients;

export function BookCover({
  title,
  author,
  initials,
  color = "blue",
  width = 152,
  rotate = -3,
  bookmark = false,
  float = false,
  fg = "#ffffff",
  className,
}: {
  title: string;
  author?: string;
  initials?: string;
  color?: CoverColor;
  width?: number;
  rotate?: number;
  bookmark?: boolean;
  float?: boolean;
  fg?: string;
  className?: string;
}) {
  const height = Math.round(width * 1.395);

  return (
    <div className="relative" style={{ paddingTop: 6, width }}>
      {bookmark ? (
        <span
          aria-hidden
          className="absolute z-[3] border-[2.5px] border-b-0 border-[var(--border)]"
          style={{
            top: -8,
            right: 18,
            width: 26,
            height: 74,
            background: "#2d5da1",
            clipPath: "polygon(0 0,100% 0,100% 100%,50% 78%,0 100%)",
            boxShadow: "2px 0 0 rgba(45,45,45,0.15)",
          }}
        />
      ) : null}
      <div
        className={cn(
          "relative flex flex-col justify-between overflow-hidden border-[3px] border-[var(--border)]",
          float && "animate-floaty-slow",
          className,
        )}
        style={{
          width,
          height,
          borderRadius: "4px 10px 10px 4px",
          background: gradients[color],
          boxShadow: "6px 6px 0 var(--border)",
          transform: `rotate(${rotate}deg)`,
          padding: "16px 14px 14px 20px",
        }}
      >
        <span
          aria-hidden
          className="absolute bottom-0 top-0"
          style={{ left: 7, width: 5, background: "rgba(0,0,0,0.22)" }}
        />
        <div className="font-display text-[21px] font-bold leading-[1.1]" style={{ color: fg }}>
          {title}
        </div>
        <div>
          {initials ? (
            <div
              className="mb-2.5 flex items-center justify-center font-display text-[18px] font-bold text-[var(--foreground)]"
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "2.5px solid rgba(255,255,255,0.8)",
                background: "#fff9c4",
              }}
            >
              {initials}
            </div>
          ) : null}
          {author ? (
            <div className="text-[12px] font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
              {author}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
