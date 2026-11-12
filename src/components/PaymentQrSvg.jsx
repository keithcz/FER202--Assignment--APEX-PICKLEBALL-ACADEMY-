import React, { useMemo } from 'react';

const MATRIX_SIZE = 21;

function isFinderCell(row, col) {
  const inTopLeft = row < 7 && col < 7;
  const inTopRight = row < 7 && col >= MATRIX_SIZE - 7;
  const inBottomLeft = row >= MATRIX_SIZE - 7 && col < 7;

  if (!inTopLeft && !inTopRight && !inBottomLeft) return null;

  const r = row >= MATRIX_SIZE - 7 ? row - (MATRIX_SIZE - 7) : row;
  const c = col >= MATRIX_SIZE - 7 ? col - (MATRIX_SIZE - 7) : col;

  if (r === 0 || r === 6 || c === 0 || c === 6) return true;
  if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
  return false;
}

function isSeparatorCell(row, col) {
  return (
    (row <= 7 && col <= 7) ||
    (row <= 7 && col >= MATRIX_SIZE - 8) ||
    (row >= MATRIX_SIZE - 8 && col <= 7)
  );
}

function buildMatrix(seedText) {
  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const cells = [];
  for (let r = 0; r < MATRIX_SIZE; r += 1) {
    const row = [];
    for (let c = 0; c < MATRIX_SIZE; c += 1) {
      const finder = isFinderCell(r, c);
      if (finder !== null) {
        row.push(finder);
      } else if (isSeparatorCell(r, c)) {
        row.push(false);
      } else if (r === 6 || c === 6) {
        row.push((r + c) % 2 === 0);
      } else {
        const val = Math.imul(hash ^ (r * 31 + c * 17), 2654435761) >>> 0;
        row.push((val & 3) !== 0 && ((val >> 4) & 1) === 1);
      }
    }
    cells.push(row);
  }
  return cells;
}

export default function PaymentQrSvg({ value, accent = '#11181C', size = 148 }) {
  const matrix = useMemo(() => buildMatrix(value || 'APEX-PAY'), [value]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`-1 -1 ${MATRIX_SIZE + 2} ${MATRIX_SIZE + 2}`}
      className="block"
      role="img"
      aria-label={`Mã QR thanh toán ${value}`}
    >
      <rect x="-1" y="-1" width={MATRIX_SIZE + 2} height={MATRIX_SIZE + 2} fill="#FFFFFF" rx="1" />
      {matrix.map((row, r) =>
        row.map((active, c) =>
          active ? (
            <rect
              key={`${r}-${c}`}
              x={c}
              y={r}
              width={0.92}
              height={0.92}
              rx={0.18}
              fill={accent}
            />
          ) : null
        )
      )}
    </svg>
  );
}
