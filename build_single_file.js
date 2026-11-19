const fs = require('fs');
const path = require('path');

// 1. Read and encode assets
function toBase64(filePath) {
  return fs.readFileSync(filePath).toString('base64');
}

const assets = {
  'valley/audio/ge-ambient.mp3': 'data:audio/mp3;base64,' + toBase64('raw_assets/valley/audio/ge-ambient.mp3'),
  'valley/camera-path07.glb': 'data:application/octet-stream;name=camera-path.glb;base64,' + toBase64('raw_assets/valley/camera-path07.glb'),
  'valley/flowers/pool_summer.png': 'data:image/png;base64,' + toBase64('raw_assets/valley/flowers/pool_summer.png'),
  'valley/flowers/pool_winter.png': 'data:image/png;base64,' + toBase64('raw_assets/valley/flowers/pool_winter.png'),
  'valley/vignette.png': 'data:image/png;base64,' + toBase64('raw_assets/valley/vignette.png'),
  'valley/dust-particle.png': 'data:image/png;base64,' + toBase64('raw_assets/valley/dust-particle.png'),
  'valley/rays/ray1.png': 'data:image/png;base64,' + toBase64('raw_assets/valley/rays/ray1.png'),
  'valley/rays/ray2.png': 'data:image/png;base64,' + toBase64('raw_assets/valley/rays/ray2.png'),
  'valley/rays/ray3.png': 'data:image/png;base64,' + toBase64('raw_assets/valley/rays/ray3.png'),
  'valley/terrain.png': 'data:image/png;base64,' + toBase64('raw_assets/valley/terrain.png')
};

// 2. Read and encode fonts
const antonioFontB64 = toBase64('antonio400.woff2');
const manropeFontB64 = toBase64('manrope.woff2');

// 3. Process page chunk
let pageChunk = fs.readFileSync('raw_chunks/app/page-4c279de0997d388f.js', 'utf8');

// Replace assets
for (const [key, uri] of Object.entries(assets)) {
  const target = '"' + key + '"';
  const replacement = '"' + uri + '"';
  if (!pageChunk.includes(target)) {
    throw new Error('Asset target not found in page chunk: ' + target);
  }
  pageChunk = pageChunk.replaceAll(target, replacement);
}

// Patch before var ew=e=>{
const ewTarget = 'var ew=e=>{';
if (!pageChunk.includes(ewTarget)) {
  throw new Error('ewTarget not found in page chunk');
}
pageChunk = pageChunk.replace(ewTarget, 'window.__GE={et:()=>et,Y:()=>Y};var ew=e=>{');

// 4. Collect chunks
const chunkFiles = [
  'raw_chunks/webpack-a76c04a7ba9aa4ef.js',
  'raw_chunks/fd9d1056-76aadce26f555392.js',
  'raw_chunks/123-3b7f3df3cc5866d7.js',
  'raw_chunks/450-96e2a31dde902aa5.js',
  'raw_chunks/567-6466d5cc81546a43.js',
  'raw_chunks/340-4c85e05b44fc7370.js',
  'raw_chunks/15-91b52fecfdd8e21a.js',
  'raw_chunks/780-35f43a00462f78e8.js',
  'raw_chunks/419-c9aec889e32d9e7b.js',
  'raw_chunks/131-8efcfd03f067c029.js',
  'raw_chunks/app/layout-681f1a9fe4dd4628.js',
  'raw_chunks/4b5b508e-6dceef0b9f02cb18.js',
  'raw_chunks/8-5234b317a5794281.js',
  'raw_chunks/785-3ec288b614fa287f.js',
  'raw_chunks/b536a0f1-51636bd4ac051d8f.js',
  'raw_chunks/596-40a806be0d0d2bb3.js'
];

let scriptTags = '';

for (const c of chunkFiles) {
  let content = fs.readFileSync(c, 'utf8');
  content = content.replace(/<\/script/gi, '<\\/script');
  scriptTags += '<script>\n' + content + '\n</script>\n';
}

pageChunk = pageChunk.replace(/<\/script/gi, '<\\/script');
scriptTags += '<script>\n' + pageChunk + '\n</script>\n';

