import { enhancer, onFormReset, disabled } from './utils.js';

const planes = [[0, -1], [.8660254037844386, .5], [-.8660254037844386, .5]];
const spectrum = [[700,[1,.24,.2]], [650,[1,.52,.15]], [600,[1,.83,.2]], [550,[.3,1,.55]], [500,[.2,.85,1]], [450,[.4,.45,1]], [400,[.8,.4,1]]];
const dot = (a,b) => a[0]*b[0]+a[1]*b[1];
const point = (p,d,t) => [p[0]+d[0]*t,p[1]+d[1]*t,0];
const unit = d => { const length=Math.hypot(...d); return d.map(v=>v/length); };
function intersection(p,d) {
  let enter=0, exit=Infinity, normal;
  for(const n of planes) {
    const direction=dot(n,d), distance=.5-dot(n,p);
    if(Math.abs(direction)<1e-10) { if(distance<0)return null; continue; }
    const t=distance/direction;
    if(direction<0 && t>enter) {enter=t;normal=n;} else if(direction>0) exit=Math.min(exit,t);
  }
  return exit>enter+1e-8 && exit>0 ? {enter,exit,normal} : null;
}
function refract(d,n,ratio) {
  const cosine=dot(d,n), k=1-ratio*ratio*(1-cosine*cosine);
  return k<0 ? null : unit(d.map((v,i)=>ratio*v-(ratio*cosine+Math.sqrt(k))*n[i]));
}

/** Original illustrative dispersion model. Coordinates are scene units, not a calibrated material measurement. */
export function tracePrism({height=0,angle=0,index=1.45,dispersion=.12}={}) {
  for(const [value,min,max] of [[height,-.8,.8],[angle,-35,35],[index,1.2,2.2],[dispersion,0,.3]]) if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max) throw Error('Prism settings are outside their finite bounds.');
  const radians=angle*Math.PI/180, incoming=[Math.cos(radians),Math.sin(radians)], origin=[-2.4,height,0], hit=intersection(origin,incoming);
  return spectrum.map(([wavelength])=>{
    const material=index+dispersion*((550/wavelength)**2-1), points=[[...origin]];
    if(!hit) return {wavelength,index:material,state:'missed',reflections:0,points:[...points,point(origin,incoming,5)],exitAngle:null};
    let position=point(origin,incoming,hit.enter), direction=refract(incoming,hit.normal,1/material), reflections=0;
    points.push(position);
    // ponytail: seven wavelengths and at most eight internal reflections; use an optical solver for calibrated materials.
    for(let bounce=0;bounce<8;bounce++) {
      const next=intersection(point(position,direction,1e-7),direction);
      if(!next) break;
      position=point(position,direction,next.exit+1e-7); points.push(position);
      const normal=planes.reduce((best,n)=>Math.abs(dot(n,position)-.5)<Math.abs(dot(best,position)-.5)?n:best);
      const outgoing=refract(direction,normal.map(v=>-v),material);
      if(outgoing) { points.push(point(position,outgoing,3)); return {wavelength,index:material,state:'exited',reflections,points,exitAngle:Math.atan2(outgoing[1],outgoing[0])*180/Math.PI}; }
      direction=unit(direction.map((v,i)=>v-2*dot(direction,normal)*normal[i])); reflections++;
    }
    return {wavelength,index:material,state:'trapped',reflections,points,exitAngle:null};
  });
}

