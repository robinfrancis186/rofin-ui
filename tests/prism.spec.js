import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { tracePrism } from '../src/js/prism.js';

const rayRows = root => root.locator('[data-rf-prism-rays] tr').evaluateAll(rows => rows.map(row => [...row.cells].map(cell => cell.textContent)));
const slider = (page, name) => page.getByRole('slider', {name, exact:true});
const image = page => page.locator('[data-rf-prism] canvas').evaluate(canvas => {
  const gl=canvas.getContext('webgl'); if(canvas.hidden||!gl)return null;
  const pixels=new Uint8Array(canvas.width*canvas.height*4);gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  let hash=0,painted=0;for(let i=0;i<pixels.length;i+=4){if(pixels[i+3])painted++;hash=(Math.imul(hash,31)+pixels[i]+pixels[i+1]*3+pixels[i+2]*7+pixels[i+3])>>>0;}
  return {hash,painted,pixels:canvas.width*canvas.height,error:gl.getError()};
});
const aim = async page => {
  const canvas=page.locator('[data-rf-prism] canvas'); await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox();
  await page.mouse.move(box.x+box.width*.3,box.y+box.height*.35);await page.mouse.down();await page.mouse.move(box.x+box.width*.4,box.y+box.height*.3, {steps:3});
};

test('prism rays preserve Snell refraction, bounded paths and atomic finite settings', () => {
  const normals=[[0,-1],[Math.sqrt(3)/2,.5],[-Math.sqrt(3)/2,.5]], direction=(a,b)=>{const length=Math.hypot(b[0]-a[0],b[1]-a[1]);return[(b[0]-a[0])/length,(b[1]-a[1])/length];}, sine=(d,n)=>Math.abs(d[0]*n[1]-d[1]*n[0]), normalAt=p=>normals.reduce((best,n)=>Math.abs(n[0]*p[0]+n[1]*p[1]-.5)<Math.abs(best[0]*p[0]+best[1]*p[1]-.5)?n:best);
  const initial=tracePrism();expect(initial.map(ray=>ray.wavelength)).toEqual([700,650,600,550,500,450,400]);expect(initial[0].exitAngle).toBeCloseTo(-32.4068224575,8);expect(initial.at(-1).reflections).toBe(1);
  expect(new Set(tracePrism({dispersion:0}).map(ray=>ray.exitAngle)).size).toBe(1);expect(tracePrism({height:.8,angle:35}).every(ray=>ray.state==='missed')).toBe(true);
  for(const height of [-.8,-.3,0,.8])for(const angle of [-35,-15,0,15,35])for(const index of [1.2,1.45,2.2])for(const dispersion of [0,.12,.3])for(const ray of tracePrism({height,angle,index,dispersion})){
    expect(ray.points.flat().every(Number.isFinite)).toBe(true);expect(ray.points.length).toBeLessThanOrEqual(11);expect(ray.reflections).toBeLessThanOrEqual(8);
    if(ray.state==='missed'){expect(ray.points).toHaveLength(2);expect(ray.exitAngle).toBeNull();continue;}
    const entry=normalAt(ray.points[1]);expect(sine(direction(ray.points[0],ray.points[1]),entry)).toBeCloseTo(ray.index*sine(direction(ray.points[1],ray.points[2]),entry),6);
    for(const p of ray.points.slice(1,ray.state==='exited'?-1:undefined))for(const n of normals)expect(n[0]*p[0]+n[1]*p[1]).toBeLessThanOrEqual(.500001);
    if(ray.state==='exited'){const exit=normalAt(ray.points.at(-2)),inside=direction(ray.points.at(-3),ray.points.at(-2)),outside=direction(ray.points.at(-2),ray.points.at(-1));expect(ray.index*sine(inside,exit)).toBeCloseTo(sine(outside,exit),6);expect(ray.exitAngle).toBeCloseTo(Math.atan2(outside[1],outside[0])*180/Math.PI,7);}
  }
  for(const settings of [{height:-.81},{angle:36},{index:'1.45'},{index:Infinity},{dispersion:NaN},{dispersion:-.01}])expect(()=>tracePrism(settings)).toThrow();initial[0].points[0][0]=999;expect(tracePrism()[0].points[0][0]).toBe(-2.4);
});