// 5. Build full HTML
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fernhollow — Product Eco Analysis</title>
<meta name="description" content="A regenerative design studio. Wander through a night valley of flowers and evaluate the ecological lifecycle of any product.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Antonio:wght@400&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
<style>
@font-face{
  font-family:'Antonio';
  font-style:normal;
  font-weight:400;
  font-display:swap;
  src:url('data:font/woff2;base64,${antonioFontB64}') format('woff2');
}
@font-face{
  font-family:'Manrope';
  font-style:normal;
  font-weight:400;
  font-display:swap;
  src:url('data:font/woff2;base64,${manropeFontB64}') format('woff2');
}
@font-face{
  font-family:'Manrope';
  font-style:normal;
  font-weight:500;
  font-display:swap;
  src:url('data:font/woff2;base64,${manropeFontB64}') format('woff2');
}
:root{--u:min(calc(100vw/1600),calc(100vh/900));--cream:#f5efe2;--dark:#151510;--emerald:#4ade80;--amber:#facc15;--terracotta:#f87171}
*{box-sizing:border-box;margin:0;padding:0}
html{background:#000;scroll-behavior:smooth}
body{color:var(--cream);font-family:Manrope,system-ui,sans-serif;-webkit-font-smoothing:antialiased;background:#000;overflow-x:hidden}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
#valley{position:fixed;inset:0;pointer-events:none;will-change:transform;transition:transform .1s linear}
.js-canvas-container{position:absolute;inset:0}
.js-canvas-container canvas{display:block;width:100%!important;height:100%!important}
.lil-gui{display:none!important}

/* Main UI Overlay */
.ui{position:relative;z-index:2;min-height:100vh;opacity:0;transition:opacity 1.6s ease}
.ui.on{opacity:1}
.ui a,.ui button,.ui input{pointer-events:auto}

header{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;padding:calc(24*var(--u)) calc(44*var(--u)) 0;z-index:10}
.logo{font-size:calc(26*var(--u));font-weight:500;letter-spacing:-.02em}
nav{display:flex;align-items:center;gap:calc(44*var(--u));font-size:calc(14.5*var(--u));font-weight:500;letter-spacing:.16em;text-transform:uppercase}
nav a:not(.pill){transition:opacity .2s}nav a:not(.pill):hover{opacity:.6}
.pill{display:inline-flex;align-items:center;height:calc(46*var(--u));padding:0 calc(26*var(--u));border-radius:99px;background:var(--cream);color:var(--dark);transition:transform .25s}
.pill:hover{transform:translateY(-1px)}

/* Hero Section */
.hero-section{position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 calc(20*var(--u))}
h1{font:400 calc(158*var(--u))/.92 Antonio,"Arial Narrow",sans-serif;letter-spacing:-.012em;white-space:nowrap}
.cap{margin-top:calc(48*var(--u));font-size:calc(20*var(--u));line-height:1.3}

/* Action Container & Center Morphing Pill */
.action-wrap{position:relative;margin-top:calc(34*var(--u));display:flex;flex-direction:column;align-items:center;justify-content:center}
.action-pill{
  position:relative;
  display:flex;
  align-items:center;
  width:calc(58*var(--u));
  height:calc(58*var(--u));
  border:1.5px solid var(--cream);
  border-radius:99px;
  background:transparent;
  overflow:hidden;
  box-sizing:border-box;
  pointer-events:auto;
  cursor:pointer;
  transition:width .45s cubic-bezier(.16,1,.3,1),background .35s ease,border-color .3s ease,box-shadow .35s ease;
}
.action-wrap.open .action-pill{
  width:calc(460*var(--u));
  max-width:calc(100vw - 40px);
  background:rgba(18,18,15,.88);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  box-shadow:0 12px 36px rgba(0,0,0,.5),0 0 24px rgba(245,239,226,.08);
  cursor:default;
}
.action-wrap:not(.open) .action-pill:hover{background:var(--cream);color:var(--dark)}
.action-wrap:not(.open) .action-pill:hover .initial-arrow{color:var(--dark)}

.initial-arrow{
  position:absolute;
  inset:0;
  display:grid;
  place-items:center;
  color:var(--cream);
  pointer-events:none;
  transition:opacity .25s ease,transform .25s ease,color .25s ease;
}
.initial-arrow svg{
  width:calc(22*var(--u));
  height:calc(22*var(--u));
  fill:none;
  stroke:currentColor;
  stroke-width:1.6;
  stroke-linecap:round;
  stroke-linejoin:round;
}
.action-wrap.open .initial-arrow{opacity:0;transform:scale(.6);pointer-events:none}

.paste-form{
  display:flex;
  align-items:center;
  width:100%;
  height:100%;
  padding:0 calc(7*var(--u)) 0 calc(20*var(--u));
  gap:calc(8*var(--u));
  box-sizing:border-box;
  opacity:0;
  pointer-events:none;
  transition:opacity .22s ease;
}
.action-wrap.open .paste-form{opacity:1;pointer-events:auto;transition:opacity .3s ease .12s}

.paste-input{
  flex:1;
  min-width:0;
  height:100%;
  background:transparent!important;
  border:none!important;
  outline:none!important;
  box-shadow:none!important;
  -webkit-appearance:none!important;
  appearance:none!important;
  color:var(--cream);
  font:500 calc(15*var(--u)) Manrope,system-ui,sans-serif;
  letter-spacing:-.01em;
  padding:0;
}
.paste-input::placeholder{color:rgba(245,239,226,.45);font-weight:400}
.paste-input::selection{background:var(--cream);color:var(--dark)}
.paste-input:focus,.paste-input:focus-visible{outline:none!important;box-shadow:none!important;border:none!important}

.paste-go{
  flex-shrink:0;
  display:grid;
  place-items:center;
  width:calc(44*var(--u));
  height:calc(44*var(--u));
  border-radius:50%;
  background:var(--cream);
  color:var(--dark);
  border:none;
  cursor:pointer;
  transition:transform .2s cubic-bezier(.16,1,.3,1),background .2s ease;
}
.paste-go:hover{transform:scale(1.06);background:#fff}
.paste-go:active{transform:scale(.96)}
.paste-go svg{width:calc(18*var(--u));height:calc(18*var(--u));fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}

.paste-close{
  flex-shrink:0;
  display:grid;
  place-items:center;
  width:calc(28*var(--u));
  height:calc(28*var(--u));
  border-radius:50%;
  color:rgba(245,239,226,.45);
  background:transparent;
  border:none;
  cursor:pointer;
  margin-right:calc(3*var(--u));
  transition:color .2s ease,transform .2s ease;
}
.paste-close:hover{color:var(--cream);transform:scale(1.15)}
.paste-close svg{width:calc(14*var(--u));height:calc(14*var(--u));fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}

/* Status message under input */
.input-status{
  position:absolute;
  top:calc(70*var(--u));
  display:none;
  align-items:center;
  gap:calc(8*var(--u));
  font-size:calc(13*var(--u));
  font-weight:500;
  padding:calc(8*var(--u)) calc(18*var(--u));
  border-radius:99px;
  background:rgba(21,21,16,.9);
  border:1px solid rgba(245,239,226,.25);
  backdrop-filter:blur(16px);
  animation:fadeUp .3s ease;
  white-space:nowrap;
  z-index:5;
}
.input-status.active{display:inline-flex}
.input-status.error{border-color:var(--terracotta);color:var(--terracotta)}
.input-status.loading{border-color:var(--cream);color:var(--cream)}
.spin-loader{width:calc(14*var(--u));height:calc(14*var(--u));border:2px solid rgba(245,239,226,.3);border-top-color:var(--cream);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

.corner{position:absolute;right:calc(44*var(--u));bottom:calc(44*var(--u));display:flex;align-items:center;gap:calc(18*var(--u));font-size:calc(12.5*var(--u));font-weight:500;letter-spacing:.16em;text-transform:uppercase}
.corner i{width:1px;height:calc(26*var(--u));background:rgba(245,239,226,.45)}
.sound{display:grid;place-items:center;width:calc(28*var(--u));height:calc(28*var(--u))}
.sound svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.sound .w{transition:opacity .3s}.sound[aria-pressed=false] .w{opacity:0}
.sound[aria-pressed=true] .x{opacity:0}

/* Scroll Hint Indicator */
.scroll-hint{
  position:absolute;
  bottom:calc(36*var(--u));
  left:50%;
  transform:translateX(-50%);
  display:none;
  flex-direction:column;
  align-items:center;
  gap:calc(8*var(--u));
  font-size:calc(12*var(--u));
  letter-spacing:.16em;
  text-transform:uppercase;
  color:rgba(245,239,226,.7);
  animation:bounce 2s infinite ease-in-out;
  cursor:pointer;
  transition:opacity .3s ease;
}
.scroll-hint svg{width:calc(18*var(--u));height:calc(18*var(--u));stroke:currentColor;fill:none;stroke-width:1.8}
.scroll-hint.show{display:flex}
@keyframes bounce{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,8px)}}

/* ===================================================
   RESULTS SECTION (Ecological Audit Display)
   =================================================== */
#resultsSection{
  display:none;
  position:relative;
  z-index:3;
  width:100%;
  max-width:calc(1080*var(--u));
  margin:0 auto;
  padding:calc(40*var(--u)) calc(30*var(--u)) calc(120*var(--u));
}
#resultsSection.visible{display:block}

.res-header{
  margin-bottom:calc(32*var(--u));
  display:flex;
  flex-direction:column;
  gap:calc(14*var(--u));
  opacity:0;
  transform:translateY(24px);
  transition:opacity .8s ease,transform .8s cubic-bezier(.16,1,.3,1);
}
.res-header.revealed{opacity:1;transform:translateY(0)}

.badge-row{display:flex;align-items:center;gap:calc(12*var(--u));flex-wrap:wrap}
.badge{
  display:inline-flex;
  align-items:center;
  gap:calc(6*var(--u));
  height:calc(32*var(--u));
  padding:0 calc(14*var(--u));
  border-radius:99px;
  font-size:calc(12*var(--u));
  font-weight:600;
  letter-spacing:.12em;
  text-transform:uppercase;
  background:rgba(245,239,226,.08);
  border:1px solid rgba(245,239,226,.2);
  color:var(--cream);
}
.badge.accent{background:var(--cream);color:var(--dark);border-color:var(--cream)}
.badge.confidence-high{border-color:var(--emerald);color:var(--emerald)}
.badge.confidence-medium{border-color:var(--amber);color:var(--amber)}
.badge.confidence-low{border-color:rgba(245,239,226,.45);color:var(--cream)}

.product-title{
  font:400 calc(44*var(--u))/1.1 Antonio,"Arial Narrow",sans-serif;
  letter-spacing:-.01em;
  color:var(--cream);
  max-width:calc(860*var(--u));
}

.source-meta{
  font-size:calc(14*var(--u));
  color:rgba(245,239,226,.65);
  display:flex;
  align-items:center;
  gap:calc(10*var(--u));
  flex-wrap:wrap;
}
.source-meta svg{width:calc(16*var(--u));height:calc(16*var(--u));stroke:currentColor;fill:none;stroke-width:1.8}

/* Low confidence hint banner */
.confidence-hint{
  display:flex;
  align-items:center;
  gap:calc(12*var(--u));
  padding:calc(14*var(--u)) calc(20*var(--u));
  border-radius:calc(16*var(--u));
  background:rgba(250,204,21,.08);
  border:1px solid rgba(250,204,21,.3);
  color:var(--cream);
  font-size:calc(13.5*var(--u));
  line-height:1.4;
  margin-top:calc(8*var(--u));
}
.confidence-hint svg{width:calc(20*var(--u));height:calc(20*var(--u));stroke:var(--amber);fill:none;flex-shrink:0;stroke-width:2}

/* Glass Card Component */
.glass-card{
  background:rgba(18,18,15,.85);
  border:1.5px solid var(--cream);
  border-radius:calc(28*var(--u));
  backdrop-filter:blur(24px);
  -webkit-backdrop-filter:blur(24px);
  padding:calc(36*var(--u));
  margin-bottom:calc(24*var(--u));
  box-shadow:0 16px 40px rgba(0,0,0,.5),0 0 24px rgba(245,239,226,.06);
  opacity:0;
  transform:translateY(28px);
  transition:opacity .8s ease,transform .8s cubic-bezier(.16,1,.3,1);
}
.glass-card.revealed{opacity:1;transform:translateY(0)}

/* Eco Score Hero Showcase */
.score-showcase{
  display:grid;
  grid-template-columns:auto 1fr;
  gap:calc(40*var(--u));
  align-items:center;
}
.score-dial{
  position:relative;
  width:calc(180*var(--u));
  height:calc(180*var(--u));
  display:grid;
  place-items:center;
}
.score-circle-svg{width:100%;height:100%;transform:rotate(-90deg)}
.score-circle-bg{fill:none;stroke:rgba(245,239,226,.12);stroke-width:10}
.score-circle-fill{fill:none;stroke:var(--cream);stroke-width:10;stroke-linecap:round;stroke-dasharray:502;stroke-dashoffset:502;transition:stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)}
.score-num{
  position:absolute;
  font:400 calc(80*var(--u))/1 Antonio,"Arial Narrow",sans-serif;
  color:var(--cream);
  letter-spacing:-.02em;
}
.score-num sub{font-size:calc(26*var(--u));color:rgba(245,239,226,.55);vertical-align:baseline;font-family:Manrope,sans-serif}

.verdict-info{display:flex;flex-direction:column;gap:calc(10*var(--u))}
.verdict-badge{
  display:inline-flex;
  align-items:center;
  gap:calc(10*var(--u));
  font-size:calc(15*var(--u));
  font-weight:600;
  letter-spacing:.14em;
  text-transform:uppercase;
  padding:calc(8*var(--u)) calc(20*var(--u));
  border-radius:99px;
  width:fit-content;
}
.verdict-badge.planet-friendly{background:rgba(74,222,128,.15);border:1.5px solid var(--emerald);color:var(--emerald)}
.verdict-badge.mixed{background:rgba(250,204,21,.15);border:1.5px solid var(--amber);color:var(--amber)}
.verdict-badge.harmful{background:rgba(248,113,113,.15);border:1.5px solid var(--terracotta);color:var(--terracotta)}
.verdict-badge svg{width:calc(18*var(--u));height:calc(18*var(--u));stroke:currentColor;fill:none;stroke-width:2}

.verdict-lead{font-size:calc(22*var(--u));font-weight:500;line-height:1.3;color:var(--cream)}
.verdict-sub{font-size:calc(14*var(--u));color:rgba(245,239,226,.65);letter-spacing:.04em}

/* Greenwashing Warning Callout */
.gw-card{
  background:rgba(250,204,21,.08);
  border:1.5px solid var(--amber);
  border-radius:calc(24*var(--u));
  padding:calc(28*var(--u)) calc(32*var(--u));
  margin-bottom:calc(24*var(--u));
  display:flex;
  gap:calc(20*var(--u));
  align-items:flex-start;
  box-shadow:0 0 30px rgba(250,204,21,.1);
  opacity:0;
  transform:translateY(28px);
  transition:opacity .8s ease,transform .8s cubic-bezier(.16,1,.3,1);
}
.gw-card.revealed{opacity:1;transform:translateY(0)}
.gw-icon{
  width:calc(36*var(--u));
  height:calc(36*var(--u));
  color:var(--amber);
  flex-shrink:0;
  display:grid;
  place-items:center;
}
.gw-icon svg{width:100%;height:100%;stroke:currentColor;fill:none;stroke-width:2}
.gw-content{display:flex;flex-direction:column;gap:calc(6*var(--u))}
.gw-title{font-size:calc(14*var(--u));font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--amber)}
.gw-body{font-size:calc(15*var(--u));line-height:1.5;color:var(--cream)}

