import '@testing-library/jest-dom';

// 模拟katex
jest.mock('katex', () => ({
    renderToString: jest.fn().mockImplementation((latex) => {
        return `<div>${latex}</div>`;
    }),
})); 