# 🚀 Guía de Despliegue — TikTok World Cup Battle

## Arquitectura

```
┌─────────────────┐       ┌──────────────────────┐
│   Frontend      │       │   Backend (API + WS) │
│   (Vercel)      │◄─────►│   (Railway / Render) │
│                 │  API  │                      │
│  React + Phaser │  +WS  │  Express + Socket.io │
│  (Static Site)  │       │  + SQLite            │
└─────────────────┘       └──────────────────────┘
```

El frontend se despliega como sitio estático en **Vercel**.  
El backend necesita un servidor Node.js persistente con soporte para **WebSockets** (Socket.io). Se recomienda **Railway** o **Render**.

---

## Requisitos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Railway](https://railway.app) (recomendado) o [Render](https://render.com)

---

## Paso 1: Subir el código a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/tiktok-world-cup.git
git push -u origin main
```

---

## Paso 2: Desplegar el Backend (Railway)

Railway ofrece soporte nativo para WebSockets y persistencia de datos.

1. Entra a [Railway](https://railway.app) y haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Elige tu repositorio (`tiktok-world-cup`)
4. En **Settings → Root Directory**, escribe: `backend`
5. En **Settings → Start Command**, escribe: `npm run build && node dist/index.js`
6. En **Settings**, agrega la variable de entorno:
   - `PORT = 5000`
7. Railway asignará automáticamente una URL pública (ej: `https://tiktok-world-cup-backend.up.railway.app`). **Guarda esta URL.**

### Alternativa: Render

1. Entra a [Render](https://render.com) → **"New Web Service"**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
4. Render te dará una URL como `https://tiktok-world-cup-backend.onrender.com`. **Guárdala.**

> **⚠️ Importante:** El backend usa SQLite (archivo local). En Railway/Render los datos se perderán al reiniciar el servicio. Para persistencia real, migrar a PostgreSQL (opcional).

---

## Paso 3: Desplegar el Frontend (Vercel)

### Opción A: Desde Vercel Dashboard (recomendado)

1. Entra a [Vercel](https://vercel.com) y haz clic en **"Add New → Project"**
2. Importa tu repositorio de GitHub (`tiktok-world-cup`)
3. **No modifiques** el Framework Preset (Vite lo detecta automáticamente)
4. En **Root Directory**, déjalo en `./` (el `vercel.json` del proyecto raíz lo maneja)
5. En **Environment Variables**, agrega:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://tu-backend.railway.app` (la URL del backend) |

6. Haz clic en **"Deploy"**

### Opción B: Desde CLI

```bash
npm i -g vercel
vercel --prod
```

Durante la configuración, responde:
- **Set up and deploy?** → `Y`
- **Which scope?** → Tu cuenta
- **Link to existing project?** → `N`
- **Project name?** → `tiktok-world-cup`
- **Directory?** → `./` (usará el `vercel.json` del proyecto)
- **Override settings?** → `N`

Luego agrega la variable de entorno en Vercel Dashboard:
1. Ve a tu proyecto en Vercel → **Settings → Environment Variables**
2. Agrega `VITE_API_URL` con el valor de la URL de tu backend

---

## Paso 4: Verificar la conexión

1. Abre la URL del frontend en Vercel (ej: `https://tiktok-world-cup.vercel.app/admin`)
2. Inicia sesión con la contraseña por defecto: `admin123`
3. El panel debe conectar automáticamente con el backend

**⚠️ Si no conecta:**
- Verifica que `VITE_API_URL` esté configurada correctamente en Vercel
- Verifica que el backend esté corriendo (revisa los logs en Railway/Render)
- Verifica que el backend tenga CORS habilitado (ya incluido en el código)

---

## Variables de Entorno

| Variable | Dónde se usa | Desarrollo | Producción |
|---|---|---|---|
| `VITE_API_URL` | Frontend (api/socket) | `http://localhost:5000` | `https://tu-backend.railway.app` |
| `PORT` | Backend | `5000` | `5000` |

En **desarrollo local**, el frontend usa `http://localhost:5000` automáticamente (fallback en el código).  
No necesitas crear archivos `.env` para desarrollo.

---

## Estructura del proyecto

```
tiktok-world-cup/
├── frontend/          → React + Vite (se despliega en Vercel)
├── backend/           → Express + Socket.io (se despliega en Railway/Render)
├── vercel.json        → Configuración de Vercel
├── database.sqlite    → Base de datos local (no se sube a producción)
├── start_servers.bat  → Script para desarrollo local
└── DEPLOY.md          → Esta guía
```

---

## Solución de problemas

### Error: `import.meta.env` no está definido
Asegúrate de que el frontend tenga `src/vite-env.d.ts` con `/// <reference types="vite/client" />`.

### Error: WebSocket no conecta
Railway y Render soportan WebSockets. Si usas otro servicio, verifica que tenga soporte para WebSockets persistentes.

### Error: SQLite no escribe
En entornos serverless (Vercel Functions), SQLite no funciona porque el sistema de archivos es efímero. El backend debe correr en un servidor persistente (Railway/Render).

### Error: CORS en producción
Las cabeceras CORS ya están configuradas en el backend con `cors({ origin: '*' })`. Si ves errores de CORS, verifica que el `VITE_API_URL` esté correcto.
