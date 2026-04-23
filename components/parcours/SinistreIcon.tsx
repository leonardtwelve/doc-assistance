import type { SinistreTypeDef } from '@/lib/parcours/sinistre-types';

export function SinistreIcon({
  icon,
  className,
}: {
  icon: SinistreTypeDef['icon'];
  className?: string;
}) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: className ?? 'h-6 w-6',
  };

  switch (icon) {
    case 'plane':
      return (
        <svg {...common}>
          <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8L10 13l-2 3H5l-1 1 3 1 1 3 1-1v-3l3-2 6 5.7a.5.5 0 0 0 .8-.5Z" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      );
    case 'suitcase':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 13h18" />
        </svg>
      );
    case 'hospital':
      return (
        <svg {...common}>
          <path d="M4 21V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
          <path d="M2 21h20" />
          <path d="M12 9v6" />
          <path d="M9 12h6" />
        </svg>
      );
    case 'timer':
      return (
        <svg {...common}>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2 2" />
          <path d="M9 2h6" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        </svg>
      );
  }
}
