import * as T from 'https://esm.sh/three@0.170.0';import{OrbitControls}from'https://esm.sh/three@0.170.0/examples/jsm/controls/OrbitControls.js';import{GLTFLoader}from'https://esm.sh/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';import{OBJLoader}from'https://esm.sh/three@0.170.0/examples/jsm/loaders/OBJLoader.js';import{GLTFExporter}from'https://esm.sh/three@0.170.0/examples/jsm/exporters/GLTFExporter.js';import{STLLoader}from'https://esm.sh/three@0.170.0/examples/jsm/loaders/STLLoader.js';const root=document.querySelector('#hgview'),info=document.querySelector('#vstatus');const scene=new T.Scene();scene.background=new T.Color('#101713');const camera=new T.PerspectiveCamera(45,1,.001,100000);camera.position.set(4,3,5);const renderer=new T.WebGLRenderer({antialias:true,alpha:false});renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.setPixelRatio(Math.min(devicePixelRatio,2));root.appendChild(renderer.domElement);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;scene.add(new T.HemisphereLight(0xffffff,0x647c6b,3.6));const light=new T.DirectionalLight(0xfff3dd,3);light.position.set(4,8,6);scene.add(light);const grid=new T.GridHelper(10,20,0x947c50,0x34463b);grid.material.transparent=true;grid.material.opacity=.42;grid.material.depthWrite=false;scene.add(grid);let model=null,span=5,wire=false,url=null;
let bgMode='brand';const edgeLines=[];
const css=document.createElement('style');css.textContent=`
.hg-view-settings{position:absolute;z-index:5;left:12px;top:12px;display:flex;gap:7px;flex-wrap:wrap;max-width:calc(100% - 150px)}
.hg-view-settings .group{display:flex;gap:3px;align-items:center;background:#132019e8;border:1px solid #425744;border-radius:8px;padding:4px}
.hg-view-settings span{color:#c8d5c7;font:700 10px Manrope,sans-serif;padding:0 4px}
.hg-view-settings button{color:#e0e6dd;background:transparent;border:0;border-radius:5px;padding:6px 8px;font:700 11px Manrope,sans-serif;min-height:30px}
.hg-view-settings button[aria-pressed=true]{background:#d2af73;color:#171d15}
.hg-view-settings button:focus-visible{outline:2px solid #d2af73;outline-offset:2px}
#hgview.hg-white #hgmsg{background:#fffffff0;color:#333;border-color:#aab4aa}
#hgview.hg-white .stage-bottom{background:#ffffffdb;color:#62502b}
#hgview.hg-white .stage-bottom span{color:#58675a}
#hgview.hg-white .viewport-watermark span{color:#445244;text-shadow:none}
#hgview.hg-white .stage-axis span{background:#ffffffe0;border-color:#9daaa0}
@media(max-width:600px){.hg-view-settings{left:6px;top:6px;gap:3px;max-width:calc(100% - 105px)}.hg-view-settings .group{padding:2px;gap:1px}.hg-view-settings button{padding:4px 5px;font-size:9px;min-height:27px}.hg-view-settings span{font-size:9px;padding:0 2px}}
`;document.head.appendChild(css);
const toolbar=document.createElement('div');toolbar.className='hg-view-settings';
toolbar.innerHTML='<div class="group" role="group" aria-label="Màu nền 3D"><span>Nền</span><button data-bg="brand" aria-pressed="true">Gốc</button><button data-bg="white" aria-pressed="false">Trắng</button><button data-bg="black" aria-pressed="false">Đen</button></div><div class="group" role="group" aria-label="Hiển thị nét"><span>Nét</span><button id="hg-edges" aria-pressed="false">Tắt</button></div>';
root.appendChild(toolbar);
const originalGridColors=grid.geometry.attributes.color?.array.slice();
function setBg(mode){
  if(!['brand','white','black'].includes(mode))return;
  bgMode=mode;const color={brand:'#101713',white:'#ffffff',black:'#000000'}[mode];
  scene.background.set(color);root.style.background=color;root.classList.toggle('hg-white',mode==='white');
  toolbar.querySelectorAll('[data-bg]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bg===mode)));
  const attr=grid.geometry.attributes.color;
  if(attr&&originalGridColors){
    const original=originalGridColors;
    for(let i=0;i<attr.count;i++){
      const x=i*3;const major=original[x]>original[x+1];
      const c=new T.Color(mode==='white'?(major?0x999999:0xd3d3d3):mode==='black'?(major?0x666666:0x353535):(major?0x947c50:0x34463b));
      attr.setXYZ(i,c.r,c.g,c.b);
    }attr.needsUpdate=true;
  }
  edgeLines.forEach(line=>line.material.color.setHex(mode==='white'?0x222222:0xe7e7e7));
}
function clearEdges(){for(const line of edgeLines){line.parent?.remove(line);line.geometry.dispose();line.material.dispose()}edgeLines.length=0}
function makeEdges(){
  clearEdges();if(!model)return;
  model.traverse(obj=>{
    if(!obj.isMesh||!obj.geometry)return;
    const geometry=new T.EdgesGeometry(obj.geometry,35);
    const material=new T.LineBasicMaterial({color:bgMode==='white'?0x222222:0xe7e7e7,transparent:true,opacity:.9,depthTest:true,depthWrite:false});
    const line=new T.LineSegments(geometry,material);
    line.name='HG_VIEWPORT_EDGE_OVERLAY';line.visible=wire;line.renderOrder=10;
    obj.add(line);edgeLines.push(line);
  });
}
function setWire(enabled){
  wire=enabled;edgeLines.forEach(line=>line.visible=wire);
  const button=document.getElementById('hg-edges');
  button.textContent=wire?'Bật':'Tắt';button.setAttribute('aria-pressed',String(wire));
  const old=document.getElementById('vwire');
  old.textContent=wire?'Ẩn khung dây':'Hiện khung dây';
  old.setAttribute('aria-pressed',String(wire));
}
toolbar.addEventListener('click',e=>{
  const button=e.target.closest('button');if(!button)return;
  if(button.dataset.bg)setBg(button.dataset.bg);
  if(button.id==='hg-edges')setWire(!wire);
});
function resize(){renderer.setSize(root.clientWidth,root.clientHeight);camera.aspect=root.clientWidth/root.clientHeight;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(root);resize();function frame(){if(!model)return;const b=new T.Box3().setFromObject(model),c=b.getCenter(new T.Vector3());span=Math.max(b.getSize(new T.Vector3()).length(),.01);controls.target.copy(c);camera.position.copy(c).add(new T.Vector3(span*.9,span*.65,span));camera.near=Math.max(.001,span/1000);camera.far=Math.max(1000,span*1000);camera.updateProjectionMatrix();grid.position.y=0;grid.scale.setScalar(Math.max(.01,span/9));controls.update()}function view(x,y,z){if(!model)return;camera.position.copy(controls.target).add(new T.Vector3(x,y,z).normalize().multiplyScalar(span*1.5));controls.update()}const on=(id,fn)=>document.getElementById(id).addEventListener('click',fn);function autoUpright(){if(!model)return;model.rotation.set(0,0,0);model.position.set(0,0,0);model.updateMatrixWorld(true);const parts=[];model.traverse(o=>{if(!o.isMesh||!o.geometry)return;o.geometry.computeBoundingBox();const b=new T.Box3().setFromObject(o),size=b.getSize(new T.Vector3()),dims=[size.x,size.y,size.z].sort((a,b)=>b-a);if(dims[0]<1e-6)return;parts.push({box:b,center:b.getCenter(new T.Vector3()),size,area:dims[0]*dims[1],flat:dims[2]/dims[1]})});if(!parts.length){info.textContent='Không tìm thấy mesh để xác định mặt bàn.';return}parts.sort((a,b)=>b.area-a.area);const top=parts[0];const vals=[top.size.x,top.size.y,top.size.z];const thin=vals.indexOf(Math.min(...vals));const normal=[new T.Vector3(1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,0,1)][thin];let rest=new T.Vector3();let count=0;for(const p of parts.slice(1)){rest.add(p.center);count++}if(count){rest.divideScalar(count);const towardLegs=rest.sub(top.center);if(towardLegs.dot(normal)>0)normal.negate()}const q=new T.Quaternion().setFromUnitVectors(normal,new T.Vector3(0,1,0));model.quaternion.copy(q);ground();info.textContent='Đã nhận diện mặt phẳng lớn nhất làm mặt bàn, xoay lên trên và đưa đáy chân về Y = 0. Nếu mesh không tách riêng, cần chỉnh mô hình nguồn.'} function ground(){if(!model)return;model.updateMatrixWorld(true);const box=new T.Box3().setFromObject(model);model.position.y-=box.min.y;model.updateMatrixWorld(true);frame();info.textContent='Đã đưa đáy mô hình về sàn Y = 0 (cốt ±0.000).'}function rotate(axis,angle){if(!model)return;model.rotation[axis]+=angle;ground()}on('vfloor',ground);on('vfix',()=>{if(!model)return;autoUpright()});on('vxplus',()=>rotate('x',Math.PI/2));on('vxminus',()=>rotate('x',-Math.PI/2));on('vzplus',()=>rotate('z',Math.PI/2));on('vzminus',()=>rotate('z',-Math.PI/2));on('vrot',()=>rotate('x',Math.PI/2));on('vreset',()=>{if(!model)return;model.rotation.set(0,0,0);model.position.set(0,0,0);ground()});on('vsave',async()=>{if(!model)return;try{info.textContent='Đang xuất GLB...';const data=await new GLTFExporter().parseAsync(model,{binary:true});const link=document.createElement('a'),u=URL.createObjectURL(new Blob([data],{type:'model/gltf-binary'}));link.href=u;link.download='HOANGGIA_MODEL_DA_CHINH_HUONG.glb';link.click();setTimeout(()=>URL.revokeObjectURL(u),2000);info.textContent='Đã xuất GLB với hướng mô hình hiện tại.'}catch(e){info.textContent='Không xuất được GLB: '+e.message}});on('vfit',frame);on('vfront',()=>view(0,0,1));on('vtop',()=>view(0,1,.001));on('vside',()=>view(1,0,0));on('vgrid',()=>grid.visible=!grid.visible);on('vwire',()=>setWire(!wire));on('vfull',()=>document.fullscreenElement?document.exitFullscreen():root.requestFullscreen?.());document.getElementById('hgfile').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;info.textContent='Đang mở '+file.name;try{if(model){clearEdges();scene.remove(model)}if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(file);const ext=file.name.split('.').pop().toLowerCase();if(ext==='glb'||ext==='gltf')model=(await new GLTFLoader().loadAsync(url)).scene;else if(ext==='obj')model=await new OBJLoader().loadAsync(url);else if(ext==='stl')model=new T.Mesh(await new STLLoader().loadAsync(url),new T.MeshStandardMaterial({color:0xb9c0cb,side:T.DoubleSide}));else throw Error('Định dạng chưa hỗ trợ');scene.add(model);document.getElementById('hgmsg').style.display='none';setWire(false);makeEdges();autoUpright();let n=0;model.traverse(o=>{if(o.isMesh)n++});info.textContent=file.name+' · '+n+' mesh · Kéo để xoay, chụm để zoom.'}catch(err){info.textContent='Lỗi mở tệp: '+err.message+'; nên dùng GLB để nhúng đủ vật liệu.'}});setBg('brand');function tick(){requestAnimationFrame(tick);controls.update();renderer.render(scene,camera)}tick();