require('@testing-library/jest-dom');

const crypto = require('crypto');

Object.defineProperty(window, 'crypto', {
  value: {
    ...window.crypto,
    randomUUID: () => crypto.randomUUID(),
  },
});
