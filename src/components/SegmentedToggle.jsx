import { useRef } from 'react';
import { ToggleTrack, ToggleThumb, ToggleSegment } from '../styles.js';

// Two-option segmented toggle (a radiogroup): both options always visible, the
// selected one on the thumb. Arrow keys switch; only the selected option is tabbable.
export function SegmentedToggle({ labelledBy, options, value, onChange }) {
  const segmentRefs = useRef([]);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));

  const handleKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (selectedIndex + step + options.length) % options.length;
    onChange(options[next].value);
    segmentRefs.current[next]?.focus();
  };

  return (
    <ToggleTrack role='radiogroup' aria-labelledby={labelledBy}>
      <ToggleThumb $index={selectedIndex} />
      {options.map((option, index) => (
        <ToggleSegment
          key={option.value}
          ref={(el) => { segmentRefs.current[index] = el; }}
          type='button'
          role='radio'
          aria-checked={index === selectedIndex}
          tabIndex={index === selectedIndex ? 0 : -1}
          $selected={index === selectedIndex}
          onClick={() => onChange(option.value)}
          onKeyDown={handleKeyDown}
        >
          {option.label}
        </ToggleSegment>
      ))}
    </ToggleTrack>
  );
}
