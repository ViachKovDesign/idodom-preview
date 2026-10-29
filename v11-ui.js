'use strict';
{
 const catalogue=document.body.classList.contains('collection-site');
 if(catalogue&&!document.body.classList.contains('contour-collection'))document.body.classList.toggle('architecture-collection',new URLSearchParams(location.search).get('concept')==='gallery');
 const preview=document.querySelector('.map-preview');
 if(preview){
  const tiles=[...preview.querySelectorAll('.map-tile')];
  const check=()=>{const failed=tiles.filter(tile=>tile.complete&&tile.naturalWidth===0).length;if(failed===tiles.length)preview.classList.add('map-unavailable');};
  tiles.forEach(tile=>tile.addEventListener('error',check));
 }
}