/* Reasons Grid (Positive vs Negative Factors) */
.reasons-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:calc(24*var(--u));
  margin-bottom:calc(24*var(--u));
}
.reason-col{
  background:rgba(18,18,15,.85);
  border:1.5px solid rgba(245,239,226,.45);
  border-radius:calc(28*var(--u));
  backdrop-filter:blur(24px);
  -webkit-backdrop-filter:blur(24px);
  padding:calc(32*var(--u));
  opacity:0;
  transform:translateY(28px);
  transition:opacity .8s ease,transform .8s cubic-bezier(.16,1,.3,1);
}
.reason-col.revealed{opacity:1;transform:translateY(0)}
.reason-col.positive{border-color:rgba(74,222,128,.4)}
.reason-col.negative{border-color:rgba(248,113,113,.4)}

.reason-col-head{
  display:flex;
  align-items:center;
  gap:calc(10*var(--u));
  font-size:calc(14*var(--u));
  font-weight:600;
  letter-spacing:.16em;
  text-transform:uppercase;
  margin-bottom:calc(20*var(--u));
  padding-bottom:calc(14*var(--u));
  border-bottom:1px solid rgba(245,239,226,.15);
}
.reason-col.positive .reason-col-head{color:var(--emerald)}
.reason-col.negative .reason-col-head{color:var(--terracotta)}
.reason-col-head svg{width:calc(20*var(--u));height:calc(20*var(--u));stroke:currentColor;fill:none;stroke-width:2}

