"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Download, Eraser, Trash2, Palette, RefreshCw, Pencil } from 'lucide-react';

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
      image: "gambar/soal2.png" // Pastikan path ini benar di projectmu
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
    // Menggunakan parent width untuk responsivitas
    const width = canvas.parentElement?.offsetWidth || 800;
    const height = 600; // Tinggi fix agar konsisten

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
  }, []); // Run once on mount to set initial size

  // Update context settings when state changes
  useEffect(() => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
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
      // Eraser logic: draw white lines
      const tempColor = ctx.strokeStyle;
      const tempWidth = ctx.lineWidth;
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2; // Eraser a bit bigger
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Restore settings (though useEffect handles this too, safer here for rapid moves)
      ctx.strokeStyle = tempColor;
      ctx.lineWidth = tempWidth;
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
   
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  // Simplified export to just PNG
  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
   
    const title = (questions && questions[currentQuestion]?.title) || "drawing";
    const safeTitle = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const filename = `hasil-${safeTitle}.png`;
   
    const dataUrl = canvas.toDataURL("image/png");
   
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

        {/* UBAH: Grid jadi 2 kolom (setengah-setengah) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          
          {/* Panel Soal - Kiri */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  📝 Soal {currentQuestion + 1}/{questions.length}
                </h2>
                <button
                  onClick={nextQuestion}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                  title="Soal Berikutnya"
                >
                  <RefreshCw size={20} />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  {questions[currentQuestion].title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  {questions[currentQuestion].description}
                </p>
                {questions[currentQuestion].hint && (
                  <div className="p-2 bg-green-50 border-l-4 border-green-400 rounded mb-3">
                    <p className="text-xs text-green-800">
                      💡 <strong>Petunjuk:</strong> {questions[currentQuestion].hint}
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Contoh Gambar:
                </h4>
                <div className="flex justify-center items-center bg-white p-2 rounded border border-gray-100">
                  <img 
                    src={questions[currentQuestion].image} 
                    alt={questions[currentQuestion].title}
                    className="max-h-48 rounded object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Panel Gambar - Kanan */}
          {/* UBAH: col-span-1 (setengah layar) dan menyatukan Toolbar + Canvas */}
          <div className="lg:col-span-1">
            
            {/* SATU CONTAINER UNTUK TOOLBAR & CANVAS */}
            <div className="bg-white rounded-lg shadow-lg p-3">
              
              {/* Toolbar Baris Atas */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-gray-100 pb-3">
                
                {/* Grup Alat: Pena & Hapus */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setTool('pen')}
                    className={`p-2 rounded-md transition ${
                      tool === 'pen' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Pena"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`p-2 rounded-md transition ${
                      tool === 'eraser' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Penghapus"
                  >
                    <Eraser size={20} />
                  </button>
                </div>

                {/* Grup Pengaturan: Slider & Warna */}
                <div className="flex items-center gap-3">
                  {/* Slider Ukuran */}
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    title="Ukuran Kuas"
                  />

                  {/* Color Picker */}
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-9 h-9 rounded-full border-2 border-gray-200 shadow-sm transition hover:scale-105"
                      style={{ backgroundColor: color }}
                      title="Pilih Warna"
                    />
                    
                    {showColorPicker && (
                      <div className="absolute top-10 right-0 bg-white rounded-xl shadow-xl p-3 z-50 border border-gray-100 w-48">
                        <div className="grid grid-cols-5 gap-2">
                          {colors.map((c) => (
                            <button
                              key={c}
                              onClick={() => {
                                setColor(c);
                                setShowColorPicker(false);
                              }}
                              className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="col-span-5 w-full h-8 mt-2 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* UBAH: Tombol Aksi (Sampah & Download) disamping warna */}
                <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                  <button
                    onClick={clearCanvas}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Bersihkan Kanvas"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={exportImage}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Download Gambar"
                  >
                    <Download size={20} />
                  </button>
                </div>

              </div>

              {/* Canvas Area */}
              <div className="relative w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerLeave={stopDrawing}
                  className="touch-none cursor-crosshair block"
                  // Kita hilangkan style inline width/height di sini agar dihandle JS
                />
              </div>
              
            </div>
            
            <p className="text-center mt-2 text-xs text-gray-500">
              Gunakan kursor atau sentuh layar untuk menggambar.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
