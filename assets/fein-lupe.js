/* The lens samples the same point in the archive photograph that is marked on the image. */
(() => {
  'use strict';
  const plate = document.querySelector('[data-fv-loupe]');
  if (!plate) return;
  const frame = plate.querySelector('[data-fv-frame]');
  const image = plate.querySelector('.fv6-source');
  const lens = plate.querySelector('.fv6-lens');
  const marker = plate.querySelector('.fv6-origin');
  const controls = plate.querySelector('.fv6-instruments');
  const toggle = plate.querySelector('[data-fv-toggle]');
  const buttons = [...plate.querySelectorAll('[data-fv-point]')];
  const points = {stein:[.494,.657], fassung:[.556,.727], glied:[.212,.458]};
  const clamp = (v,min,max) => Math.max(min,Math.min(v,max));
  let point = points.stein;
  let selected = 'stein';
  let enabled = true;
  let request = 0;
  let touchStart;
  let original;

  function geometry() {
    const width = frame.clientWidth;
    const height = frame.clientHeight;
    const ratio = image.naturalWidth / image.naturalHeight;
    const drawnWidth = Math.max(width,height * ratio);
    const drawnHeight = drawnWidth / ratio;
    return {width,height,drawnWidth,drawnHeight,
      left:(width-drawnWidth)*.5,top:(height-drawnHeight)*.67};
  }

  function draw() {
    request = 0;
    if (!enabled || !original || !image.naturalWidth) return;
    const g = geometry();
    if (!g.width || !g.height) return;
    const radius = lens.offsetWidth / 2;
    const sourceX = point[0] * g.drawnWidth + g.left;
    const sourceY = point[1] * g.drawnHeight + g.top;
    // Place the enlargement alongside its origin, including at the edges of the image.
    const direction = sourceX + radius * 2.1 < g.width ? 1 : -1;
    const cx = clamp(sourceX + direction * radius * 1.16,radius+5,g.width-radius-5);
    const cy = clamp(sourceY - radius*.72,radius+5,g.height-radius-5);
    const zoom = 2.15;
    lens.style.transform = 'translate('+ (cx-radius) +'px,'+ (cy-radius) +'px)';
    marker.style.transform = 'translate('+ (sourceX-marker.offsetWidth/2) +'px,'+ (sourceY-marker.offsetHeight/2) +'px)';
    lens.style.backgroundSize = (g.drawnWidth*zoom)+'px '+(g.drawnHeight*zoom)+'px';
    const innerRadius = lens.clientWidth/2;
    const bgX = innerRadius - point[0]*g.drawnWidth*zoom;
    const bgY = innerRadius - point[1]*g.drawnHeight*zoom;
    lens.style.backgroundPosition = bgX+'px '+bgY+'px';
  }

  function schedule() {
    if (!request) request = requestAnimationFrame(draw);
  }

  function show() {
    lens.hidden = marker.hidden = !enabled;
    toggle.setAttribute('aria-pressed',String(enabled));
    frame.classList.toggle('fv6-enabled',enabled);
    for (const button of buttons) {
      button.setAttribute('aria-pressed',String(enabled && button.dataset.fvPoint===selected));
    }
    if (enabled) schedule();
  }

  function place(x,y,name) {
    point = [clamp(x,0,1),clamp(y,0,1)];
    if (name !== selected) {
      selected = name;
      show();
    }
    schedule();
  }

  function fromPointer(event) {
    if (!enabled || !image.naturalWidth) return;
    const rect = frame.getBoundingClientRect();
    const g = geometry();
    place((event.clientX-rect.left-g.left)/g.drawnWidth,(event.clientY-rect.top-g.top)/g.drawnHeight,'');
  }

  function bind() {
    lens.style.backgroundImage = 'url("'+original.src+'")';
    controls.hidden = false;
    frame.tabIndex = 0;
    frame.setAttribute('aria-describedby','fv6-loupe-help');
    toggle.addEventListener('click',() => {enabled=!enabled;show();});
    for (const button of buttons) {
      button.addEventListener('click',() => {
        enabled=true;
        selected=button.dataset.fvPoint;
        point=points[selected];
        show();
      });
    }
    frame.addEventListener('pointermove',event => {if(event.pointerType!=='touch')fromPointer(event);},{passive:true});
    frame.addEventListener('pointerdown',event => {
      if (event.pointerType==='touch') touchStart={x:event.clientX,y:event.clientY};
    },{passive:true});
    frame.addEventListener('pointerup',event => {
      if (event.pointerType==='touch' && touchStart && Math.hypot(touchStart.x-event.clientX,touchStart.y-event.clientY)<12) fromPointer(event);
      touchStart=undefined;
    },{passive:true});
    frame.addEventListener('pointercancel',() => {touchStart=undefined;});
    const steps = {ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    frame.addEventListener('keydown',event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key==='Enter' || event.key===' ' || event.key==='Escape') {
        event.preventDefault();
        enabled = event.key==='Escape' ? false : !enabled;
        show();
        return;
      }
      if (!steps[event.key]) return;
      event.preventDefault();
      if (!enabled) {enabled=true;show();}
      const g=geometry();
      const step=event.shiftKey ? 23 : 8;
      const x=clamp(point[0]+steps[event.key][0]*step/g.drawnWidth,-g.left/g.drawnWidth,(g.width-g.left)/g.drawnWidth);
      const y=clamp(point[1]+steps[event.key][1]*step/g.drawnHeight,-g.top/g.drawnHeight,(g.height-g.top)/g.drawnHeight);
      place(x,y,'');
    });
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(frame);
    else window.addEventListener('resize',schedule,{passive:true});
    image.addEventListener('load',schedule);
    show();
  }
  // Native responsive image loading remains usable even when the enhancement is unavailable.
  const detail = new Image();
  detail.onload=() => {original=detail;bind();};
  detail.src= new URL(lens.dataset.detail,document.baseURI).href;
})();
