/* Pure costing and shipment search for Al-Ola 1.3.1. No DOM. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.SupplyCost=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const PALLET_NAME='بالتات خشبية وزوايا وكلبس وشنمر';
const DEFAULTS=[
  {label:'صندوق بلاستيك 8 ك',kg:0.35,test:s=>/صندوق|بلاست/.test(s)},
  {label:'كرتون مقفول 14 ك',kg:0.8,test:s=>/14/.test(s)},
  {label:'كرتون مقفول 8 ك',kg:0.45,test:s=>/8/.test(s)&&!/14/.test(s)&&!/بلاست|صندوق/.test(s)}
];
function round1(v){return Math.round((Number(v)+Number.EPSILON)*10)/10}
function money(v){return Math.round((Number(v)+Number.EPSILON)*100)/100}
function mul1(count,unit){const u=Math.round(Number(unit)*1000);return Math.round((Number(count)*u)/100)/10}
function add1(vals){return vals.reduce((a,v)=>a+Math.round(Number(v)*10),0)/10}
function norm(s){return String(s==null?'':s).replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').toLowerCase().replace(/\s+/g,'')}
function packUnit(ctype,settings,override){
  const key=String(ctype||'');
  if(override&&override[key]!=null&&override[key]!=='')return Number(override[key]);
  const map=settings&&settings.packWeights||{};
  if(map[key]!=null&&map[key]!=='')return Number(map[key]);
  const hit=DEFAULTS.find(d=>d.test(key));
  return hit?hit.kg:0;
}
function palletUnit(settings,override){
  if(override&&override.__pallet__!=null&&override.__pallet__!=='')return Number(override.__pallet__);
  const map=settings&&settings.packWeights||{};
  if(map.__pallet__!=null&&map.__pallet__!=='')return Number(map.__pallet__);
  return 20;
}
function ensureDefaults(settings){
  if(!settings.packWeights)settings.packWeights={};
  DEFAULTS.forEach(d=>{if(settings.packWeights[d.label]==null)settings.packWeights[d.label]=d.kg});
  if(settings.packWeights.__pallet__==null)settings.packWeights.__pallet__=20;
  if(!settings.tonPrices)settings.tonPrices={};
  return settings;
}
function quote(opt){
  opt=opt||{};
  const settings=opt.settings||{};
  const override=opt.packOverride||{};
  const groups=(opt.groups||[]).map(g=>({key:g.key,name:g.name||'صنف',ctype:g.ctype||'',variety:g.variety||'',cartons:Number(g.cartons)||0,fruit:round1(g.fruit||0),pallets:g.pallets||0,packUnit:g.packUnit}));
  const palletCount=opt.palletCount!=null?opt.palletCount:groups.reduce((a,g)=>a+g.pallets,0);
  const pUnit=palletUnit(settings,override);
  const lines=groups.map(g=>{
    const unit=g.packUnit!=null&&g.packUnit!==''?Number(g.packUnit):packUnit(g.ctype,settings,override);
    const pack=mul1(g.cartons,unit);
    return Object.assign({},g,{packUnit:unit,packWeight:pack});
  });
  const palletWeight=mul1(palletCount,pUnit);
  const fruitTotal=add1(lines.map(l=>l.fruit));
  const tare=add1(lines.map(l=>l.packWeight).concat([palletWeight]));
  const grossAuto=add1([fruitTotal,tare]);
  const manual=opt.grossManual!=null&&opt.grossManual!==''&&isFinite(Number(opt.grossManual));
  const gross=manual?round1(opt.grossManual):grossAuto;
  const net=round1(gross-tare);
  const fruitSum=add1(lines.map(l=>l.fruit));
  const scale=fruitSum?net/fruitSum:0;
  const useScale=manual&&Math.abs(net-fruitSum)>0.05;
  lines.forEach(l=>{l.netKg=round1(useScale?l.fruit*scale:l.fruit)});
  if(useScale&&lines.length){const drift=round1(net-add1(lines.map(l=>l.netKg)));lines[lines.length-1].netKg=round1(lines[lines.length-1].netKg+drift)}
  const prices=opt.prices||{};
  const fx=opt.fxRate;
  let usdRaw=0,ready=lines.length>0;
  lines.forEach(l=>{
    const raw=l.pricePerTon!=null&&l.pricePerTon!==''?l.pricePerTon:prices[l.key];
    l.pricePerTon=raw==null||raw===''?'':String(raw);
    if(l.pricePerTon===''||!isFinite(Number(l.pricePerTon))){ready=false;l.usd=null;l.usdRaw=0;return}
    l.usdRaw=Number(l.netKg)*Number(l.pricePerTon)/1000;
    l.usd=money(l.usdRaw);
    l.egpTon=fx!=null&&fx!==''&&isFinite(Number(fx))?money(Number(l.pricePerTon)*Number(fx)):null;
    usdRaw+=l.usdRaw;
  });
  const egp=fx!=null&&fx!==''&&isFinite(Number(fx))&&Number(fx)>0?money(usdRaw*Number(fx)):null;
  const packNote=lines.filter(l=>l.cartons).map(l=>l.cartons.toLocaleString('en-US')+' '+l.name).join(' + ');
  const deductions=lines.filter(l=>l.cartons).map(l=>({name:l.name,ctype:l.ctype,count:l.cartons,unitKg:l.packUnit,weight:l.packWeight,role:'carton'}));
  if(palletCount)deductions.push({name:PALLET_NAME,count:palletCount,unitKg:pUnit,weight:palletWeight,role:'pallet'});
  return {lines,deductions,packNote,packages:lines.reduce((a,l)=>a+l.cartons,0),palletCount,fruitTotal,tare,gross,grossAuto,net,usd:money(lines.reduce((a,l)=>a+(l.usd||0),0)),usdRaw,egp,ready,fxRate:fx||'',palletUnit:pUnit};
}
function fromPallets(rows,opt){
  const g={},seen=new Set();
  (rows||[]).forEach(r=>{
    if(r.p)seen.add(r.p);
    const variety=r.variety||'',ctype=r.ctype||'';
    const key=variety+'|'+ctype;
    if(!g[key])g[key]={key,name:(variety+' '+ctype).replace(/\s+/g,' ').trim()||'صنف',variety,ctype,cartons:0,fruit:0,pallets:0};
    const cartons=Number(r.cartons)||0,kg=Number(r.kg)||0;
    g[key].cartons+=cartons;g[key].fruit+=cartons*kg;g[key].pallets+=1;
  });
  return quote(Object.assign({},opt,{groups:Object.values(g),palletCount:seen.size||(rows||[]).length}));
}
function shipRecord(input){
  const varieties=input.varieties||[];
  const blob=norm([input.cont,input.customer,input.lot,input.dest,input.driver,input.reefer,(input.palletNos||[]).join(' '),varieties.join(' '),(input.invoices||[]).join(' ')].join('\n'));
  return Object.assign({},input,{blob,varieties});
}
function matchShip(rec,q){
  q=q||{};
  if(q.from&&String(rec.date||'')<q.from)return false;
  if(q.to&&String(rec.date||'')>q.to)return false;
  if(q.customer&&rec.customer!==q.customer)return false;
  if(q.kind&&rec.shipKind!==q.kind)return false;
  if(q.variety&&!(rec.varieties||[]).some(v=>norm(v)===norm(q.variety)))return false;
  if(q.status==='draft'&&rec.invStatus!=='draft')return false;
  if(q.status==='approved'&&rec.invStatus!=='approved')return false;
  if(q.status==='none'&&rec.invStatus)return false;
  if(q.status==='settled'&&!rec.settled)return false;
  if(q.status==='open'&&rec.settled)return false;
  const text=q.text!=null?q.text:q.q;
  if(text&&!rec.blob.includes(norm(text)))return false;
  return true;
}
function filterShips(list,q){
  const rows=(list||[]).filter(r=>matchShip(r,q));
  const totals=rows.reduce((a,r)=>{a.pallets+=r.palletCount||0;a.cartons+=r.cartons||0;a.net+=Number(r.netKg)||0;return a},{pallets:0,cartons:0,net:0});
  totals.net=round1(totals.net);
  return {rows,count:rows.length,totals};
}
return {PALLET_NAME,DEFAULTS,round1,money,norm,ensureDefaults,quote,fromPallets,shipRecord,matchShip,filterShips,packUnit,palletUnit};
});
