/* Service worker: la app funciona sin internet una vez instalada.
   Para forzar una actualización en los dispositivos, cambia el número de VERSION. */
const VERSION='stockmod-v1';
const ASSETS=["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "vendor/pdf.min.js", "vendor/pdf.worker.min.js", "vendor/JsBarcode.all.min.js", "vendor/xlsx.full.min.js", "vendor/jspdf.umd.min.js", "vendor/jspdf.plugin.autotable.min.js", "vendor/zxing.min.js"];
self.addEventListener('install',e=>e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  const page=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html');
  if(page){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(x=>x.put(r,cp));return res})))});
