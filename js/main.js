/* DAVKARIX — comportamiento del sitio */
const CONFIG = {
  WHATSAPP: '525539383342',
  EMAIL: 'davkarix.oficial@gmail.com',
  // Si creas un formulario en Formspree (formspree.io) pega aquí su URL, ej. 'https://formspree.io/f/xxxxxxx'
  // Con eso el formulario envía directo a tu correo. Si queda vacío, usa WhatsApp / correo.
  FORM_ENDPOINT: '',
  // Medición de visitas respetuosa con la privacidad (sin cookies): crea una cuenta gratis en goatcounter.com
  // y pon aquí tu código, ej. 'davkarix'. Si queda vacío, no se mide nada.
  GOATCOUNTER: ''
};

/* Menú móvil */
(function(){
  const btn = document.getElementById('menuBtn'), nav = document.getElementById('navLinks');
  if(!btn||!nav) return;
  btn.addEventListener('click', ()=>{ const o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  nav.addEventListener('click', e=>{ if(e.target.tagName==='A'){ nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }});
})();

/* Aparición suave */
(function(){
  const els = document.querySelectorAll('.rv');
  if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('in')); return; }
  const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }}),{threshold:.12});
  els.forEach(e=>io.observe(e));
})();

/* Analítica opcional sin cookies (GoatCounter) */
(function(){
  if(!CONFIG.GOATCOUNTER) return;
  const s = document.createElement('script');
  s.async = true; s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://'+CONFIG.GOATCOUNTER+'.goatcounter.com/count');
  document.head.appendChild(s);
})();

/* Formulario de cotización */
(function(){
  const form = document.getElementById('cotForm'); if(!form) return;
  const t0 = Date.now();
  const msg = document.getElementById('formMsg');
  const q = new URLSearchParams(location.search);
  if(q.get('servicio')){ const sel = form.elements.servicio; [...sel.options].forEach(o=>{ if(o.value===q.get('servicio')) sel.value=o.value; }); }

  const valid = ()=>{
    let ok = true;
    const rules = {
      nombre: v=>v.trim().length>=2,
      correo: v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      servicio: v=>!!v,
      mensaje: v=>v.trim().length>=10,
      acepto: (v,el)=>el.checked
    };
    Object.keys(rules).forEach(k=>{
      const el = form.elements[k]; const f = el.closest('.field');
      const good = rules[k](el.value, el);
      f.classList.toggle('bad', !good); if(!good) ok = false;
    });
    return ok;
  };
  const texto = ()=>{
    const g = k=>form.elements[k].value.trim();
    return `Hola DAVKARIX, quiero solicitar una cotización.\n\nNombre: ${g('nombre')}\nEmpresa: ${g('empresa')||'—'}\nCorreo: ${g('correo')}\nTeléfono: ${g('telefono')||'—'}\nServicio: ${g('servicio')}\nPresupuesto aproximado: ${g('presupuesto')||'No definido'}\n\n${g('mensaje')}`;
  };
  const show = (ok, t)=>{ msg.className = 'form-msg show '+(ok?'ok':'fail'); msg.textContent = t; msg.scrollIntoView({block:'nearest',behavior:'smooth'}); };
  const spam = ()=> form.elements.website.value !== '' || (Date.now()-t0) < 3000;

  async function enviar(canal){
    if(spam()){ show(false,'Espera unos segundos y vuelve a intentar.'); return; }
    if(!valid()){ show(false,'Revisa los campos marcados en rojo.'); return; }
    const body = texto();
    if(canal==='wa'){
      window.open('https://wa.me/'+CONFIG.WHATSAPP+'?text='+encodeURIComponent(body),'_blank','noopener');
      show(true,'Se abrió WhatsApp con tu solicitud lista. Solo presiona enviar.'); return;
    }
    if(canal==='mail'){
      location.href = 'mailto:'+CONFIG.EMAIL+'?subject='+encodeURIComponent('Solicitud de cotización — '+form.elements.servicio.value)+'&body='+encodeURIComponent(body);
      show(true,'Se abrió tu correo con la solicitud lista. Solo presiona enviar.'); return;
    }
    // envío directo (si hay endpoint configurado)
    try{
      const r = await fetch(CONFIG.FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({nombre:form.elements.nombre.value,empresa:form.elements.empresa.value,correo:form.elements.correo.value,telefono:form.elements.telefono.value,servicio:form.elements.servicio.value,presupuesto:form.elements.presupuesto.value,mensaje:form.elements.mensaje.value})});
      if(!r.ok) throw new Error();
      form.reset(); show(true,'¡Gracias! Recibimos tu solicitud y te responderemos pronto.');
    }catch(e){ show(false,'No pudimos enviarla. Usa el botón de WhatsApp o escríbenos a '+CONFIG.EMAIL); }
  }
  form.addEventListener('submit', e=>{ e.preventDefault(); enviar(CONFIG.FORM_ENDPOINT?'direct':'wa'); });
  form.querySelectorAll('[data-canal]').forEach(b=>b.addEventListener('click',()=>enviar(b.dataset.canal)));
  form.querySelectorAll('input,select,textarea').forEach(el=>el.addEventListener('input',()=>el.closest('.field')&&el.closest('.field').classList.remove('bad')));
})();

