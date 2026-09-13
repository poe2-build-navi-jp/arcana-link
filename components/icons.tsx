import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({
  size = 24,
  children,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        {children}
      </g>
    </svg>
  );
}

export const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 12 4 4L19 6" />
  </Icon>
);
export const ChevronDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
export const Clock3 = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);
export const Copy = (props: IconProps) => (
  <Icon {...props}>
    <rect x="8" y="8" width="11" height="11" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </Icon>
);
export const Download = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3v12M7 10l5 5 5-5" />
    <path d="M5 21h14" />
  </Icon>
);
export const Filter = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Icon>
);
export const Handshake = (props: IconProps) => (
  <Icon {...props}>
    <path d="m8 12 2 2a2 2 0 0 0 3 0l3-3" />
    <path d="m3 9 4-4 4 2 2-1 4 1 4 4-6 6a2 2 0 0 1-3 0l-5-5Z" />
  </Icon>
);
export const Plus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
export const Search = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m16 16 4 4" />
  </Icon>
);
export const Share2 = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
  </Icon>
);
export const ShieldCheck = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
export const Sparkles = (props: IconProps) => (
  <Icon {...props}>
    <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2Z" />
    <path d="m18 14 .7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7Z" />
  </Icon>
);
export const X = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);
export const Bell = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M10 21h4" />
  </Icon>
);
export const Minus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12h14" />
  </Icon>
);
export const AlertTriangle = (props: IconProps) => (
  <Icon {...props}>
    <path d="m12 3 10 18H2Z" />
    <path d="M12 9v4M12 17h.01" />
  </Icon>
);
