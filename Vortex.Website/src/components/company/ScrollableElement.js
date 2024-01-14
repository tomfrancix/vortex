import React, { useEffect, useRef } from 'react';

const ScrollableElement = ({ children }) => {
  const scrollableRef = useRef(null);

  useEffect(() => {
    const calculateMaxHeight = () => {
      if (scrollableRef.current && window.innerWidth > 600) {
        const viewportHeight = window.innerHeight;
        const elementTop = scrollableRef.current.getBoundingClientRect().top;
        const maxHeight = viewportHeight - elementTop - 10;

        // Set the max-height and overflow-y styles
        scrollableRef.current.style.maxHeight = `${maxHeight}px`;
        scrollableRef.current.style.overflowY = 'scroll';
      }
    };

    calculateMaxHeight();
    window.addEventListener('resize', calculateMaxHeight);

    return () => {
      window.removeEventListener('resize', calculateMaxHeight);
    };
  }, []);

  return (
    <div ref={scrollableRef}>
      {children}
    </div>
  );
};

export default ScrollableElement;