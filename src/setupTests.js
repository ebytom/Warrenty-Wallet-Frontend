// Enables custom Jest matchers like `toBeInTheDocument()`
import '@testing-library/jest-dom';

// Optional: mock browser APIs to avoid "not implemented" errors in tests
global.scrollTo = jest.fn();
global.fetch = jest.fn();