.factor-list{list-style:none;display:flex;flex-direction:column;gap:calc(14*var(--u))}
.factor-item{
  display:flex;
  align-items:flex-start;
  gap:calc(12*var(--u));
  font-size:calc(15*var(--u));
  line-height:1.45;
  color:var(--cream);
}
.factor-item svg{
  width:calc(18*var(--u));
  height:calc(18*var(--u));
  stroke:currentColor;
  fill:none;
  stroke-width:2;
  flex-shrink:0;
  margin-top:2px;
}
.reason-col.positive .factor-item svg{color:var(--emerald)}
.reason-col.negative .factor-item svg{color:var(--terracotta)}

/* Signals 4-Pillar Grid */
.signals-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:calc(16*var(--u));
  margin-bottom:calc(24*var(--u));
}
.signal-box{
  background:rgba(18,18,15,.75);
  border:1px solid rgba(245,239,226,.2);
  border-radius:calc(20*var(--u));
  padding:calc(22*var(--u));
  display:flex;
  flex-direction:column;
  gap:calc(10*var(--u));
  opacity:0;
  transform:translateY(28px);
  transition:opacity .8s ease,transform .8s cubic-bezier(.16,1,.3,1);
}
.signal-box.revealed{opacity:1;transform:translateY(0)}
.signal-tag{font-size:calc(11.5*var(--u));letter-spacing:.14em;text-transform:uppercase;color:rgba(245,239,226,.5);display:flex;align-items:center;gap:calc(6*var(--u))}
.signal-tag svg{width:calc(14*var(--u));height:calc(14*var(--u));stroke:currentColor;fill:none;stroke-width:1.8}
.signal-val{font-size:calc(15*var(--u));font-weight:500;color:var(--cream);line-height:1.35}

