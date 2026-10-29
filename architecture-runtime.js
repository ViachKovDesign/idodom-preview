'use strict';
(() => {
 if(!document.body.classList.contains('architecture'))return;
 const q=s=>document.querySelector(s),reduce=matchMedia('(prefers-reduced-motion:reduce)');
 const video=q('#hero-video'),toggle=q('#video-toggle'),motion=q('#motion-toggle');
 let disabled=false;try{disabled=localStorage.getItem('idodom-architecture-motion')==='off';}catch{}
 function configure(){const off=disabled||reduce.matches;document.body.classList.toggle('no-motion',off);if(motion){motion.textContent=off?'Включить движение':'Отключить движение';motion.setAttribute('aria-pressed',String(off));}if(video){video.autoplay=!off;if(off)video.pause();else video.play().catch(()=>{});}}
 if(video&&toggle){const state=()=>{toggle.textContent=video.paused?'Воспроизвести':'Пауза';toggle.setAttribute('aria-pressed',String(video.paused));};video.addEventListener('play',state);video.addEventListener('pause',state);const error=()=>{video.hidden=true;toggle.hidden=true;};video.addEventListener('error',error);video.querySelector('source')?.addEventListener('error',error);toggle.addEventListener('click',()=>{video.dataset.userPaused=String(!video.paused);if(video.paused)video.play().catch(error);else video.pause();});}
 motion?.addEventListener('click',()=>{disabled=!disabled;try{localStorage.setItem('idodom-architecture-motion',disabled?'off':'on');}catch{}configure();});reduce.addEventListener('change',configure);configure();
 // при возврате на вкладку видео снова играет (на главной нет кнопки паузы), если движение не отключено и пользователь не ставил паузу сам
 document.addEventListener('visibilitychange',()=>{if(!video)return;if(document.hidden)video.pause();else if(!disabled&&!reduce.matches&&video.dataset.userPaused!=='true')video.play().catch(()=>{});});
 const menu=q('#mobile-menu'),button=q('.menu-toggle');
 function close(){menu.hidden=true;button.setAttribute('aria-expanded','false');}
 button.addEventListener('click',()=>{menu.hidden=!menu.hidden;button.setAttribute('aria-expanded',String(!menu.hidden));});
 menu.addEventListener('click',event=>{if(event.target.closest('a,button'))close();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){close();const picker=q('.version-picker');if(picker)picker.open=false;}});
})();
