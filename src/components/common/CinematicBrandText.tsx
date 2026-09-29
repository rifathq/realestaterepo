import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface CinematicBrandTextProps {
  text?: string;
  className?: string;
  letterSpacingStart?: string;
  letterSpacingEnd?: string;
  theme?: 'dark' | 'light';
  as?: 'span' | 'div' | 'h1' | 'h2';
}

export const CinematicBrandText: React.FC<CinematicBrandTextProps> = ({
  text = 'DIGENTIC REALTY',
  className = '',
  letterSpacingStart = '0.18em',
  letterSpacingEnd = '0.04em',
  theme = 'light',
  as = 'span',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, render pristine static text
  if (shouldReduceMotion) {
    const Component = as;
    return (
      <Component className={`inline-block ${className}`} style={{ letterSpacing: letterSpacingEnd }}>
        {text}
      </Component>
    );
  }

  const letters = Array.from(text);
  const Component = motion[as] || motion.span;

  // Cinematic bezier easing
  const cinematicEase = [0.16, 1, 0.3, 1] as const;

  return (
    <Component
      className={`relative inline-flex items-center overflow-visible select-none ${className}`}
      initial={{
        letterSpacing: letterSpacingStart,
      }}
      animate={{
        letterSpacing: letterSpacingEnd,
      }}
      transition={{
        duration: 2.4,
        ease: cinematicEase,
      }}
      whileHover={{
        y: -1,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
    >
      {/* Individual letter reveal from left to right with blur removal & vertical slide */}
      <span className="inline-flex items-center">
        {letters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block"
            initial={{
              opacity: 0,
              y: 10,
              filter: 'blur(7px)',
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
            }}
            transition={{
              delay: index * 0.048,
              duration: 1.1,
              ease: cinematicEase,
            }}
            style={{
              willChange: 'transform, opacity, filter',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>

      {/* Subtle single horizontal light sweep across the text */}
      <motion.span
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          delay: 1.1,
          duration: 1.3,
          times: [0, 0.15, 0.85, 1],
          ease: 'linear',
        }}
        aria-hidden="true"
      >
        <motion.span
          className={`absolute top-0 bottom-0 w-28 sm:w-36 -skew-x-25 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-transparent via-white/50 to-transparent'
              : 'bg-gradient-to-r from-transparent via-stone-400/35 to-transparent'
          }`}
          initial={{ left: '-60%' }}
          animate={{ left: '160%' }}
          transition={{
            delay: 1.15,
            duration: 1.25,
            ease: cinematicEase,
          }}
          style={{
            mixBlendMode: theme === 'dark' ? 'plus-lighter' : 'overlay',
            willChange: 'left',
          }}
        />
      </motion.span>
    </Component>
  );
};