/* Greener Choice Studio Tip */
.tip-card{
  background:rgba(18,18,15,.85);
  border:1.5px solid var(--cream);
  border-radius:calc(24*var(--u));
  padding:calc(30*var(--u)) calc(34*var(--u));
  display:flex;
  align-items:center;
  gap:calc(24*var(--u));
  margin-bottom:calc(36*var(--u));
  opacity:0;
  transform:translateY(28px);
  transition:opacity .8s ease,transform .8s cubic-bezier(.16,1,.3,1);
}
.tip-card.revealed{opacity:1;transform:translateY(0)}
.tip-icon{
  width:calc(46*var(--u));
  height:calc(46*var(--u));
  border-radius:50%;
  border:1.5px solid var(--cream);
  display:grid;
  place-items:center;
  flex-shrink:0;
  color:var(--cream);
}
.tip-icon svg{width:calc(22*var(--u));height:calc(22*var(--u));stroke:currentColor;fill:none;stroke-width:1.8}
.tip-content{display:flex;flex-direction:column;gap:calc(6*var(--u))}
.tip-title{font-size:calc(13*var(--u));font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(245,239,226,.6)}
.tip-body{font-size:calc(16*var(--u));line-height:1.5;color:var(--cream)}

/* Bottom Actions */
.res-footer{
  display:flex;
  justify-content:center;
  margin-top:calc(20*var(--u));
  opacity:0;
  transform:translateY(24px);
  transition:opacity .8s ease,transform .8s cubic-bezier(.16,1,.3,1);
}
.res-footer.revealed{opacity:1;transform:translateY(0)}
.btn-reset{
  display:inline-flex;
  align-items:center;
  gap:calc(10*var(--u));
  height:calc(48*var(--u));
  padding:0 calc(28*var(--u));
  border:1.5px solid var(--cream);
  border-radius:99px;
  background:transparent;
  color:var(--cream);
  font-size:calc(13*var(--u));
  font-weight:600;
  letter-spacing:.14em;
  text-transform:uppercase;
  cursor:pointer;
  transition:background .25s ease,color .25s ease,transform .25s ease;
}
.btn-reset:hover{background:var(--cream);color:var(--dark);transform:translateY(-2px)}
.btn-reset svg{width:calc(16*var(--u));height:calc(16*var(--u));stroke:currentColor;fill:none;stroke-width:2}

