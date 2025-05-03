
const Var = () => {
  return (
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f0f0f0" />
      <rect
        x="30"
        y="30"
        width="140"
        height="100"
        fill="#333"
        stroke="#fff"
        stroke-width="4"
      />
      <polygon points="80,50 80,110 120,80" fill="#fff" />
      <circle cx="100" cy="160" r="15" fill="#ffd700" />
      <rect x="95" y="145" width="10" height="15" fill="#ffd700" />
      <text x="50" y="180" font-family="Arial" font-size="20" fill="#333">
        VAR
      </text>
    </svg>
  );
};

export default Var;
