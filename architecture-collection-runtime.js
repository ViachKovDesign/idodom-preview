'use strict';
(() => {
 if(!document.body.classList.contains('architecture-store'))return;
 const products=window.IDODOM_PRODUCTS,q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 const categories={tables:'Столы',sculptures:'Полигональные скульптуры',upholstery:'Мягкая мебель',chairs:'Стулья и кресла'};
 const views={architecture:'Architecture',forma:'Forma',volume:'Volume',contour:'Contour'};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let category='tables',view='architecture',model='',finish='',item='',opener=null;
 const byId=new Map(products.map(p=>[p.id,p])),aliases=new Map(products.flatMap(p=>p.aliases.map(id=>[id,p.id])));
 function url(id=item){const p=new URLSearchParams({category,view,concept:'gallery'});if(model)p.set('model',model);if(finish)p.set('finish',finish);if(id)p.set('item',id);return 'architecture-collection.html?'+p;}
 function read(){const p=new URLSearchParams(location.search);category=categories[p.get('category')]?p.get('category'):'tables';view=views[p.get('view')]?p.get('view'):'architecture';model=p.get('model')||'';finish=p.get('finish')||'';item=aliases.get(p.get('item'))||p.get('item')||'';if(!byId.has(item))item='';if(item)category=byId.get(item).category;}
 const descriptions={tables:'Выразительные основания, фактуры и пропорции для ваших встреч.',sculptures:'Гранёные силуэты и предметы с собственным характером.',upholstery:'Спокойные линии и мягкий центр вашего пространства.',chairs:'Посадка, форма и фактура — найдите своё сочетание.'};
 // видео шапки раздела — по теме: столы — стол Бронкс, стулья — Laos, скульптуры — «Горилла» (как на главной);
 // для мягкой мебели видео нет — кадр «1-диван-сцена» (neutral). Без кнопки паузы: autoplay muted loop playsinline + poster.
 const heroMedia={tables:{video:'assets/table.mp4',poster:'assets/table-wide.jpg'},chairs:{video:'assets/collection/laos.mp4',poster:'assets/collection/laos-poster.jpg'},sculptures:{video:'assets/home/hero-gorilla.mp4',poster:'assets/home/hero-gorilla-poster-1600.webp'},upholstery:{video:'',poster:'assets/home/cat-upholstery-neutral-1536.webp'}};
 function video(){const movie=q('#hero-video');const m=heroMedia[category];q('#category-hero-title').textContent=categories[category];q('#category-hero-description').textContent=descriptions[category];q('#category-poster').src=m.poster;movie.hidden=!m.video;if(!m.video){movie.pause();movie.removeAttribute('src');movie.removeAttribute('poster');return;}if(movie.getAttribute('src')!==m.video){movie.src=m.video;movie.poster=m.poster;movie.load();}if(item||document.body.classList.contains('no-motion'))movie.pause();else movie.play().catch(()=>{});}
 function picture(p){return '<figure><img src="'+esc(p.src)+'" alt="'+esc(p.title)+'" loading="lazy"></figure>';}
 function render(){
  q('#catalog').dataset.categoryKey=category;q('#category-heading').textContent=categories[category];
  qa('[data-category]').forEach(a=>{a.setAttribute('aria-current',String(a.dataset.category===category));a.href='architecture-collection.html?category='+a.dataset.category+'&view='+view;});
  const candidates=products.filter(p=>p.category===category);
  const models=[...new Set(candidates.map(p=>p.title))],finishes=[...new Set(candidates.flatMap(p=>p.gallery.map(x=>x.finish)).filter(Boolean))];
  if(!models.includes(model))model='';if(!finishes.includes(finish))finish='';
  q('#model-field').hidden=category!=='chairs';q('#finish-field').hidden=category!=='sculptures';
  q('#model-filter').innerHTML='<option value="">Любая модель</option>'+models.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('');q('#model-filter').value=model;
  q('#finish-filter').innerHTML='<option value="">Любая отделка</option>'+finishes.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('');q('#finish-filter').value=finish;
  const selected=candidates.filter(p=>(!model||p.title===model)&&(!finish||p.gallery.some(x=>x.finish===finish)));
  q('#media-grid').innerHTML=selected.map(p=>'<article class="arch-product-card" data-product-id="'+p.id+'"><a href="'+esc(url(p.id))+'" data-product-link="'+p.id+'">'+picture(p)+'<div class="arch-product-card-copy"><p class="eyebrow">'+categories[p.category]+'</p><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+'</p></div></a><button class="arch-add" type="button" data-arch-add="'+p.id+'" aria-label="Добавить в корзину: '+esc(p.title)+'">В корзину</button></article>').join('');
  q('#shop-count').textContent='Предметов в подборке: '+selected.length;q('#shop-empty').hidden=selected.length!==0;
  q('#catalog').hidden=!!item;q('.arch-category-hero').hidden=!!item;q('#product-detail').hidden=!item;
  if(item)renderProduct(byId.get(item));
  video();
 }
 let configObserver=null;
 function configurator(p){
  const section=q('#product-config'),mount=q('#architecture-configurator-mount');
  if(configObserver){configObserver.disconnect();configObserver=null;}
  mount.dataset.product=p.id;section.hidden=!p.configurator;
  if(!p.configurator){mount.replaceChildren();return;}
  // стол — 3D-конфигуратор; стулья и диван — демо конфигуратора мебели по фото (configurator/furniture.html)
  const furniture=p.configurator.includes('furniture');
  q('#product-config-eyebrow').textContent=furniture?'КОНФИГУРАТОР / ДЕМО':'3D-КОНФИГУРАТОР';
  q('#product-config-text').textContent=furniture?'Выберите ткани обивки и ножки — фото исполнения обновится сразу. Готовую конфигурацию можно отправить нам заявкой, цену назовёт менеджер.':'Выберите форму и размер столешницы, материал, отделку основания — модель и цена обновятся сразу. Готовую конфигурацию можно отправить нам заявкой.';
  if(mount.querySelector('iframe')?.dataset.src===p.configurator)return;
  mount.innerHTML='<div class="arch-product-config-placeholder"><svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="m60 12 42 24v48l-42 24-42-24V36zM18 36l42 24 42-24M60 60v48"/></svg><span>Загружаем конфигуратор…</span></div>';
  const load=()=>{const f=document.createElement('iframe');f.src=p.configurator;f.dataset.src=p.configurator;f.title=(furniture?'Конфигуратор: ':'3D-конфигуратор: ')+p.title;f.referrerPolicy='no-referrer-when-downgrade';f.setAttribute('allow','fullscreen');f.addEventListener('load',()=>mount.querySelector('.arch-product-config-placeholder')?.remove(),{once:true});mount.appendChild(f);};
  if('IntersectionObserver' in window){configObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){configObserver.disconnect();configObserver=null;load();}},{rootMargin:'300px 0px'});configObserver.observe(mount);}else load();
 }
 const ceramics=window.IDODOM_CERAMICS||[];
 let productFinish='';// выбранная отделка в открытой карточке
 function renderProduct(p){
  q('#product-title').textContent=p.title;q('#product-category').textContent=categories[p.category];q('#product-description').textContent=p.description;
  q('#product-specs').innerHTML=p.details.map(([label,value])=>'<div><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>').join('');
  q('#product-add').dataset.archAdd=p.id;configurator(p);
  // отделки модели (скульптуры: обжиг / шлифовка / полировка / окраска / золото) — варианты внутри карточки
  const finishes=[...new Set(p.gallery.map(x=>x.finish).filter(Boolean))];
  productFinish=finishes.includes(finish)?finish:'';
  const box=q('#product-finishes');box.hidden=finishes.length<2;
  box.innerHTML=finishes.length<2?'':['',...finishes].map(f=>'<button type="button" data-product-finish="'+esc(f)+'" aria-pressed="'+(f===productFinish)+'">'+esc(f||'Все отделки')+'</button>').join('');
  renderThumbs(p);q('#product-back').href=url('');
  // столы: блок «Столешница: керамика 260×120» — образцы декоров (данные — window.IDODOM_CERAMICS, страница materials.html)
  const ceramicsBox=q('#product-ceramics');ceramicsBox.hidden=!(p.category==='tables'&&ceramics.length);
  if(!ceramicsBox.hidden&&!q('#product-ceramics-grid').children.length)q('#product-ceramics-grid').innerHTML=ceramics.map(d=>{const cover=d.slab||d.interior||d.video;
   return '<button type="button" class="arch-ceramic-swatch" data-ceramic="'+esc(d.slug)+'" aria-label="Декор '+esc(d.name)+' — смотреть крупно"><img src="'+esc(cover.thumb||cover.poster)+'" alt="" loading="lazy"><span>'+esc(d.name)+'</span></button>';}).join('');
 }
 // крупный просмотр декора: плита и интерьерный рендер (у декора без фото — видео)
 function openCeramic(slug){const d=ceramics.find(x=>x.slug===slug);if(!d)return;const dlg=q('#ceramic-dialog');
  q('#ceramic-dialog-title').textContent=d.name;q('#ceramic-dialog-link').href='materials.html#'+d.slug;
  const fig=(x,cap)=>'<figure><img src="'+esc(x.src)+'" alt="'+esc(d.name+' — '+cap)+'"><figcaption>'+cap+'</figcaption></figure>';
  q('#ceramic-dialog-body').innerHTML=(d.slab?fig(d.slab,'плита'):'')+(d.interior?fig(d.interior,'в интерьере'):'')+(!d.slab&&!d.interior&&d.video?'<figure><video controls muted playsinline preload="metadata" poster="'+esc(d.video.poster)+'"><source src="'+esc(d.video.src)+'" type="video/mp4"></video><figcaption>видео</figcaption></figure>':'');
  if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');q('[data-ceramic-close]').focus();}
 // миниатюры: при выбранной отделке — только её кадры
 function renderThumbs(p){
  const shown=p.gallery.map((x,i)=>({x,i})).filter(({x})=>!productFinish||x.finish===productFinish);
  q('#product-thumbs').innerHTML=shown.map(({x,i},n)=>'<button type="button" data-product-photo="'+i+'" aria-label="Ракурс: '+esc(p.title)+' '+(n+1)+(x.finish?' — '+esc(x.finish.toLowerCase()):'')+'" aria-pressed="'+(n===0)+'"><img src="'+esc(x.video?x.poster:x.thumb||x.src)+'" alt="" loading="lazy">'+(x.video?'<span class="arch-thumb-play" aria-hidden="true">▶</span>':'')+'</button>').join('');
  qa('[data-product-finish]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.productFinish===productFinish)));
  photo(p,shown.length?shown[0].i:0);
 }
 // кадр галереи: фото — в <img>, видео — в <video> с кнопками (без автозапуска со звуком)
 function photo(p,index){const x=p.gallery[index];if(!x)return;const img=q('#product-image');let video=q('#product-video');
  if(x.video){if(!video){video=document.createElement('video');video.id='product-video';video.controls=true;video.muted=true;video.loop=true;video.playsInline=true;video.preload='metadata';img.after(video);}
   video.poster=x.poster||'';if(video.getAttribute('src')!==x.src)video.src=x.src;video.setAttribute('aria-label',p.title+': видео');video.hidden=false;img.hidden=true;}
  else{if(video){video.pause();video.hidden=true;}img.hidden=false;img.src=x.src;}
  img.alt=p.title;qa('[data-product-photo]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.productPhoto)===index)));}
 function navigate(push=true,scroll=false){render();history[push?'pushState':'replaceState'](null,'',url());if(scroll){const target=q(item?'#product-detail':'#catalog');target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});if(item)q('#product-title').focus({preventScroll:true});}}
 document.addEventListener('click',event=>{
  if(item&&event.target.closest('a[href="#catalog"]')){event.preventDefault();item='';navigate(true,true);return;}
  const link=event.target.closest('[data-product-link]');if(link&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey){event.preventDefault();opener=link;item=link.dataset.productLink;navigate(true,true);return;}
  const categoryLink=event.target.closest('[data-category]');if(categoryLink&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey){event.preventDefault();category=categoryLink.dataset.category;model='';finish='';item='';navigate();return;}
  if(event.target.closest('#product-back')){event.preventDefault();const previous=item;item='';navigate(true,true);q('[data-product-link="'+previous+'"]')?.focus({preventScroll:true});return;}
  const thumb=event.target.closest('[data-product-photo]');if(thumb&&item)photo(byId.get(item),Number(thumb.dataset.productPhoto));
  const sw=event.target.closest('[data-ceramic]');if(sw){openCeramic(sw.dataset.ceramic);return;}
  if(event.target.closest('[data-ceramic-close]')||event.target.id==='ceramic-dialog'){const d=q('#ceramic-dialog');d.querySelector('video')?.pause();d.close?d.close():d.removeAttribute('open');return;}
  const finishBtn=event.target.closest('[data-product-finish]');if(finishBtn&&item){productFinish=finishBtn.dataset.productFinish;renderThumbs(byId.get(item));}
 });

 q('#model-filter').addEventListener('change',e=>{model=e.target.value;navigate();});
 q('#finish-filter').addEventListener('change',e=>{finish=e.target.value;navigate();});
 addEventListener('popstate',()=>{read();render();});
 read();navigate(false,!!item);
})();
