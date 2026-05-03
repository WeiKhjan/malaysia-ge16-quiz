"use client";

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const blocks = Array.from({ length: total }, (_, i) => i < current);
  return (
    <div className="flex gap-1 items-center">
      {blocks.map((filled, i) => (
        <div
          key={i}
          className={`h-4 flex-1 border-2 border-black ${
            filled ? "bg-pixyellow" : "bg-bgalt"
          }`}
          style={{ minWidth: 8 }}
        />
      ))}
    </div>
  );
}
