import React, { useEffect } from 'react';

const UseEnhancedLogger = (componentName) => {
  useEffect(() => {
    console.debug(`[${componentName}] Component mounted`);
    return () => {
      console.debug(`[${componentName}] Component will unmount`);
    };
  }, [componentName]);

  const log = (level, message) => {
    if (typeof message === 'object') {
        // If the message is an object, stringify it for better output
        return console.log(message);
    } else {
        console[level](`[${componentName}] ${message}`);
    }
  };

  const debug = (message) => log('debug', message);
  const info = (message) => log('info', message);
  const warn = (message) => log('warn', message);
  const error = (message) => log('error', message);

  return { debug, info, warn, error };
};

export default UseEnhancedLogger;