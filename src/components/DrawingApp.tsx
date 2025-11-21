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
      example: `
        <svg viewBox="0 0 400 300" class="w-full h-auto">
          <!-- Kerangka Damar Kurung -->
          <path d="M 80,50 L 120,20 L 160,50 L 160,200 L 80,200 Z" 
                fill="none" stroke="#8B4513" stroke-width="3"/>
          <line x1="80" y1="80" x2="160" y2="80" stroke="#8B4513" stroke-width="2"/>
          <line x1="80" y1="120" x2="160" y2="120" stroke="#8B4513" stroke-width="2"/>
          <line x1="80" y1="160" x2="160" y2="160" stroke="#8B4513" stroke-width="2"/>
          <line x1="100" y1="50" x2="100" y2="200" stroke="#8B4513" stroke-width="2"/>
          <line x1="140" y1="50" x2="140" y2="200" stroke="#8B4513" stroke-width="2"/>
          
          <!-- Gambar kecil pasar -->
          <image x="85" y="85" width="25" height="25" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='20' y='40' width='60' height='40' fill='%23CD853F'/%3E%3Crect x='35' y='60' width='10' height='20' fill='%238B4513'/%3E%3Crect x='55' y='60' width='10' height='20' fill='%238B4513'/%3E%3C/svg%3E"/>
          
          <!-- Gambar kecil perahu -->
          <image x="105" y="135" width="25" height="25" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpolygon points='20,60 80,60 70,80 30,80' fill='%234169E1'/%3E%3Cpolygon points='50,30 55,60 45,60' fill='%23DC143C'/%3E%3C/svg%3E"/>
          
          <!-- Kertas dengan grid 6 bagian -->
          <rect x="220" y="50" width="150" height="180" fill="white" stroke="black" stroke-width="2"/>
          <line x1="220" y1="110" x2="370" y2="110" stroke="black" stroke-width="1"/>
          <line x1="220" y1="170" x2="370" y2="170" stroke="black" stroke-width="1"/>
          <line x1="295" y1="50" x2="295" y2="230" stroke="black" stroke-width="1"/>
          
          <!-- Gambar pasar (2 kotak = ⅓) -->
          <rect x="220" y="50" width="75" height="60" fill="#FFE4B5" stroke="black" stroke-width="1"/>
          <rect x="295" y="50" width="75" height="60" fill="#FFE4B5" stroke="black" stroke-width="1"/>
          <text x="257" y="85" font-size="12" fill="black">Pasar</text>
          
          <!-- Gambar perahu (1 kotak = ⅙) -->
          <rect x="220" y="110" width="75" height="60" fill="#B0E0E6" stroke="black" stroke-width="1"/>
          <text x="245" y="145" font-size="12" fill="black">Perahu</text>
        </svg>
      `
    },
    {
      title: "Soal 2: Lentera Damar Kurung",
      description: "Damar Kurung menggunakan lampu sebagai sumber cahaya, dimana cahaya tersebut merambat lurus dan menembus kertas, sehingga gambar di kertas tampak bersinar. Di festival Damar Kurung, terdapat 10 lentera yang terbuat dari kertas bergambar. Setengah (½) dari banyaknya lentera itu sudah menyala. Berapakah jumlah lentera yang lampunya sudah menyala?",
      hint: "½ × 10 = 5 lentera",
      example: `
        <svg viewBox="0 0 500 300" class="w-full h-auto">
          <!-- 10 Lentera dalam 2 baris -->
          <!-- Baris 1: 5 lentera (3 menyala, 2 tidak) -->
          <g id="lentera-nyala-1">
            <path d="M 40,80 L 50,60 L 60,80 L 60,130 L 40,130 Z" fill="#FFD700" stroke="#8B4513" stroke-width="2"/>
            <rect x="45" y="55" width="10" height="5" fill="#8B4513"/>
            <circle cx="50" cy="105" r="8" fill="#FF6347"/>
            <line x1="45" y1="95" x2="55" y2="115" stroke="#FFD700" stroke-width="1"/>
            <line x1="55" y1="95" x2="45" y2="115" stroke="#FFD700" stroke-width="1"/>
          </g>
          
          <use href="#lentera-nyala-1" x="60" y="0"/>
          <use href="#lentera-nyala-1" x="120" y="0"/>
          
          <!-- Lentera tidak menyala -->
          <g id="lentera-mati">
            <path d="M 220,80 L 230,60 L 240,80 L 240,130 L 220,130 Z" fill="#D3D3D3" stroke="#8B4513" stroke-width="2"/>
            <rect x="225" y="55" width="10" height="5" fill="#8B4513"/>
            <circle cx="230" cy="105" r="8" fill="#8B4513"/>
          </g>
          
          <use href="#lentera-mati" x="60" y="0"/>
          
          <!-- Baris 2: 5 lentera (2 menyala, 3 tidak) -->
          <use href="#lentera-nyala-1" x="0" y="100"/>
          <use href="#lentera-nyala-1" x="60" y="100"/>
          
          <use href="#lentera-mati" x="-100" y="100"/>
          <use href="#lentera-mati" x="-40" y="100"/>
          <use href="#lentera-mati" x="20" y="100"/>
          
          <!-- Label -->
          <text x="50" y="250" font-size="16" fill="black" font-weight="bold">5 lentera menyala</text>
          <text x="250" y="250" font-size="16" fill="black" font-weight="bold">5 lentera mati</text>
        </svg>
      `
    },
    {
      title: "Soal 3: Kertas Damar Kurung Rusak",
      description: "Pengrajin telah melukis 4/5 bagian kertas dengan berbagai motif. Dalam proses pengeringan, sayangnya 1/5 bagian lukisan itu rusak karena terciprat air. Berapakah sisa pecahan bagian kertas Damar Kurung yang lukisannya masih utuh?",
      hint: "4/5 - 1/5 = 3/5 (tiga per lima masih utuh)",
      example: `
        <svg viewBox="0 0 500 300" class="w-full h-auto">
          <!-- Kertas dibagi 5 bagian vertikal -->
          <rect x="50" y="50" width="80" height="200" fill="#2F4F2F" stroke="black" stroke-width="2"/>
          <text x="70" y="160" font-size="14" fill="white">Utuh</text>
          
          <rect x="130" y="50" width="80" height="200" fill="#2F4F2F" stroke="black" stroke-width="2"/>
          <text x="150" y="160" font-size="14" fill="white">Utuh</text>
          
          <rect x="210" y="50" width="80" height="200" fill="#2F4F2F" stroke="black" stroke-width="2"/>
          <text x="230" y="160" font-size="14" fill="white">Utuh</text>
          
          <!-- Bagian rusak dengan efek air -->
          <rect x="290" y="50" width="80" height="200" fill="#FFD700" stroke="black" stroke-width="2"/>
          <circle cx="320" cy="100" r="15" fill="#87CEEB" opacity="0.6"/>
          <circle cx="340" cy="140" r="20" fill="#87CEEB" opacity="0.6"/>
          <circle cx="310" cy="180" r="18" fill="#87CEEB" opacity="0.6"/>
          <text x="300" y="160" font-size="12" fill="red">Rusak</text>
          
          <rect x="370" y="50" width="80" height="200" fill="white" stroke="black" stroke-width="2"/>
          <text x="380" y="160" font-size="12" fill="gray">Kosong</text>
          
          <!-- Keterangan -->
          <text x="50" y="270" font-size="14" fill="black">3/5 kertas masih utuh</text>
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
  const width = canvas.offsetWidth || 800;
  const height = canvas.offsetHeight || 600;

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
  
    // release pointer capture
    (e.target as HTMLCanvasElement).releasePointerCapture?.(e.pointerId);
  
    ctx.closePath();
    setIsDrawing(false);
  };

// Ganti fungsi clearCanvas Anda dengan ini
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;                 // guard: kalau belum ada, keluar
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;                    // guard lagi: kalau getContext gagal, keluar
  
    // device pixel ratio (sama saat inisialisasi canvas)
    const dpr = (typeof window !== "undefined" ? window.devicePixelRatio : 1) || 1;
  
    // canvas.width/height adalah dalam pixel nyata (sudah dikali dpr)
    // untuk menggambar/clear dalam koordinat CSS (yang kita scale di ctx),
    // pakai width/height dibagi dpr
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;
  
    // Reset transform supaya clear/fill tepat (jika sebelumnya ctx.scale(dpr,dpr) dipanggil)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  
    // Isi background putih (atau gunakan clearRect saja)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Jika kamu ingin tetap menggunakan koordinat CSS (tidak pixel scaled),
    // bisa juga menggunakan:
    // ctx.clearRect(0, 0, cssWidth, cssHeight);
    // ctx.fillRect(0, 0, cssWidth, cssHeight);
  
    // Kalau setelah reset transform perlu kembali scale untuk menggambar nanti,
    // skala lagi sesuai dpr supaya drawing selanjutnya konsisten:
    ctx.scale(dpr, dpr);
  };


// contoh: exportImage yang sudah bertipe + guard null
  const exportImage = (format: "png" | "jpeg" = "png") => {
    const canvas = canvasRef.current;
    if (!canvas) return; // guard: belum ada canvas
  
    // pilih mime type sesuai format
    const mime = format === "jpeg" ? "image/jpeg" : "image/png";
  
    // nama file (jaga agar tidak crash kalau questions atau currentQuestion undefined)
    const title =
      (questions && questions[currentQuestion]?.title) ||
      "drawing";
    const safeTitle = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const filename = `gambar-${safeTitle}.${format}`;
  
    // kalau mau kualitas JPEG tertentu, bisa gunakan toDataURL('image/jpeg', quality)
    const dataUrl = canvas.toDataURL(mime);
  
    // buat link untuk download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    // klik link secara programatik
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
