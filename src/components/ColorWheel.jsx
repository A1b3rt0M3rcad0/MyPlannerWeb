import { useState, useRef, useEffect } from "react";

export default function ColorWheel({
  value = "#3B82F6",
  onChange,
  size = 200,
  showPresets = true,
  className = "",
}) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState(value);
  const [indicatorPosition, setIndicatorPosition] = useState({
    x: size / 2,
    y: size / 2,
  });

  // Cores predefinidas
  const presetColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
    "#14B8A6",
    "#EAB308",
  ];

  // Função para converter HSL para RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // Função para converter RGB para HEX
  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  // Função para obter cor do pixel na posição do mouse
  const getColorAtPosition = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const maxRadius = Math.min(centerX, centerY) - 10;

    if (distance > maxRadius) return;

    const angle = Math.atan2(y - centerY, x - centerX);
    const hue = ((angle * 180) / Math.PI + 90) % 360;
    const saturation = (distance / maxRadius) * 100;
    const lightness = 50;

    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    return rgbToHex(r, g, b);
  };

  // Função para converter HEX para HSL
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // Função para calcular posição do indicador baseada na cor
  const calculateIndicatorPosition = (color) => {
    const [hue, saturation, lightness] = hexToHsl(color);
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = Math.min(centerX, centerY) - 10;

    const radius = (saturation / 100) * maxRadius;
    const angle = ((hue - 90) * Math.PI) / 180;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return { x, y };
  };

  // Função para desenhar a roda de cores
  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar roda de cores
    for (let angle = 0; angle < 360; angle += 0.5) {
      for (let r = 0; r < radius; r += 1) {
        const x = centerX + r * Math.cos((angle * Math.PI) / 180);
        const y = centerY + r * Math.sin((angle * Math.PI) / 180);

        const hue = angle;
        const saturation = (r / radius) * 100;
        const lightness = 50;

        const [red, green, blue] = hslToRgb(hue, saturation, lightness);
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Desenhar círculo central (branco)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // Inicializar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    drawColorWheel();

    // Calcular posição inicial do indicador baseada na cor selecionada
    const initialPosition = calculateIndicatorPosition(selectedColor);
    setIndicatorPosition(initialPosition);
  }, [selectedColor]);

  // Handlers de eventos
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIndicatorPosition({ x, y });
    const color = getColorAtPosition(x, y);
    if (color) {
      setSelectedColor(color);
      onChange?.(color);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIndicatorPosition({ x, y });
    const color = getColorAtPosition(x, y);
    if (color) {
      setSelectedColor(color);
      onChange?.(color);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePresetClick = (color) => {
    setSelectedColor(color);
    const position = calculateIndicatorPosition(color);
    setIndicatorPosition(position);
    onChange?.(color);
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Roda de cores */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="cursor-crosshair rounded-full shadow-lg border-2 border-gray-200"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {/* Indicador de cor selecionada */}
        <div
          className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg pointer-events-none"
          style={{
            backgroundColor: selectedColor,
            left: `${indicatorPosition.x}px`,
            top: `${indicatorPosition.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Input de cor manual */}
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => {
            setSelectedColor(e.target.value);
            const position = calculateIndicatorPosition(e.target.value);
            setIndicatorPosition(position);
            onChange?.(e.target.value);
          }}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
        />
        <div className="text-sm text-gray-600 font-mono">
          {selectedColor.toUpperCase()}
        </div>
      </div>

      {/* Cores predefinidas */}
      {showPresets && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cores Predefinidas
          </label>
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePresetClick(color)}
                className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                  selectedColor === color
                    ? "border-gray-800 ring-2 ring-gray-300"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
