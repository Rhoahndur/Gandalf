'use client';

import { useState } from 'react';

interface MathSymbolKeyboardProps {
  onSymbolClick: (symbol: string) => void;
  isVisible: boolean;
}

interface SymbolButton {
  symbol: string;
  label: string;
  tooltip: string;
}

const symbolGroups = {
  greek: [
    { symbol: 'π', label: 'π', tooltip: 'Pi' },
    { symbol: 'θ', label: 'θ', tooltip: 'Theta' },
    { symbol: 'α', label: 'α', tooltip: 'Alpha' },
    { symbol: 'β', label: 'β', tooltip: 'Beta' },
    { symbol: 'γ', label: 'γ', tooltip: 'Gamma' },
    { symbol: 'Δ', label: 'Δ', tooltip: 'Delta' },
    { symbol: 'Σ', label: 'Σ', tooltip: 'Sigma (uppercase)' },
  ],
  operators: [
    { symbol: '×', label: '×', tooltip: 'Multiplication' },
    { symbol: '÷', label: '÷', tooltip: 'Division' },
    { symbol: '±', label: '±', tooltip: 'Plus-minus' },
    { symbol: '≠', label: '≠', tooltip: 'Not equal' },
    { symbol: '≈', label: '≈', tooltip: 'Approximately equal' },
    { symbol: '≤', label: '≤', tooltip: 'Less than or equal' },
    { symbol: '≥', label: '≥', tooltip: 'Greater than or equal' },
  ],
  special: [
    { symbol: '√', label: '√', tooltip: 'Square root' },
    { symbol: '²', label: 'x²', tooltip: 'Squared' },
    { symbol: '³', label: 'x³', tooltip: 'Cubed' },
    { symbol: '∞', label: '∞', tooltip: 'Infinity' },
    { symbol: '∫', label: '∫', tooltip: 'Integral' },
    { symbol: '∑', label: '∑', tooltip: 'Summation' },
  ],
  latex: [
    { symbol: '\\frac{}{}', label: 'a/b', tooltip: 'Fraction (LaTeX)' },
    { symbol: '^{}', label: 'x^n', tooltip: 'Exponent (LaTeX)' },
    { symbol: '\\sqrt{}', label: '√x', tooltip: 'Square root (LaTeX)' },
    { symbol: '\\theta', label: 'θ', tooltip: 'Theta (LaTeX)' },
  ],
};

export function MathSymbolKeyboard({ onSymbolClick, isVisible }: MathSymbolKeyboardProps) {
  const [activeGroup, setActiveGroup] = useState<keyof typeof symbolGroups>('operators');

  const handleSymbolClick = (symbol: string) => {
    // Auto-wrap LaTeX commands with $ for inline math rendering
    if (activeGroup === 'latex') {
      onSymbolClick(`$${symbol}$`);
    } else {
      onSymbolClick(symbol);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full mb-3 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm animate-in slide-in-from-top-2 duration-200">
      {/* Group tabs */}
          <div className="flex gap-1 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveGroup('operators')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 whitespace-nowrap ${
                activeGroup === 'operators'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Operators
            </button>
            <button
              type="button"
              onClick={() => setActiveGroup('greek')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 whitespace-nowrap ${
                activeGroup === 'greek'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Greek
            </button>
            <button
              type="button"
              onClick={() => setActiveGroup('special')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 whitespace-nowrap ${
                activeGroup === 'special'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Special
            </button>
            <button
              type="button"
              onClick={() => setActiveGroup('latex')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 whitespace-nowrap ${
                activeGroup === 'latex'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              LaTeX
            </button>
          </div>

          {/* Symbol buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {symbolGroups[activeGroup].map((btn, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSymbolClick(btn.symbol)}
                className="group relative px-3 py-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                title={btn.tooltip}
                aria-label={btn.tooltip}
              >
                <span className="block text-center">{btn.label}</span>

                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  {btn.tooltip}
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></span>
                </span>
              </button>
            ))}
          </div>

          {/* Helper text */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Click any symbol to insert it at your cursor position. LaTeX symbols are automatically wrapped with $ for inline math rendering.
            </span>
          </div>
    </div>
  );
}
