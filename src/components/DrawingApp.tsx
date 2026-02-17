"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Download, Eraser, Trash2, Palette, RefreshCw, Pencil } from 'lucide-react';

export default function DrawingApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); // Ref baru untuk pembungkus canvas
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

  // 1. Logic resize canvas agar selalu full mengikuti container
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Ambil ukuran real dari container pembungkus
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Set ukuran canvas
      canvas.width = width;
      canvas.height = height;

      // Reset context setelah resize (karena canvas akan clear otomatis saat resize)
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
      }
    };

    // Panggil saat pertama kali load dan buat observer agar responsif
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency: hanya jalan saat mount & resize window

  // 2. Update style kuas saat state berubah (tanpa mereset kanvas)
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
      const tempColor = ctx.strokeStyle;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.strokeStyle = tempColor;
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
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

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
    // MAIN CONTAINER: h-screen (Tinggi penuh layar) & overflow-hidden (Hilangkan scroll body)
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
      
      {/* HEADER: Fixed height */}
      <div className="p-4 shadow-sm bg-white/50 backdrop-blur-sm z-10">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          🎨 Papan Gambar Digital - Damar Kurung
        </h1>
      </div>

      {/* CONTENT AREA: flex-1 (Mengisi sisa ruang ke bawah) */}
      <div className="flex-1 p-4 min-h-0">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* === PANEL KIRI (SOAL) === */}
          {/* h-full agar tingginya full mengikuti parent */}
          <div className="bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden border border-gray-200">
            {/* Header Soal (Fixed) */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                📝 Soal {currentQuestion + 1}/{questions.length}
              </h2>
              <button
                onClick={nextQuestion}
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                title="Soal Berikutnya"
              >
                <RefreshCw size={18} />
              </button>
            </div>

            {/* Isi Soal (Scrollable jika konten panjang) */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">
                {questions[currentQuestion].title}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-base">
                {questions[currentQuestion].description}
              </p>
              
              {questions[currentQuestion].hint && (
                <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded mb-4">
                  <p className="text-sm text-green-800">
                    💡 <strong>Petunjuk:</strong> {questions[currentQuestion].hint}
                  </p>
                </div>
              )}

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-auto">
                <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  Contoh Referensi:
                </h4>
                <div className="flex justify-center bg-white p-2 rounded border border-gray-100">
                  <img 
                    src={questions[currentQuestion].image} 
                    alt="Contoh"
                    className="max-h-56 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* === PANEL KANAN (GAMBAR) === */}
          {/* h-full & flex-col agar toolbar di atas dan canvas mengisi sisanya */}
          <div className="bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden border border-gray-200">
            
            {/* Toolbar (Fixed Height) */}
            <div className="p-3 border-b border-gray-200 bg-white z-10 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                
                {/* Tools */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setTool('pen')}
                    className={`p-2 rounded-md transition ${tool === 'pen' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`p-2 rounded-md transition ${tool === 'eraser' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                  >
                    <Eraser size={20} />
                  </button>
                </div>

                {/* Slider & Color */}
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-lg">
                  <input
                    type="range" min="1" max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-20 lg:w-32 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    {showColorPicker && (
                      <div className="absolute top-10 right-0 bg-white rounded-xl shadow-xl p-3 z-50 border border-gray-100 w-48 grid grid-cols-5 gap-2">
                        {colors.map((c) => (
                          <button
                            key={c}
                            onClick={() => { setColor(c); setShowColorPicker(false); }}
                            className="w-6 h-6 rounded-full border hover:scale-110 transition"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 pl-2 border-l border-gray-200">
                  <button onClick={clearCanvas} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={20} />
                  </button>
                  <button onClick={exportImage} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas Area (Flex Grow / Mengisi Sisa Ruang) */}
            <div className="flex-1 relative bg-gray-50 cursor-crosshair overflow-hidden" ref={containerRef}>
              {/* Canvas tanpa width/height inline, dihandle oleh JS */}
              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                className="absolute top-0 left-0 touch-none"
              />
               <p className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none select-none">
                Canvas Full Screen
              </p>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}
