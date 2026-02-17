"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Download, Eraser, Trash2, Palette, RefreshCw } from 'lucide-react';
 
export default function DrawingApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [tool, setTool] = useState('pen');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      title: "Soal 1: Gambar Damar Kurung",
      description: "Pak Ali membuat gambar di kertas damar kurung. Gambar pasar tradisional menutupi ⅓ bagian kertas. Gambar perahu menutupi ⅙ bagian kertas. Berapakah bagian kertas yang sudah terisi gambar seluruhnya?",
      hint: "Total = ⅓ + ⅙ = 2/6 + 1/6 = 3/6 = ½ (setengah kertas)",
      image: "gambar/soal2.png"
    },
    {
      title: "Soal 2: Lentera Damar Kurung",
      description: "Damar Kurung menggunakan lampu sebagai sumber cahaya, dimana cahaya tersebut merambat lurus dan menembus kertas, sehingga gambar di kertas tampak bersinar. Di festival Damar Kurung, terdapat 10 lentera yang terbuat dari kertas bergambar. Setengah (½) dari banyaknya lentera itu sudah menyala. Berapakah jumlah lentera yang lampunya sudah menyala?",
      hint: "½ × 10 = 5 lentera",
      image: "gambar/soal3.png"
    },
    {
      title: "Soal 3: Kertas Damar Kurung Rusak",
      description: "Pengrajin telah melukis 4/5 bagian kertas dengan berbagai motif. Dalam proses pengeringan, sayangnya 1/5 bagian lukisan itu rusak karena terciprat air. Berapakah sisa pecahan bagian kertas Damar Kurung yang lukisannya masih utuh?",
      hint: "4/5 - 1/5 = 3/5 (tiga per lima masih utuh)",
      image: "gambar/soal1.png"
    }
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FF8800', '#8B4513'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const width = canvas.offsetWidth || 800;
    const height = canvas.offsetHeight || 600;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color || '#000000';
    ctx.lineWidth = brushSize || 5;
    ctx.scale(dpr, dpr);

    return () => {};
  }, [color, brushSize]);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    (e.target as HTMLCanvasElement).setPointerCapture?.(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
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

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    (e.target as HTMLCanvasElement).releasePointerCapture?.(e.pointerId);
  
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const dpr = (typeof window !== "undefined" ? window.devicePixelRatio : 1) || 1;
  
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
  };

  const exportImage = (format: "png" | "jpeg" = "png") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const mime = format === "jpeg" ? "image/jpeg" : "image/png";
    const title = (questions && questions[currentQuestion]?.title) || "drawing";
    const safeTitle = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const filename = `gambar-${safeTitle}.${format}`;
  
    const dataUrl = canvas.toDataURL(mime);
  
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
    clearCanvas();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🎨 Papan Gambar Digital - Damar Kurung
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                <p className="text-gray-700 leading-relaxed mb-3">
                  {questions[currentQuestion].description}
                </p>
                {questions[currentQuestion].hint && (
                  <div className="p-2 bg-green-50 border-l-4 border-green-400 rounded mb-3">
                    <p className="text-sm text-green-800">
                      💡 <strong>Petunjuk:</strong> {questions[currentQuestion].hint}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">
                  Contoh Gambar:
                </h4>
                <div className="flex justify-center items-center bg-white p-4 rounded">
                  <img 
                    src={questions[currentQuestion].image} 
                    alt={questions[currentQuestion].title}
                    className="w-full h-auto max-w-md rounded shadow-sm"
                  />
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
          <div className="lg:col-span-1">
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
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                className="w-full border-2 border-gray-300 rounded cursor-crosshair touch-none"
                style={{ height: '600px' }}
              />
            </div>

            <p className="text-center mt-4 text-gray-600">
              Gunakan mouse atau sentuh layar untuk menggambar di kanvas. Selamat berkreasi! 🎨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
