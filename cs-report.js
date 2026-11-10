/* Alola «بيان تكلفة» — same layout as Al-Ola Station 1.3.1 statementPage(); one A4 page; ALOLADATA1 kind:'cost' embedded. */
(function(){
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fm=(v,d=0)=>Number(v||0).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const CSS=`@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-arabic.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200E}
@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-latin.woff2) format('woff2')}
.cspage{width:794px;height:1123px;background:#fff;box-sizing:border-box;padding:24px 30px;direction:rtl;font-family:Cairo,Tahoma,Arial,sans-serif;position:relative;overflow:hidden}
.stmt{background:#fff;color:#1f2937;line-height:1.5;border:1px solid #d7e4db;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;height:100%;box-sizing:border-box}
.stmt .top,.stmt .foot{background:#1d4d2b;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px}
.stmt .top small,.stmt .foot{color:#d7ead0;font-size:12px}
.stmt .top b{font-size:16px}.stmt .top small{margin-right:6px}
.stmt .top img{height:46px;background:#fff;border-radius:8px}
.stmt .rule{height:3px;background:#6aa84f}
.stmt .body{padding:12px 16px 8px;flex:1;min-height:0;transform-origin:top right;box-sizing:border-box}
.stmt h2{text-align:center;color:#1d4d2b;margin:4px 0 0;font-size:22px}
.stmt .who{text-align:center;font-weight:700;margin:0 0 8px}
.stmt .meta{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #c5d7cb;border-radius:8px;overflow:hidden}
.stmt .meta div{padding:5px 8px;background:#f7fbf8;border-left:1px solid #e5eee8}
.stmt .meta div:nth-child(3n){border-left:0}
.stmt .meta i{display:block;font-style:normal;color:#6b7280;font-size:11px;font-weight:400}
.stmt .meta b{font-size:13px}
.stmt h4{margin:10px 0 0;background:#e7f2ea;color:#1d4d2b;padding:4px 8px;border-right:4px solid #6aa84f;font-size:13px}
.stmt table{width:100%;border-collapse:collapse;font-size:12px;margin-top:0}
.stmt th{background:#eef6ea;color:#1d4d2b;text-align:right}
.stmt td,.stmt th{border:1px solid #d5e2da;padding:4px 6px}
.stmt td.n{direction:ltr;text-align:left}
.stmt tr.tot td{font-weight:800;background:#e7f2ea}
.stmt .band{display:flex;justify-content:space-between;gap:8px;padding:6px 8px;margin-top:6px;background:#f7fbf8;border:1px solid #d5e2da;border-radius:8px;font-size:13px}
.stmt .band b{direction:ltr}
.stmt .band.tot{background:#e7f2ea;font-weight:800}
.stmt .fine{margin:2px 8px 0;color:#6b7280;font-size:11px}`;
function metaCell(k,v){return `<div><i>${k}</i><b>${esc(v||'—')}</b></div>`}
function page(st,q){
 const ded=q.deductions.map(d=>`<tr><td>${esc(d.name)}</td><td>${fm(d.count)}</td><td>${fm(d.unitKg,3)}</td><td>KG ${fm(d.weight,1)}</td></tr>`).join('');
 const lines=q.lines.map(p=>`<tr><td>${esc(p.name)}</td><td>KG ${fm(p.netKg,1)}</td><td>${p.pricePerTon===''?'—':fm(p.pricePerTon,2)}</td><td>${p.usd==null?'—':fm(p.usd,2)}</td><td>${p.egpTon==null?'—':fm(p.egpTon,2)}</td></tr>`).join('');
 return `<div class="cspage"><article class="stmt"><header class="top"><div><b>شركة العلا لفرز الحاصلات الزراعية</b><small>Al Ola Agricultural Crops Sorting — محطة الفرز والتعبئة</small></div><img src="alola_logo.png" alt=""></header><div class="rule"></div><div class="body"><h2>بيان تكلفة</h2><div class="who">${esc(st.owner||'')}</div><div class="meta">${metaCell('رقم الشحنة',st.shipNo)}${metaCell('التاريخ',st.date)}${metaCell('المستورد',st.importer)}${metaCell('رقم البراد',st.reefer)}${metaCell('اسم السائق',st.driver)}${metaCell('الجهة',st.dest)}${metaCell('اللوط',st.lots)}${metaCell('رقم بيان التكلفة',st.no)}${metaCell('رقم الخطاب',st.letterNo)}</div>
<h4>يخصم (المهمات)</h4><table><thead><tr><th>الصنف</th><th>العدد</th><th>وزن الوحدة</th><th>الوزن</th></tr></thead><tbody>${ded}</tbody></table>
<div class="band"><span>الوزن القائم</span><b>KG ${fm(q.gross,1)}</b></div><p class="fine">وزن الشحنة القائم كما في الباكينج ليست</p>
<div class="band"><span>عدد العبوات</span><b>${fm(q.packages)}</b></div><p class="fine">${esc(q.packNote||'')}</p>
<div class="band"><span>إجمالي المخصوم</span><b>KG ${fm(q.tare,1)}</b></div><p class="fine">مجموع أوزان العبوات والباليتات</p>
<div class="band tot"><span>الوزن الصافي بدون مهمات</span><b>KG ${fm(q.net,1)}</b></div><p class="fine">الوزن القائم ناقص إجمالي المخصوم</p>
<h4>بيان التكلفة</h4><table><thead><tr><th>الصنف</th><th>الوزن الصافي</th><th>سعر الطن $</th><th>الإجمالي $</th><th>سعر الطن ج</th></tr></thead><tbody>${lines}<tr class="tot"><td>الإجمالي</td><td>KG ${fm(q.net,1)}</td><td></td><td>${q.ready?fm(q.usd,2):'—'}</td><td></td></tr></tbody></table><p class="fine">مجموع الوزن الصافي وتكلفة الأصناف بالدولار</p>
<div class="band"><span>سعر الصرف</span><b>${q.fxRate?fm(q.fxRate,2)+' ج':'—'}</b></div><p class="fine">${esc(st.fxNote||'')}</p>
<div class="band tot"><span>الإجمالي بالجنيه</span><b>${q.egp==null?'—':fm(q.egp,2)+' ج'}</b></div><p class="fine">الإجمالي بالدولار × سعر الصرف</p></div><footer class="foot"><span>شركة العلا لفرز الحاصلات الزراعية</span><span>محطة الفرز والتعبئة</span></footer></article></div>`}
function fit(pg){const a=pg.querySelector('.stmt'),b=pg.querySelector('.body'),f=pg.querySelector('.foot');b.style.flex='none';const avail=a.clientHeight-b.offsetTop-f.offsetHeight-2;const h=b.scrollHeight;if(h>avail){const s=avail/h;const w=b.offsetWidth;b.style.width=(w/s)+'px';b.style.transform=`scale(${s})`;b.style.height=h+'px';b.style.marginBottom=(avail-h)+'px';return Math.round(s*100)/100}b.style.flex='1';return 1}
function aoa(st,q){return [['بيان تكلفة — شركة العلا'],['رقم بيان التكلفة',st.no],['رقم الخطاب',st.letterNo||''],['المورد',st.owner||''],['المستورد',st.importer||''],['رقم الشحنة',st.shipNo||''],['التاريخ',st.date||''],['رقم البراد',st.reefer||''],['اسم السائق',st.driver||''],['الجهة',st.dest||''],['اللوط',st.lots||''],
 ['الوزن القائم',q.gross],['عدد العبوات',q.packages],['عدد الباليتات',q.palletCount],['إجمالي المخصوم',q.tare],['الوزن الصافي بدون مهمات',q.net],['الإجمالي $',q.ready?q.usd:''],['سعر الصرف',q.fxRate||''],['الإجمالي بالجنيه',q.egp==null?'':q.egp],['ملاحظة الصرف',st.fxNote||''],[],
 ['الخصم','العدد','وزن الوحدة','الوزن'],...q.deductions.map(d=>[d.name,d.count,d.unitKg,d.weight]),[],
 ['الصنف','نوع العبوة','عدد العبوات','الوزن الصافي','سعر الطن $','الإجمالي $','سعر الطن ج'],...q.lines.map(l=>[l.name,l.ctype||'',l.cartons,l.netKg,l.pricePerTon,l.usd==null?'':l.usd,l.egpTon==null?'':l.egpTon])]}
function embed(rows){const CT=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;CT[n]=c}
 const u=new TextEncoder().encode(JSON.stringify({v:1,app:'alola',kind:'cost',rows}));let o='';for(let i=0;i<u.length;i+=32768)o+=String.fromCharCode.apply(null,u.subarray(i,i+32768));const b=btoa(o);let c=~0;for(let i=0;i<b.length;i++)c=CT[(c^b.charCodeAt(i))&255]^(c>>>8);return 'ALOLADATA1:'+b+':'+((~c)>>>0).toString(16).padStart(8,'0')}
function utf16PdfHex(s){let h='FEFF';for(let i=0;i<s.length;i++)h+=s.charCodeAt(i).toString(16).toUpperCase().padStart(4,'0');return '<'+h+'>'}
function idxBytes(u8,s,from){const n=s.length;for(let i=from||0;i<=u8.length-n;i++){let ok=1;for(let j=0;j<n;j++)if(u8[i+j]!==s.charCodeAt(j)){ok=0;break}if(ok)return i}return -1}
function lastIdxBytes(u8,s){const n=s.length;for(let i=u8.length-n;i>=0;i--){let ok=1;for(let j=0;j<n;j++)if(u8[i+j]!==s.charCodeAt(j)){ok=0;break}if(ok)return i}return -1}
function asciiLen(s){return new TextEncoder().encode(s).length}
function spliceBytes(u8,at,remove,insert){const ins=typeof insert==='string'?new TextEncoder().encode(insert):insert;const out=new Uint8Array(u8.length-remove+ins.length);out.set(u8.subarray(0,at),0);out.set(ins,at);out.set(u8.subarray(at+remove),at+ins.length);return out}
function literalSpan(u8,key){const at=idxBytes(u8,key);if(at<0)return null;let i=at+key.length;if(u8[i]!==0x28)return null;const lit=i;i++;while(i<u8.length){if(u8[i]===0x5c){i+=2;continue}if(u8[i]===0x29)break;i++}if(u8[i]!==0x29)return null;return {at:lit,remove:i+1-lit}}
function patchPdfTitle(buf,title){let u8=buf instanceof Uint8Array?buf:new Uint8Array(buf);const hex=utf16PdfHex(title);const cuts=[];for(const key of ['/Title ','/Subject ']){const hit=literalSpan(u8,key);if(hit)cuts.push({at:hit.at,remove:hit.remove,insert:hex})}const cat=idxBytes(u8,'/Type /Catalog');if(cat>=0&&idxBytes(u8,'/DisplayDocTitle')<0)cuts.push({at:cat+'/Type /Catalog'.length,remove:0,insert:' /ViewerPreferences <</DisplayDocTitle true>>'});if(!cuts.length)return u8;cuts.sort((a,b)=>a.at-b.at);const growth=off=>cuts.reduce((g,c)=>c.at<off?g+asciiLen(c.insert)-c.remove:g,0);const orig=u8;for(let i=cuts.length-1;i>=0;i--)u8=spliceBytes(u8,cuts[i].at,cuts[i].remove,cuts[i].insert);const sx=lastIdxBytes(orig,'startxref');if(sx<0)return orig;let p=sx+'startxref'.length;if(orig[p]===10||orig[p]===13)p++;let q=p;while(q<orig.length&&orig[q]>=48&&orig[q]<=57)q++;const xrefOld=parseInt(String.fromCharCode.apply(null,orig.subarray(p,q)),10);if(!xrefOld)return orig;const xrefAt=xrefOld+growth(xrefOld);const head='xref\n';if(idxBytes(u8,head,xrefAt)!==xrefAt)return orig;let i=xrefAt+head.length;const readLine=()=>{const a=i;while(i<u8.length&&u8[i]!==10&&u8[i]!==13)i++;const s=String.fromCharCode.apply(null,u8.subarray(a,i));if(u8[i]===13)i++;if(u8[i]===10)i++;return s};let guard=0;while(guard++<8){const sub=readLine();const m=/^(\d+)\s+(\d+)$/.exec(sub);if(!m)break;const count=+m[2];for(let n=0;n<count;n++){const entAt=i;const ent=readLine();const em=/^(\d{10}) (\d{5}) ([nf])/.exec(ent);if(!em||em[3]!=='n')continue;const off=+em[1];const shifted=off+growth(off);const digits=String(shifted).padStart(10,'0');for(let k=0;k<10;k++)u8[entAt+k]=digits.charCodeAt(k)}}const sxNew=lastIdxBytes(u8,'startxref');if(sxNew<0)return u8;let a=sxNew+'startxref'.length;if(u8[a]===10||u8[a]===13)a++;let b=a;while(b<u8.length&&u8[b]>=48&&u8[b]<=57)b++;const num=String(xrefAt);if(b-a===num.length){for(let k=0;k<num.length;k++)u8[a+k]=num.charCodeAt(k);return u8}return spliceBytes(u8,a,b-a,num)}

function stage(){let st=document.getElementById('csstage');if(!st){st=document.createElement('div');st.id='csstage';st.style.cssText='position:fixed;left:-10000px;top:0';document.body.appendChild(st)}
 if(!document.getElementById('cscss')){const s=document.createElement('style');s.id='cscss';s.textContent=CSS;document.head.appendChild(s)}return st}
async function render(st,q,host){host.innerHTML=page(st,q);if(document.fonts&&document.fonts.ready)await document.fonts.ready;
 await Promise.all([...host.querySelectorAll('img')].map(img=>img.complete&&img.naturalWidth?1:new Promise(r=>{img.onload=img.onerror=r})));const pg=host.querySelector('.cspage');return{pg,scale:fit(pg)}}
window.CS={CSS,page,aoa,
 fileName(st){const r=String(st.reefer||st.shipNo||'').replace(/[^A-Za-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'NA';const d=/^\d{4}-\d{2}-\d{2}$/.test(st.date||'')?st.date:new Date().toISOString().slice(0,10);return 'CostStatement_'+r+'_'+d+'.pdf'},
 async preview(st,q,host){stage();return render(st,q,host)},
 async pdf(st,q){const S=stage();const{pg,scale}=await render(st,q,S);const{jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'pt',format:'a4',compress:true});
  const cv=await html2canvas(pg,{scale:2,backgroundColor:'#fff',logging:false,width:794,height:1123,windowWidth:794});pdf.addImage(cv.toDataURL('image/jpeg',.92),'JPEG',0,0,595.28,841.89);
  const emb=embed(aoa(st,q));pdf.setFont('helvetica');pdf.setFontSize(2);(emb.match(/.{1,400}/g)||[]).forEach((l,i)=>pdf.text(l,2,3+i*2.2,{renderingMode:'invisible'}));
  const title='بيان تكلفة '+(st.no||'')+' '+(st.reefer||'')+' '+(st.date||'');pdf.setProperties({title,subject:title,keywords:emb,creator:'Al-Ola Cost Statement'});
  S.innerHTML='';return{blob:new Blob([patchPdfTitle(pdf.output('arraybuffer'),title)],{type:'application/pdf'}),scale}}};
})();
