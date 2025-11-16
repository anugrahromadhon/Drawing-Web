"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Download, Eraser, Trash2, Palette, RefreshCw } from 'lucide-react';

export default function DrawingApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('pen');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      title: "Menggambar Rumah",
      description: "Gambarlah sebuah rumah sederhana dengan atap segitiga, pintu persegi panjang, dan dua jendela!",
      example: `
        <svg viewBox="0 0 200 200" class="w-full h-auto">
          <!-- Rumah -->
          <rect x="50" y="100" width="100" height="80" fill="#f0e68c" stroke="#8b7355" stroke-width="2"/>
          <!-- Atap -->
          <polygon points="50,100 100,60 150,100" fill="#dc143c" stroke="#8b0000" stroke-width="2"/>
          <!-- Pintu -->
          <rect x="85" y="140" width="30" height="40" fill="#8b4513" stroke="#654321" stroke-width="2"/>
          <!-- Jendela kiri -->
          <rect x="60" y="115" width="20" height="20" fill="#87ceeb" stroke="#4682b4" stroke-width="2"/>
          <!-- Jendela kanan -->
          <rect x="120" y="115" width="20" height="20" fill="#87ceeb" stroke="#4682b4" stroke-width="2"/>
        </svg>
      `
    },
    {
      title: "Menggambar Pohon",
      description: "Gambarlah sebuah pohon dengan batang cokelat dan mahkota hijau berbentuk lingkaran!",
      example: `
        <svg viewBox="0 0 200 200" class="w-full h-auto">
          <!-- Batang -->
          <rect x="90" y="120" width="20" height="60" fill="#8b4513" stroke="#654321" stroke-width="2"/>
          <!-- Mahkota -->
          <circle cx="100" cy="100" r="50" fill="#228b22" stroke="#006400" stroke-width="2"/>
        </svg>
      `
    },
    {
      title: "Menggambar Mobil",
      description: "Gambarlah sebuah mobil dengan badan persegi panjang dan dua roda bulat!",
      example: `
        <svg viewBox="0 0 200 200" class="w-full h-auto">
          <!-- Badan mobil -->
          <rect x="40" y="110" width="120" height="40" fill="#ff4500" stroke="#8b0000" stroke-width="2"/>
          <!-- Atap mobil -->
          <rect x="60" y="90" width="60" height="20" fill="#ff6347" stroke="#8b0000" stroke-width="2"/>
          <!-- Roda kiri -->
          <circle cx="70" cy="150" r="15" fill="#2f4f4f" stroke="#000000" stroke-width="2"/>
          <circle cx="70" cy="150" r="8" fill="#c0c0c0" stroke="#000000" stroke-width="2"/>
          <!-- Roda kanan -->
          <circle cx="130" cy="150" r="15" fill="#2f4f4f" stroke="#000000" stroke-width="2"/>
          <circle cx="130" cy="150" r="8" fill="#c0c0c0" stroke="#000000" stroke-width="2"/>
        </svg>
      `
    },
    {
      title: "Menggambar Matahari",
      description: "Gambarlah matahari dengan lingkaran di tengah dan garis-garis sebagai sinar!",
      example: `
        <svg viewBox="0 0 200 200" class="w-full h-auto">
          <!-- Lingkaran matahari -->
          <circle cx="100" cy="100" r="30" fill="#ffd700" stroke="#ff8c00" stroke-width="2"/>
          <!-- Sinar-sinar -->
          <line x1="100" y1="50" x2="100" y2="70" stroke="#ff8c00" stroke-width="3"/>
          <line x1="100" y1="130" x2="100" y2="150" stroke="#ff8c00" stroke-width="3"/>
          <line x1="50" y1="100" x2="70" y2="100" stroke="#ff8c00" stroke-width="3"/>
          <line x1="130" y1="100" x2="150" y2="100" stroke="#ff8c00" stroke-width="3"/>
          <line x1="65" y1="65" x2="79" y2="79" stroke="#ff8c00" stroke-width="3"/>
          <line x1="121" y1="121" x2="135" y2="135" stroke="#ff8c00" stroke-width="3"/>
          <line x1="135" y1="65" x2="121" y2="79" stroke="#ff8c00" stroke-width="3"/>
          <line x1="79" y1="121" x2="65" y2="135" stroke="#ff8c00" stroke-width="3"/>
        </svg>
      `
    },
    {
      title: "Menggambar Bunga",
      description: "Gambarlah bunga dengan 5 kelopak berbentuk oval dan batang hijau!",
      example: `
        <svg viewBox="0 0 200 200" class="w-full h-auto">
          <!-- Batang -->
          <line x1="100" y1="100" x2="100" y2="170" stroke="#228b22" stroke-width="4"/>
          <!-- Tengah bunga -->
          <circle cx="100" cy="100" r="12" fill="#ffd700" stroke="#ff8c00" stroke-width="2"/>
          <!-- Kelopak -->
          <ellipse cx="100" cy="70" rx="15" ry="25" fill="#ff69b4" stroke="#ff1493" stroke-width="2"/>
          <ellipse cx="75" cy="85" rx="15" ry="25" fill="#ff69b4" stroke="#ff1493" stroke-width="2" transform="rotate(-72 75 85)"/>
          <ellipse cx="82" cy="115" rx="15" ry="25" fill="#ff69b4" stroke="#ff1493" stroke-width="2" transform="rotate(-144 82 115)"/>
          <ellipse cx="118" cy="115" rx="15" ry="25" fill="#ff69b4" stroke="#ff1493" stroke-width="2" transform="rotate(144 118 115)"/>
          <ellipse cx="125" cy="85" rx="15" ry="25" fill="#ff69b4" stroke="#ff1493" stroke-width="2" transform="rotate(72 125 85)"/>
        </svg>
      `
    }
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FF8800', '#8B4513'
  ];

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  // dukungan high DPI
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // set background putih
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // garis & styling
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // gunakan state `color` dan `brushSize` yang memang ada
  ctx.strokeStyle = color || '#000000';
  ctx.lineWidth = brushSize || 5;

  // scale untuk high-DPI (ctx sudah pakai pixel dimensi canvas)
  ctx.scale(dpr, dpr);

  // cleanup jika perlu
  return () => {
    // jika menambahkan event listener di sini, hapus di return
  };
  // pastikan dependensi mencakup state yang dipakai
}, [color, brushSize]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const exportImage = (format) => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `gambar-${questions[currentQuestion].title.toLowerCase().replace(/\s/g, '-')}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
    clearCanvas();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🎨 Papan Gambar Digital
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Panel Soal - Kiri */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  📝 Soal {currentQuestion + 1}/{questions.length}
                </h2>
                <button
                  onClick={nextQuestion}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  title="Soal Berikutnya"
                >
                  <RefreshCw size={20} />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  {questions[currentQuestion].title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {questions[currentQuestion].description}
                </p>
              </div>

              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">
                  Contoh Gambar:
                </h4>
                <div className="flex justify-center items-center bg-white p-4 rounded">
                  <div dangerouslySetInnerHTML={{ __html: questions[currentQuestion].example }} />
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Tips:</strong> Lihat contoh gambar di atas sebagai referensi, lalu coba gambar versi kamu sendiri!
                </p>
              </div>
            </div>
          </div>

          {/* Panel Gambar - Kanan */}
          <div className="lg:col-span-2">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTool('pen')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      tool === 'pen'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ✏️ Pena
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                      tool === 'eraser'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Eraser size={18} /> Hapus
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Ukuran: {brushSize}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-32"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    <Palette size={18} />
                    <div
                      className="w-6 h-6 rounded border-2 border-gray-400"
                      style={{ backgroundColor: color }}
                    />
                  </button>
                  
                  {showColorPicker && (
                    <div className="absolute top-12 left-0 bg-white rounded-lg shadow-xl p-3 z-10 grid grid-cols-5 gap-2">
                      {colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setColor(c);
                            setShowColorPicker(false);
                          }}
                          className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transition"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer col-span-5"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                  >
                    <Trash2 size={18} /> Hapus
                  </button>
                  <button
                    onClick={() => exportImage('png')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                  >
                    <Download size={18} /> PNG
                  </button>
                  <button
                    onClick={() => exportImage('jpeg')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                  >
                    <Download size={18} /> JPG
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full border-2 border-gray-300 rounded cursor-crosshair"
                style={{ height: '600px' }}
              />
            </div>

            <p className="text-center mt-4 text-gray-600">
              Gunakan mouse untuk menggambar di kanvas. Selamat berkreasi! 🎨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
