/* oxlint-disable next/no-img-element -- Small SVG diagrams use crawlable src attributes without image optimization. */
type SeoFigureProps = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  className?: string;
};

export function SeoFigure({ src, alt, caption, width, height, className }: SeoFigureProps) {
  return (
    <figure className={`arcana-image-figure${className ? ` ${className}` : ''}`}>
      <a href={src} aria-label={`${alt}を拡大して見る`}>
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      </a>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
