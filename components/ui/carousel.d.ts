import type { ReactNode } from "react";

interface CarouselProps {
  items?: unknown[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  renderItem?: (item: unknown, index: number) => ReactNode;
}

declare const Carousel: React.FC<CarouselProps>;
export default Carousel;