.loader{position:fixed;inset:0;z-index:3;display:grid;place-items:center;background:#000;transition:opacity 1s ease;pointer-events:none}
.loader.gone{opacity:0}
.loader span{width:calc(9*var(--u));height:calc(9*var(--u));min-width:6px;min-height:6px;border-radius:50%;background:var(--cream);animation:pulse 1.2s ease-in-out infinite}
@keyframes pulse{50%{transform:scale(.4);opacity:.4}}
a:focus-visible,button:focus-visible{outline:2px solid var(--cream);outline-offset:3px}
input{outline:none!important;box-shadow:none!important}

@media (max-width:820px){
  :root{--u:1px}
  header{padding:18px 18px 0}
  nav a:not(.pill){display:none}
  .pill{height:40px;padding:0 18px;font-size:12px}
  .hero-section{left:0;right:0;padding:0 20px}
  .corner{left:20px;justify-content:center}
  h1{font-size:clamp(64px,19vw,96px);white-space:normal}
  .cap{font-size:17px}
  .action-wrap{margin-top:28px}
  .action-pill{width:52px;height:52px}
  .initial-arrow svg{width:20px;height:20px}
  .action-wrap.open .action-pill{width:min(calc(100vw - 36px), 360px);height:50px}
  .paste-form{padding:0 6px 0 16px;gap:6px}
  .paste-input{font-size:14px}
  .paste-go{width:38px;height:38px}
  .paste-go svg{width:16px;height:16px}
  .paste-close{width:24px;height:24px}
  .paste-close svg{width:12px;height:12px}
  .input-status{font-size:12px;top:60px;padding:6px 14px}
  .corner{right:20px;bottom:30px;font-size:11px}
  
  /* Results Mobile */
  #resultsSection{padding:20px 18px 80px}
  .product-title{font-size:32px}
  .score-showcase{grid-template-columns:1fr;text-align:center;justify-items:center;gap:20px}
  .verdict-info{align-items:center}
  .reasons-grid{grid-template-columns:1fr}
  .signals-grid{grid-template-columns:1fr 1fr}
  .tip-card{flex-direction:column;text-align:center;padding:24px 20px}
}
@media (prefers-reduced-motion:reduce){.loader span{animation:none}}
</style>
</head>
<body>
<div id="valley" aria-hidden="true"><div class="js-canvas-container"></div></div>
<div class="ui" id="ui">
  <header>
    <a class="logo" href="#" aria-label="Fernhollow">Fernhollow</a>
    <nav aria-label="Main"><a href="#resultsSection" id="navAudit">Audit</a><a href="#">Studio</a><a href="#">Journal</a><a class="pill" href="#actionWrap">Analyze link</a></nav>
  </header>

  <section class="hero-section" id="heroSection">
    <h1>Grown, not built.</h1>
    <p class="cap">Rooted in nature.<br>Built for what’s next.</p>
    
    <div class="action-wrap" id="actionWrap">
      <div class="action-pill" id="actionPill" role="button" tabindex="0" aria-label="Paste product link">
        <div class="initial-arrow" id="initialArrow" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 12h16M14 6l6 6-6 6"/></svg>
        </div>
        <form class="paste-form" id="pasteForm" autocomplete="off" onsubmit="return false;">
          <input type="text" class="paste-input" id="pasteInput" placeholder="Paste product link (Amazon, Flipkart, any store)…" aria-label="Product link" spellcheck="false" autocomplete="off" />
          <button type="submit" class="paste-go" id="pasteGo" aria-label="Analyze" title="Analyze product">
            <svg viewBox="0 0 24 24"><path d="M4 12h16M14 6l6 6-6 6"/></svg>
          </button>
          <button type="button" class="paste-close" id="pasteClose" aria-label="Clear" title="Clear">
            <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </form>
      </div>
      <div class="input-status" id="inputStatus"></div>
    </div>

    <div class="scroll-hint" id="scrollHint" onclick="document.getElementById('resultsSection').scrollIntoView({behavior:'smooth'})">
      <span>Scroll to view ecological audit</span>
      <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
    </div>
  </section>

  <!-- ==================== RESULTS SECTION ==================== -->
  <section id="resultsSection">
    <div class="res-header reveal-item" id="resHeader">
      <div class="badge-row">
        <span class="badge accent" id="resStore">Store</span>
        <span class="badge" id="resCategory">Category</span>
        <span class="badge" id="resConfidence">Confidence</span>
      </div>
      <h2 class="product-title" id="resTitle">Product Title</h2>
      <div class="source-meta">
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span id="resSourceText">Verified Source Metadata</span>
      </div>
      <div class="confidence-hint" id="resConfidenceHint" style="display:none">
        <svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        <div><strong>Preliminary detection:</strong> Confidence is based on URL product taxonomy. Paste full description or ingredients above for deeper audit.</div>
      </div>
    </div>

    <!-- Eco Score & Verdict Showcase Card -->
    <div class="glass-card reveal-item" id="scoreCard">
      <div class="score-showcase">
        <div class="score-dial">
          <svg class="score-circle-svg" viewBox="0 0 180 180">
            <circle class="score-circle-bg" cx="90" cy="90" r="80" />
            <circle class="score-circle-fill" id="scoreCircleFill" cx="90" cy="90" r="80" />
          </svg>
          <div class="score-num"><span id="resScoreNum">0</span><sub>/100</sub></div>
        </div>
        <div class="verdict-info">
          <div class="verdict-badge" id="resVerdictBadge">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span id="resVerdictText">Verdict</span>
          </div>
          <div class="verdict-lead" id="resVerdictLead">Ecological Lifecycle Assessment</div>
          <div class="verdict-sub" id="resScoringMethod">Combined Eco Index (60% AI Lifecycle + 40% Material Signals)</div>
        </div>
      </div>
    </div>

    <!-- Greenwashing Warning Card (Conditional) -->
    <div class="gw-card reveal-item" id="gwCard" style="display:none">
      <div class="gw-icon">
        <svg viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
      </div>
      <div class="gw-content">
        <div class="gw-title">Greenwashing Alert</div>
        <div class="gw-body" id="resGwWarning">Vague environmental marketing claims detected without verified certifications.</div>
      </div>
    </div>

    <!-- Reasons Grid (Positive vs Negative Factors) -->
    <div class="reasons-grid">
      <div class="reason-col positive reveal-item" id="posCol">
        <div class="reason-col-head">
          <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
          <span>Ecological Strengths</span>
        </div>
        <ul class="factor-list" id="resPosList"></ul>
      </div>

      <div class="reason-col negative reveal-item" id="negCol">
        <div class="reason-col-head">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
          <span>Environmental Concerns</span>
        </div>
        <ul class="factor-list" id="resNegList"></ul>
      </div>
    </div>

    <!-- 4 Pillars of Materials & Circularity Signals -->
    <div class="signals-grid">
      <div class="signal-box reveal-item">
        <div class="signal-tag">
          <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          <span>Materials</span>
        </div>
        <div class="signal-val" id="resSignalMaterials">Bamboo, Cotton</div>
      </div>
      <div class="signal-box reveal-item">
        <div class="signal-tag">
          <svg viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Circularity</span>
        </div>
        <div class="signal-val" id="resSignalReuse">Reusable, Washable</div>
      </div>
      <div class="signal-box reveal-item">
        <div class="signal-tag">
          <svg viewBox="0 0 24 24"><path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
          <span>Packaging</span>
        </div>
        <div class="signal-val" id="resSignalPackaging">Plastic-Free Cardboard</div>
      </div>
      <div class="signal-box reveal-item">
        <div class="signal-tag">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          <span>Credentials</span>
        </div>
        <div class="signal-val" id="resSignalCerts">GOTS, FSC Mix</div>
      </div>
    </div>

    <!-- Greener Choice Studio Recommendation -->
    <div class="tip-card reveal-item" id="tipCard">
      <div class="tip-icon">
        <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <div class="tip-content">
        <div class="tip-title">Studio Greener Choice Guidance</div>
        <div class="tip-body" id="resTip">Consider certified organic alternatives to eliminate downstream microplastic shedding.</div>
      </div>
    </div>

    <!-- Reset / Search another -->
    <div class="res-footer reveal-item">
      <button type="button" class="btn-reset" onclick="resetToSearch()">
        <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        <span>Analyze Another Product</span>
      </button>
    </div>
  </section>

  <div class="corner"><span>Scroll to wander</span><i></i>
    <button class="sound" id="sound" aria-pressed="false" aria-label="Ambient sound"><svg viewBox="0 0 24 24"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5Z"/><path class="w" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/><path class="x" d="m16 10 4 4m0-4-4 4"/></svg></button>
  </div>
</div>
<div class="loader" id="loader"><span></span></div>
${scriptTags}
<script>
// boot original flower valley from its own bundle
self.webpackChunk_N_E.push([[90001],{},function(r){window.__req=r}]);
__req(889);
const Valley=window.__GE.et(),audioStore=window.__GE.Y();
let introShown=false;
const valley=new Valley(document.getElementById('valley'),
  ()=>document.getElementById('loader').classList.add('gone'),
  ()=>{if(!introShown){introShown=true;document.getElementById('ui').classList.add('on')}});
audioStore().initAudio();
const sound=document.getElementById('sound');
sound.onclick=()=>{const s=audioStore();if(!s.isInitialized)return;const muted=s.toggleMute();sound.setAttribute('aria-pressed',String(!muted))};

// Center morphing input & interaction
const actionWrap=document.getElementById('actionWrap');
const actionPill=document.getElementById('actionPill');
const pasteForm=document.getElementById('pasteForm');
const pasteInput=document.getElementById('pasteInput');
const pasteGo=document.getElementById('pasteGo');
const pasteClose=document.getElementById('pasteClose');
const inputStatus=document.getElementById('inputStatus');
const scrollHint=document.getElementById('scrollHint');
const resultsSection=document.getElementById('resultsSection');
const valleyEl=document.getElementById('valley');

let isHovered=false;
let isFocused=false;
let closeTimer=null;
let isAnalyzing=false;

function openBox(autoFocus=true){
  clearTimeout(closeTimer);
  actionWrap.classList.add('open');
  valley.startHoverTransition();
  if(autoFocus){
    setTimeout(()=>{
      if(actionWrap.classList.contains('open') && !isAnalyzing){
        pasteInput.focus();
      }
    }, 140);
  }
}

function closeBox(){
  if(isFocused || isAnalyzing || pasteInput.value.trim().length > 0) return;
  actionWrap.classList.remove('open');
  pasteInput.blur();
  valley.stopHoverTransition();
}

function forceCloseBox(){
  isFocused=false;
  isHovered=false;
  clearTimeout(closeTimer);
  pasteInput.value='';
  actionWrap.classList.remove('open');
  pasteInput.blur();
  hideStatus();
  valley.stopHoverTransition();
}

actionWrap.addEventListener('pointerenter',()=>{
  isHovered=true;
  openBox(true);
});

actionWrap.addEventListener('pointerleave',()=>{
  isHovered=false;
  closeTimer=setTimeout(()=>{
    if(!isHovered && !isFocused && !isAnalyzing && pasteInput.value.trim().length === 0){
      closeBox();
    }
  }, 220);
});

actionPill.addEventListener('click',(e)=>{
  if(!actionWrap.classList.contains('open')){
    e.preventDefault();
    openBox(true);
  }
});

pasteInput.addEventListener('focus',()=>{
  isFocused=true;
  clearTimeout(closeTimer);
  actionWrap.classList.add('open');
  valley.startHoverTransition();
});

pasteInput.addEventListener('blur',()=>{
  isFocused=false;
  if(!isHovered && !isAnalyzing && pasteInput.value.trim().length === 0){
    closeTimer=setTimeout(()=>{
      if(!isHovered && !isFocused && !isAnalyzing && pasteInput.value.trim().length === 0){
        closeBox();
      }
    }, 180);
  }
});

pasteClose.addEventListener('click',(e)=>{
  e.preventDefault();
  e.stopPropagation();
  forceCloseBox();
});

window.addEventListener('keydown',(e)=>{
  if(e.key==='Escape' && actionWrap.classList.contains('open') && !isAnalyzing){
    forceCloseBox();
  }
});

document.addEventListener('pointerdown',(e)=>{
  if(actionWrap.classList.contains('open') && !actionWrap.contains(e.target) && !isAnalyzing){
    if(pasteInput.value.trim().length === 0){
      forceCloseBox();
    }
  }
});

function showStatus(text, type='loading'){
  inputStatus.className = 'input-status active ' + type;
  if(type==='loading'){
    inputStatus.innerHTML = '<span class="spin-loader"></span><span>' + text + '</span>';
  } else {
    inputStatus.innerHTML = '<span>' + text + '</span>';
  }
}

function hideStatus(){
  inputStatus.className = 'input-status';
  inputStatus.innerHTML = '';
}

// Parallax scrolling on background valley canvas
window.addEventListener('scroll',()=>{
  const scrollY = window.scrollY;
  if(valleyEl){
    valleyEl.style.transform = 'translateY(' + (scrollY * 0.22) + 'px)';
  }
  // Reveal animations
  document.querySelectorAll('.reveal-item').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.88){
      el.classList.add('revealed');
    }
  });
},{passive:true});

