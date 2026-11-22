interface WaveDividerProps {
  fromColor: string;
  toColor: string;
  accentColor?: string;
  variant?: 'crest' | 'swell' | 'layered';
  flip?: boolean;
}

const WAVE_PATHS: Record<NonNullable<WaveDividerProps['variant']>, { main: string; back: string }> = {
  crest: {
    back: 'M0,56 C240,12 480,104 720,52 C960,0 1200,76 1440,38 L1440,120 L0,120 Z',
    main: 'M0,74 C280,20 520,112 820,58 C1080,12 1260,88 1440,48 L1440,120 L0,120 Z',
  },
  swell: {
    back: 'M0,44 C320,96 640,8 960,64 C1180,102 1320,34 1440,56 L1440,120 L0,120 Z',
    main: 'M0,62 C340,108 660,22 980,74 C1190,106 1330,48 1440,68 L1440,120 L0,120 Z',
  },
  layered: {
    back: 'M0,38 C220,88 460,18 760,68 C1040,114 1260,24 1440,52 L1440,120 L0,120 Z',
    main: 'M0,58 C260,102 510,28 790,74 C1070,118 1280,40 1440,66 L1440,120 L0,120 Z',
  },
};

export function WaveDivider({
  fromColor,
  toColor,
  accentColor,
  variant = 'crest',
  flip = false,
}: WaveDividerProps) {
  const paths = WAVE_PATHS[variant];

  return (
    <div
      aria-hidden="true"
      style={{ backgroundColor: fromColor }}
      className="relative -my-px w-full overflow-hidden leading-none select-none"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`block h-12 w-full sm:h-16 lg:h-20 ${flip ? '-scale-x-100' : ''}`}
      >
        <path
          d={paths.back}
          fill={accentColor ?? toColor}
          fillOpacity={accentColor ? 0.22 : 0.38}
        />
        <path d={paths.main} fill={toColor} />
      </svg>
    </div>
  );
}