test('prism paints actual GPU geometry and responds to native keys and captured beam aiming', async ({page,browserName}) => {
  const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('/docs/index.html#component/prism-lab');const root=page.locator('[data-rf-prism]');await expect(root.locator('[data-rf-prism-status]')).toContainText(/paused|WebGL unavailable/);await expect(root.locator('tbody tr')).toHaveCount(7);
  const first=await image(page);if(browserName==='chromium')expect(first,'Chromium must paint the actual WebGL scene').not.toBeNull();
  console.log(`Prism WebGL ${browserName}: ${first?`${first.painted} painted pixels / ${first.pixels} backing pixels`:'platform fallback'}`);
  if(first){await expect(root.locator('[data-rf-prism-fallback]')).toBeHidden();expect(first.painted).toBeGreaterThan(1000);expect(first.pixels).toBeLessThanOrEqual(262144);expect(first.error).toBe(0);const data=await rayRows(root);await slider(page,'Scene turn').focus();await page.keyboard.press('Home');await expect(slider(page,'Scene turn')).toHaveValue('-180');expect((await image(page)).hash).not.toBe(first.hash);expect(await rayRows(root)).toEqual(data);await aim(page);expect(await slider(page,'Beam height').inputValue()).not.toBe('0');expect(await slider(page,'Beam angle').inputValue()).not.toBe('0');await page.mouse.up();expect(await root.locator('canvas').evaluate(canvas=>canvas.hasPointerCapture(1))).toBe(false);}
  await slider(page,'Refractive index').focus();await page.keyboard.press('End');await expect(slider(page,'Refractive index')).toHaveValue('2.2');expect((await rayRows(root))[3][1]).toBe('2.2000');await page.getByRole('button',{name:'Reset prism',exact:true}).click();await expect(root.locator('tbody tr').nth(3).locator('td').nth(1)).toHaveText('1.4500');await expect(slider(page,'Beam height')).toHaveValue('0');expect(errors).toEqual([]);
});

test('prism spin is opt-in and pauses for manual edits, offscreen, hidden pages and pagehide', async ({page}) => {
  await page.goto('/docs/index.html#component/prism-lab');const canvas=page.locator('[data-rf-prism] canvas'), status=page.locator('[data-rf-prism-status]'), play=page.locator('[data-rf-prism-play]');
  if(await canvas.isHidden()){await expect(play).toBeDisabled();return;}
  const start=async()=>{await canvas.scrollIntoViewIfNeeded();await play.click();await expect(play).toHaveText('Pause prism spin');const turn=await slider(page,'Scene turn').inputValue();await expect.poll(()=>slider(page,'Scene turn').inputValue()).not.toBe(turn);};
  await expect(play).toHaveText('Start prism spin');await start();await slider(page,'Dispersion').focus();await page.keyboard.press('Home');await expect(play).toHaveText('Start prism spin');await expect(status).toContainText('paused');
  await start();await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await expect(status).toContainText('paused');const paused=await slider(page,'Scene turn').inputValue();await canvas.scrollIntoViewIfNeeded();await page.waitForTimeout(180);await expect(slider(page,'Scene turn')).toHaveValue(paused);
  await start();await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await expect(play).toHaveText('Start prism spin');await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await expect(play).toHaveText('Start prism spin');
  await start();await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await expect(play).toHaveText('Start prism spin');await page.emulateMedia({reducedMotion:'reduce'});await expect(play).toBeDisabled();await expect(status).toContainText('reduced motion');await expect(slider(page,'Beam angle')).toBeEnabled();
});