// Trigger audit analysis
async function runAnalysis(url){
  isAnalyzing=true;
  showStatus('Collecting product signals & auditing lifecycle…', 'loading');
  pasteGo.disabled = true;
  pasteGo.innerHTML = '<span class="spin-loader" style="width:16px;height:16px;border-width:2px"></span>';

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ url: url })
    });
    const data = await res.json();

    if(!res.ok || !data.success){
      showStatus(data.error || 'Store connection restricted or invalid link.', 'error');
      setTimeout(hideStatus, 4000);
      return;
    }

    hideStatus();
    renderResults(data);

    // Reveal results and smooth scroll
    resultsSection.classList.add('visible');
    scrollHint.classList.add('show');

    setTimeout(()=>{
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 250);

  } catch(err) {
    showStatus('Unable to reach analysis server. Please check connection.', 'error');
    setTimeout(hideStatus, 4000);
  } finally {
    isAnalyzing=false;
    pasteGo.disabled = false;
    pasteGo.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';
  }
}

function renderResults(data){
  // Store, Category, Title
  document.getElementById('resStore').textContent = data.store || 'Online Store';
  document.getElementById('resCategory').textContent = data.category || 'General';
  document.getElementById('resTitle').textContent = data.product_name || 'Product';
  
  // Confidence badge
  const confEl = document.getElementById('resConfidence');
  const conf = data.confidence || 'Medium';
  confEl.textContent = conf + ' Confidence';
  confEl.className = 'badge confidence-' + conf.toLowerCase();

  // Source text
  document.getElementById('resSourceText').textContent = data.source_reason || ('Source: ' + data.source);

  // Confidence hint
  const hintEl = document.getElementById('resConfidenceHint');
  if(conf.toLowerCase() === 'low' || data.source === 'title'){
    hintEl.style.display = 'flex';
  } else {
    hintEl.style.display = 'none';
  }

  // Score Dial & Number
  const score = Math.max(0, Math.min(100, data.eco_score || 50));
  document.getElementById('resScoreNum').textContent = score;
  
  const circleFill = document.getElementById('scoreCircleFill');
  const circumference = 2 * Math.PI * 80; // ~502
  const offset = circumference - (score / 100) * circumference;
  circleFill.style.strokeDashoffset = offset;

  // Verdict
  const verdict = data.verdict || (score >= 70 ? 'Planet-friendly' : (score >= 45 ? 'Mixed' : 'Harmful'));
  const vBadge = document.getElementById('resVerdictBadge');
  const vText = document.getElementById('resVerdictText');
  const vLead = document.getElementById('resVerdictLead');

  vBadge.className = 'verdict-badge';
  if(verdict.toLowerCase().includes('friendly') || score >= 70){
    vBadge.classList.add('planet-friendly');
    vBadge.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Planet-friendly</span>';
    vLead.textContent = 'Commendable Sustainable Benchmark';
    circleFill.style.stroke = 'var(--emerald)';
  } else if(verdict.toLowerCase().includes('mixed') || score >= 45){
    vBadge.classList.add('mixed');
    vBadge.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>Mixed Impact</span>';
    vLead.textContent = 'Contains Notable Ecological Tradeoffs';
    circleFill.style.stroke = 'var(--amber)';
  } else {
    vBadge.classList.add('harmful');
    vBadge.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><span>High Impact / Harmful</span>';
    vLead.textContent = 'Significant Environmental Footprint Detected';
    circleFill.style.stroke = 'var(--terracotta)';
  }

  document.getElementById('resScoringMethod').textContent = data.scoring_method || 'Combined Eco Score (60% AI Lifecycle + 40% Material Signals)';

  // Greenwashing Warning
  const gwCard = document.getElementById('gwCard');
  if(data.has_greenwashing && data.greenwash_warning){
    gwCard.style.display = 'flex';
    document.getElementById('resGwWarning').textContent = data.greenwash_warning;
  } else {
    gwCard.style.display = 'none';
  }

  // Positives & Negatives List
  const posList = document.getElementById('resPosList');
  posList.innerHTML = '';
  (data.positive_factors || []).forEach(f=>{
    const li = document.createElement('li');
    li.className = 'factor-item';
    li.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>' + f + '</span>';
    posList.appendChild(li);
  });

  const negList = document.getElementById('resNegList');
  negList.innerHTML = '';
  (data.negative_factors || []).forEach(f=>{
    const li = document.createElement('li');
    li.className = 'factor-item';
    li.innerHTML = '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg><span>' + f + '</span>';
    negList.appendChild(li);
  });

  // 4 Pillar Signals
  const sigs = data.signals || {};
  document.getElementById('resSignalMaterials').textContent = Array.isArray(sigs.materials) ? sigs.materials.map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(', ') : 'Standard';
  document.getElementById('resSignalReuse').textContent = Array.isArray(sigs.reusability) ? sigs.reusability.map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(', ') : 'Standard';
  document.getElementById('resSignalPackaging').textContent = Array.isArray(sigs.packaging) ? sigs.packaging.map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(', ') : 'Standard';
  document.getElementById('resSignalCerts').textContent = Array.isArray(sigs.certifications) ? sigs.certifications.join(', ') : 'None Detected';

  // Studio Tip
  document.getElementById('resTip').textContent = data.greener_tip || 'Opt for third-party certified natural materials to maximize circular longevity.';

  // Trigger reveal on visible items
  setTimeout(()=>{
    document.querySelectorAll('#resultsSection .reveal-item').forEach(el=>el.classList.add('revealed'));
  }, 100);
}

function resetToSearch(){
  window.scrollTo({top: 0, behavior: 'smooth'});
  setTimeout(()=>{
    pasteInput.value = '';
    openBox(true);
  }, 450);
}

pasteForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const val = pasteInput.value.trim();
  if(!val){ pasteInput.focus(); return; }
  runAnalysis(val);
});
pasteGo.addEventListener('click',(e)=>{
  e.preventDefault();
  const val = pasteInput.value.trim();
  if(!val){ pasteInput.focus(); return; }
  runAnalysis(val);
});
</script>
</body>
</html>`;

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully generated index.html!');
console.log('File size:', (Buffer.byteLength(html, 'utf8') / (1024 * 1024)).toFixed(2), 'MB');