/* Demo de inventario (datos ficticios) */
(function(){
  const tb = document.getElementById('demoBody'); if(!tb) return;
  const D = [
    ['Laptop 14"','Ana Morales','Oficina central','Activo','INV-000101'],
    ['Monitor 24"','Luis Herrera','Contabilidad','Activo','INV-000102'],
    ['Impresora láser','Sofía Ramírez','Recepción','Revisión','INV-000103'],
    ['Escritorio ejecutivo','Carlos Vega','Dirección','Activo','INV-000104'],
    ['Proyector','Marta Núñez','Sala de juntas','Activo','INV-000105'],
    ['Silla ergonómica','Luis Herrera','Contabilidad','Activo','INV-000106'],
    ['Teléfono IP','Ana Morales','Oficina central','Revisión','INV-000107'],
    ['Router','Carlos Vega','Servidores','Activo','INV-000108']
  ];
  const q = document.getElementById('demoQ'), cnt = document.getElementById('demoCount');
  const ficha = document.getElementById('ficha'), fc = document.getElementById('fichaBody');
  const esc = s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function draw(){
    const t = q.value.trim().toLowerCase();
    const rows = D.filter(r=>!t||r.join(' ').toLowerCase().includes(t));
    tb.innerHTML = rows.map((r,i)=>`<tr tabindex="0" data-i="${D.indexOf(r)}"><td>${esc(r[4])}</td><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td><span class="estado ${r[3]==='Activo'?'a':'r'}">${r[3]}</span></td></tr>`).join('') || '<tr><td colspan="4">Sin resultados</td></tr>';
    cnt.textContent = rows.length+' de '+D.length+' bienes (datos ficticios)';
  }
  function open(i){
    const r = D[i]; if(!r) return;
    fc.innerHTML = `<h3>${esc(r[0])}</h3><div class="qrbox" role="img" aria-label="Código QR ilustrativo"></div><dl><dt>Inventario</dt><dd>${esc(r[4])}</dd><dt>Resguardo</dt><dd>${esc(r[1])}</dd><dt>Área</dt><dd>${esc(r[2])}</dd><dt>Estado</dt><dd>${esc(r[3])}</dd></dl><p style="font-size:12.5px;color:#4F6578">Así se vería la ficha al escanear el QR del bien. QR ilustrativo, datos ficticios.</p>`;
    ficha.classList.add('open');
  }
  tb.addEventListener('click',e=>{ const tr = e.target.closest('tr[data-i]'); if(tr) open(+tr.dataset.i); });
  tb.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const tr = e.target.closest('tr[data-i]'); if(tr) open(+tr.dataset.i); }});
  q.addEventListener('input',draw);
  ficha.addEventListener('click',e=>{ if(e.target===ficha||e.target.classList.contains('ficha-x')) ficha.classList.remove('open'); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') ficha.classList.remove('open'); });
  draw();
})();

/* Orbe de luces (IA) — partículas en esfera giratoria */
(function(){
  const cs = document.querySelectorAll('canvas.orb'); if(!cs.length) return;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  cs.forEach(cv=>{
    const ctx = cv.getContext('2d'); if(!ctx) return;
    const N = 260, P = [];
    for(let i=0;i<N;i++){ const y = 1-2*(i+.5)/N, r = Math.sqrt(1-y*y), th = i*2.399963; P.push([Math.cos(th)*r, y, Math.sin(th)*r, Math.random()*6.28]); }
    let W=0,H=0,t=0,vis=true;
    function size(){ const d = Math.min(window.devicePixelRatio||1,2), b = cv.getBoundingClientRect(); W = cv.width = Math.max(1,b.width*d); H = cv.height = Math.max(1,b.height*d); }
    size(); addEventListener('resize', size);
    if('IntersectionObserver' in window) new IntersectionObserver(e=>{ vis = e[0].isIntersecting; }).observe(cv);
    function draw(){
      if(vis){
        ctx.clearRect(0,0,W,H);
        const cx=W/2, cy=H/2, R=Math.min(W,H)*.43;
        const g = ctx.createRadialGradient(cx,cy,R*.1,cx,cy,R*1.25);
        g.addColorStop(0,'rgba(45,212,196,.28)'); g.addColorStop(.6,'rgba(0,184,169,.10)'); g.addColorStop(1,'rgba(0,184,169,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,R*1.25,0,6.283); ctx.fill();
        const ca=Math.cos(t), sa=Math.sin(t), tilt=.35, ct=Math.cos(tilt), st=Math.sin(tilt);
        const pts = P.map(p=>{ let x=p[0]*ca+p[2]*sa, z=-p[0]*sa+p[2]*ca, y=p[1]*ct-z*st; z=p[1]*st+z*ct; return [x,y,z,p[3]]; }).sort((a,b)=>a[2]-b[2]);
        for(const p of pts){
          const k=(p[2]+1)/2, tw=.6+.4*Math.sin(t*4+p[3]), s=(.9+k*2.2)*(W/520);
          ctx.globalAlpha=(.15+k*.85)*tw; ctx.fillStyle = k>.8 ? '#FFFFFF' : '#2DD4C4';
          ctx.beginPath(); ctx.arc(cx+p[0]*R, cy+p[1]*R, s, 0, 6.283); ctx.fill();
        }
        ctx.globalAlpha=1;
        if(!reduce) t+=.004;
      }
      if(!reduce) requestAnimationFrame(draw);
    }
    draw();
  });
})();
