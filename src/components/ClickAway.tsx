import { ReactNode, useEffect, useRef } from "react";

const ClickAway = ({
  children,
  onClickAway,
}: {
  children: ReactNode;
  onClickAway?: (e: MouseEvent | TouchEvent) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickAway?.(e);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickAway?.(e);
      }
    };

    document.addEventListener("mousedown", handleMouseClick);
    document.addEventListener("touchstart", handleTouchStart);
    return () => {
      document.removeEventListener("mousedown", handleMouseClick);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [onClickAway]);

  return <div ref={ref}>{children}</div>;
};

export default ClickAway;
