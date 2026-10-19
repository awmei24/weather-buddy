// Pixel-art icons drawn from text grids: '#' is a filled pixel, '.' is empty.
// They use currentColor, so they follow the theme's text colour.

function toRects(rows) {
  const rects = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== '#') {
        x++;
        continue;
      }
      // Merge horizontal runs into one rect to keep the SVG small
      let end = x;
      while (row[end] === '#') end++;
      rects.push({ x, y, width: end - x });
      x = end;
    }
  });
  return rects;
}

export function PixelArt({ rows, size = 20, style, className }) {
  const width = rows[0].length;
  const height = rows.length;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={(size * height) / width}
      shapeRendering='crispEdges'
      fill='currentColor'
      aria-hidden='true'
      focusable='false'
      style={style}
      className={className}
    >
      {toRects(rows).map(({ x, y, width: w }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} />
      ))}
    </svg>
  );
}
