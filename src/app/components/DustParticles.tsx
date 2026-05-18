import type { CSSProperties } from "react";

const PARTICLES = Array.from({ length: 40 }, (_, index) => index);

export function DustParticles() {
  return (
    <div className="dust-field" aria-hidden="true">
      {PARTICLES.map((particle) => (
        <span
          className="dust-mote"
          key={particle}
          style={
            {
              "--mote-x": `${(particle * 37) % 100}%`,
              "--mote-y": `${(particle * 19) % 100}%`,
              "--mote-delay": `${(particle % 12) * -0.9}s`,
              "--mote-size": `${2 + (particle % 4)}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