const vertex = `attribute vec3 position; attribute vec3 normal; attribute vec3 color;
uniform vec2 rotation; uniform float aspect; varying vec3 shade; varying vec3 surface;
void main(){ float a=rotation.x,b=rotation.y; mat3 turn=mat3(cos(a),0.,-sin(a),0.,1.,0.,sin(a),0.,cos(a)); mat3 tilt=mat3(1.,0.,0.,0.,cos(b),sin(b),0.,-sin(b),cos(b)); vec3 p=tilt*turn*position; surface=tilt*turn*normal; shade=color; p.z-=5.; gl_Position=vec4(p.x*2./aspect,p.y*2.,-1.020202*p.z-.2020202,-p.z); }`;
const fragment = `precision mediump float; varying vec3 shade; varying vec3 surface; uniform float beam;
void main(){ if(beam>.5){gl_FragColor=vec4(shade,1.);return;} vec3 n=normalize(surface); float light=.5+.5*abs(dot(n,normalize(vec3(-.4,.8,1.)))); float edge=pow(1.-abs(n.z),3.); gl_FragColor=vec4(mix(shade,vec3(1.),edge*.65)*light,.72); }`;
function mesh() {
  const front=[[0,1,.45],[-.8660254037844386,-.5,.45],[.8660254037844386,-.5,.45]], rear=front.map(([x,y])=>[x,y,-.45]);
  const faces=[[...front],[...rear]];
  for(let i=0;i<3;i++) {const j=(i+1)%3;faces.push([front[i],front[j],rear[j]],[front[i],rear[j],rear[i]]);}
  const data=[];
  for(const face of faces) {
    const a=face[1].map((v,i)=>v-face[0][i]),b=face[2].map((v,i)=>v-face[0][i]);let n=unit([a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]);
    if(n.reduce((sum,v,i)=>sum+v*face[0][i],0)<0)n=n.map(v=>-v);
    for(const p of face)data.push(...p,...n,.63,.52,.9);
  }
  return new Float32Array(data);
}
const geometry=mesh();
const prisms=enhancer('[data-rf-prism]',(element,signal)=>{
  const canvas=element.querySelector('canvas'), fallback=element.querySelector('[data-rf-prism-fallback]'), form=element.querySelector('form'), play=element.querySelector('[data-rf-prism-play]'), status=element.querySelector('[data-rf-prism-status]'), rows=element.querySelector('[data-rf-prism-rays]');
  if(!canvas||!fallback||!form||!play||!status||!rows)throw Error('Provide complete prism markup.');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'), forced=matchMedia('(forced-colors: active)');
  let gl,program,buffer,shaders=[],uniforms,rays,playing=false,frame,last=0,visible=true,disposed=false,pointer;
  const blocked=()=>disabled(element)||!!element.closest('fieldset[disabled]');
  const value=name=>Number(form.elements[name].value);
  const controls=()=>{for(const name of ['height','angle','index','dispersion'])form.elements[name].disabled=false;for(const name of ['turn','tilt'])form.elements[name].disabled=!gl||forced.matches;play.disabled=!gl||reduced.matches||forced.matches;play.textContent=playing?'Pause prism spin':'Start prism spin';form.querySelector('[type="reset"]').disabled=false;};
  const cancel=()=>{cancelAnimationFrame(frame);frame=undefined;last=0;};
  const announce=()=>{status.textContent=forced.matches?'Static illustration in forced colors. Exact ray data remains available.':!gl?'WebGL unavailable. Static illustration; controls update exact ray data.':reduced.matches?'Static scene with reduced motion. Manual controls and ray data remain available.':playing?'Prism spinning. Adjusting a control pauses motion.':'Prism paused. Drag the beam or use the controls.';};
  function pause(){playing=false;cancel();controls();}
  function release(){cancel();if(gl){if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);shaders.forEach(shader=>gl.deleteShader(shader));}program=buffer=null;shaders=[];}
  function staticView(){canvas.hidden=true;fallback.removeAttribute('hidden');}
  // ponytail: cap the decorative backing buffer at 262144 pixels; increase only after device profiling.
  function resize(){if(!gl||disposed)return;const box=canvas.parentElement.getBoundingClientRect(),ratio=Math.min(1.5,devicePixelRatio||1,Math.sqrt(262144/Math.max(1,box.width*box.height)));canvas.width=Math.max(1,Math.floor(box.width*ratio));canvas.height=Math.max(1,Math.floor(box.height*ratio));draw();}
  function draw(){
    if(!gl||!program||forced.matches||disposed)return;
    canvas.hidden=false;fallback.setAttribute('hidden','');gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.uniform2f(uniforms.rotation,value('turn')*Math.PI/180,value('tilt')*Math.PI/180);gl.uniform1f(uniforms.aspect,canvas.width/canvas.height);
    for(const [name,offset] of [['position',0],['normal',12],['color',24]]){const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,36,offset);}
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.DEPTH_TEST);gl.depthMask(false);gl.uniform1f(uniforms.beam,0);gl.bufferData(gl.ARRAY_BUFFER,geometry,gl.STATIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,geometry.length/9);
    const lines=[];
    rays.forEach((ray,i)=>{for(let j=0;j<ray.points.length-1;j++){const color=j===0?[.94,.86,.67]:spectrum[i][1];for(const p of [ray.points[j],ray.points[j+1]])lines.push(...p,0,0,1,...color);}});
    gl.disable(gl.DEPTH_TEST);gl.uniform1f(uniforms.beam,1);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lines),gl.DYNAMIC_DRAW);gl.drawArrays(gl.LINES,0,lines.length/9);gl.depthMask(true);
    if(gl.getError()!==gl.NO_ERROR){release();gl=null;pause();staticView();announce();}
  }
  function model(){
    rays=tracePrism(Object.fromEntries(['height','angle','index','dispersion'].map(name=>[name,value(name)])));
    rows.replaceChildren(...rays.map(ray=>{const tr=document.createElement('tr');for(const item of [String(ray.wavelength),ray.index.toFixed(4),ray.state,String(ray.reflections),ray.exitAngle===null?'—':`${ray.exitAngle.toFixed(2)}°`]){const td=document.createElement('td');td.textContent=item;tr.append(td);}return tr;}));
    for(const output of element.querySelectorAll('[data-rf-prism-value]'))output.textContent=String(value(output.dataset.rfPrismValue));draw();
  }
  function start(){
    release();gl=null;
    try{
      gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:true});if(!gl)throw Error('No WebGL.');
      for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){const shader=gl.createShader(type);shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('Shader unavailable.');}
      program=gl.createProgram();shaders.forEach(shader=>gl.attachShader(program,shader));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader unavailable.');buffer=gl.createBuffer();if(!buffer)throw Error('Buffer unavailable.');
      uniforms=Object.fromEntries(['rotation','aspect','beam'].map(name=>[name,gl.getUniformLocation(program,name)]));resize();
    }catch{release();gl=null;staticView();}
    controls();announce();
  }
  function tick(time){
    frame=undefined;if(!playing||disposed||!gl||blocked()||reduced.matches||forced.matches||document.hidden||!visible){pause();announce();return;}
    if(!last||time-last>=1000/30){const dt=last?Math.min(.05,(time-last)/1000):0;last=time;form.elements.turn.value=(((value('turn')+dt*20+180)%360)-180).toFixed(1);element.querySelector('[data-rf-prism-value="turn"]').textContent=form.elements.turn.value;draw();}
    if(playing)frame=requestAnimationFrame(tick);
  }
  play.addEventListener('click',()=>{if(blocked()||play.disabled)return;playing=!playing;cancel();controls();announce();if(playing)frame=requestAnimationFrame(tick);},{signal});
  form.addEventListener('input',()=>{if(blocked())return;pause();model();announce();},{signal});
  form.addEventListener('change',()=>{if(!blocked())announce();},{signal});
  const stopReset=onFormReset(form,()=>{pause();releasePointer();model();announce();},signal);
  const releasePointer=()=>{if(pointer!==undefined&&canvas.hasPointerCapture(pointer))canvas.releasePointerCapture(pointer);pointer=undefined;};
  function aim(event){if(pointer!==event.pointerId||blocked())return;const box=canvas.getBoundingClientRect();form.elements.height.value=Math.max(-.8,Math.min(.8,(.5-(event.clientY-box.top)/box.height)*1.6)).toFixed(2);form.elements.angle.value=Math.max(-35,Math.min(35,((event.clientX-box.left)/box.width-.5)*70)).toFixed(1);model();}
  canvas.addEventListener('pointerdown',event=>{if(!gl||blocked()||event.button!==0||!event.isPrimary)return;pause();pointer=event.pointerId;canvas.setPointerCapture(pointer);aim(event);},{signal});
  canvas.addEventListener('pointermove',aim,{signal});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>{releasePointer();announce();},{signal});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();pause();releasePointer();release();gl=null;staticView();controls();announce();},{signal});
  canvas.addEventListener('webglcontextrestored',()=>{if(!disposed)start();},{signal});
  for(const media of [reduced,forced])media.addEventListener('change',()=>{pause();if(forced.matches)staticView();else draw();announce();},{signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();announce();}},{signal});
  window.addEventListener('pagehide',()=>{pause();releasePointer();announce();},{signal});
  let resizeObserver,observer;
  if(typeof ResizeObserver!=='undefined'){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas.parentElement);}else window.addEventListener('resize',resize,{signal});
  if(typeof IntersectionObserver!=='undefined'){observer=new IntersectionObserver(entries=>{visible=entries.at(-1).isIntersecting;if(!visible){pause();announce();}},{threshold:.01});observer.observe(canvas.parentElement);}
  model();start();
  return()=>{disposed=true;pause();releasePointer();stopReset();observer?.disconnect();resizeObserver?.disconnect();release();canvas.width=canvas.height=1;gl=null;staticView();for(const control of form.elements)control.disabled=true;play.disabled=true;status.textContent='Static illustration. Exact last ray data is retained.';};
});
export function initPrisms(root=document){prisms.init(root);return()=>prisms.destroy(root);}
