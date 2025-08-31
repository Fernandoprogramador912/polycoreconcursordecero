import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

// Compat para __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Puerto diferente al frontend

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/subtitles', async (req, res) => {
  console.log('🎯 Petición recibida en /api/subtitles');
  console.log('📋 Query params:', req.query);
  console.log('📋 Headers:', req.headers);
  console.log('📋 Method:', req.method);
  
  try {
    console.log('📦 Importando módulo de subtítulos...');
    const mod = await import('./api/subtitles.js');
    console.log('✅ Módulo importado correctamente');
    
    const handler = mod.default;
    console.log('🔧 Ejecutando handler...');
    
    return handler(req, res);
  } catch (err) {
    console.error('❌ Error loading API handler:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ success: false, error: 'Server error loading API', details: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PolyCore YouTube API is running' });
});

// Para desarrollo: servir el frontend de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log('🚀 PolyCore YouTube API Server iniciado');
  console.log('🚀 ========================================');
  console.log(`🌐 URL del servidor: http://localhost:${PORT}`);
  console.log(`📱 Frontend debería estar en: http://localhost:5173 (Vite)`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎬 API de subtítulos: http://localhost:${PORT}/api/subtitles`);
  console.log('🚀 ========================================');
  
  // Verificar variables de entorno
  console.log('🔧 Variables de entorno:');
  console.log(`   - PORT: ${process.env.PORT || '3001 (default)'}`);
  console.log(`   - YOUTUBE_API_KEY: ${process.env.YOUTUBE_API_KEY ? 'Configurada' : 'No configurada'}`);
  console.log('🚀 ========================================');
});