test('prism reset, context recovery and teardown retain exact data without duplicate enhancement', async ({page}) => {
  const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('/docs/index.html#component/prism-lab');const root=page.locator('[data-rf-prism]'), canvas=root.locator('canvas');const rendered=await canvas.isVisible();
  await page.evaluate(async()=>{const {initPrisms}=await import('/src/js/prism.js');window.stopPrism=initPrisms(document.querySelector('[data-rf-prism]'));initPrisms(document.querySelector('[data-rf-prism]'));});
  await slider(page,'Dispersion').focus();await page.keyboard.press('End');const changed=await rayRows(root);await root.locator('form').evaluate(form=>form.addEventListener('reset',event=>event.preventDefault(),{once:true}));await page.getByRole('button',{name:'Reset prism',exact:true}).click();await expect(slider(page,'Dispersion')).toHaveValue('0.3');expect(await rayRows(root)).toEqual(changed);
  if(await canvas.isVisible()){
    await aim(page);await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await page.mouse.up();expect(await canvas.evaluate(canvas=>canvas.hasPointerCapture(1))).toBe(false);
    const lost=await canvas.evaluate(canvas=>{const extension=canvas.getContext('webgl').getExtension('WEBGL_lose_context');if(!extension)return false;window.prismContextExtension=extension;extension.loseContext();return true;});
    if(lost){await expect(canvas).toBeHidden();await expect(root.locator('[data-rf-prism-fallback]')).toBeVisible();await expect(slider(page,'Scene turn')).toBeDisabled();await expect(slider(page,'Refractive index')).toBeEnabled();await canvas.evaluate(()=>window.prismContextExtension.restoreContext());await expect(canvas).toBeVisible();await expect(root.locator('[data-rf-prism-status]')).toContainText('paused');expect((await image(page)).painted).toBeGreaterThan(1000);}
  }
  await page.getByRole('button',{name:'Reset prism',exact:true}).click();await expect(slider(page,'Dispersion')).toHaveValue('0.12');await expect(root.locator('tbody tr').nth(3).locator('td').nth(4)).toHaveText('-38.24°');const retained=await rayRows(root);await page.evaluate(()=>window.stopPrism());await expect(canvas).toBeHidden();await expect(slider(page,'Beam height')).toBeDisabled();expect(await rayRows(root)).toEqual(retained);await page.evaluate(async()=>window.stopPrism=(await import('/src/js/prism.js')).initPrisms(document.querySelector('[data-rf-prism]')));await expect(slider(page,'Beam height')).toBeEnabled();if(rendered){await expect(canvas).toBeVisible();expect((await image(page)).painted).toBeGreaterThan(1000);}await page.evaluate(()=>document.querySelector('[data-rf-prism]').setAttribute('aria-disabled','true'));await slider(page,'Beam angle').evaluate(input=>{input.value='35';input.dispatchEvent(new Event('input',{bubbles:true}));});expect(await rayRows(root)).toEqual(retained);await page.evaluate(()=>document.querySelector('[data-rf-prism]').removeAttribute('aria-disabled'));await page.goto('/docs/index.html#component/button');await expect(page.locator('[data-rf-prism]')).toHaveCount(0);expect(errors).toEqual([]);
});

test('prism retains exact values with unavailable WebGL, forced colors and scripts disabled', async ({page,browser}) => {
  await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...options){return kind==='webgl'?null:original.call(this,kind,...options);};});await page.goto('/docs/index.html#component/prism-lab');await expect(page.locator('[data-rf-prism-status]')).toContainText('WebGL unavailable');await expect(page.locator('[data-rf-prism-fallback]')).toBeVisible();await expect(slider(page,'Scene turn')).toBeDisabled();await slider(page,'Dispersion').focus();await page.keyboard.press('Home');expect(new Set((await rayRows(page.locator('[data-rf-prism]'))).map(row=>row[4])).size).toBe(1);await page.emulateMedia({forcedColors:'active'});await expect(page.locator('[data-rf-prism-status]')).toContainText('forced colors');await expect(slider(page,'Beam height')).toBeEnabled();
  const context=await browser.newContext({javaScriptEnabled:false}), native=await context.newPage();await native.goto('/examples/landing.html#prism');await native.getByText('Read beam data',{exact:true}).click();const rows=await rayRows(native.locator('[data-rf-prism]'));expect(rows).toHaveLength(7);expect(rows[0]).toEqual(['700','1.4041','exited','0','-32.41°']);expect(rows.at(-1)).toEqual(['400','1.5569','exited','1','-120.00°']);await expect(native.getByRole('slider',{name:'Beam height',exact:true})).toBeDisabled();await expect(native.locator('[data-rf-prism-fallback]')).toBeVisible();await context.close();
});

test('the gallery and composed website share the prism and fit narrow themes with accessible controls', async ({page}) => {
  test.setTimeout(90000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const route of ['/dist/site/index.html#component/prism-lab','/dist/site/examples/landing.html#prism']){await page.goto(route);const root=page.locator('[data-rf-prism]');await expect(root.locator('tbody tr')).toHaveCount(7);await page.getByText('Read beam data',{exact:true}).click();for(const theme of ['light','dark'])for(const width of [320,390,1440]){await page.setViewportSize({width,height:900});await page.evaluate(theme=>document.documentElement.dataset.rfTheme=theme,theme);await page.waitForFunction(()=>document.getAnimations().filter(animation=>'transitionProperty' in animation&&animation.effect.target.checkVisibility({contentVisibilityAuto:true})).every(animation=>animation.playState!=='running'&&!animation.pending));expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);expect((await new AxeBuilder({page}).include('[data-rf-prism]').analyze()).violations).toEqual([]);const painted=await image(page);if(painted)expect(painted.pixels).toBeLessThanOrEqual(262144);}
  }
  await page.goto('/dist/site/index.html#component/prism-lab');await expect(page.locator('.code-panel').nth(1)).toContainText('initPrisms');const response=await page.request.get('/dist/site/examples/components/prism-lab.html');expect(await response.text()).toContain('<td>-32.41°</td>');expect(errors).toEqual([]);
});
