/* Alola «بيان تكلفة» — official Alola letterhead (same mast/footer as packing-list app); one A4 page; ALOLADATA1 kind:'cost' embedded. */
(function(){
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fm=(v,d=0)=>Number(v||0).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const blockedOwner=s=>/ادريس|إدريس/.test(String(s??''));
const printOwner=s=>{const t=String(s??'').trim();return t&&!blockedOwner(t)?t:''};
function parseISO(s){const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(s||'').trim());return m?{y:+m[1],mo:+m[2],d:+m[3]}:null}
function todayCairo(){return parseISO(new Date().toLocaleDateString('en-CA',{timeZone:'Africa/Cairo'}))}
function ageDays(from){const a=parseISO(from),b=todayCairo();if(!a||!b)return null;return Math.floor((Date.UTC(b.y,b.mo-1,b.d)-Date.UTC(a.y,a.mo-1,a.d))/86400000)}
function ageLabel(from){const n=ageDays(from);return n==null?'—':Math.max(0,n)+' يوم'}
function dmy(iso){const a=parseISO(iso);return a?[String(a.d).padStart(2,'0'),String(a.mo).padStart(2,'0'),a.y].join('-'):(iso||'—')}
const CSS=`@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-arabic.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200E}
@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-latin.woff2) format('woff2')}
.cspage{width:794px;height:1123px;background:#fff;color:#1c1c1c;font-family:Cairo,Tahoma,Arial,sans-serif;direction:rtl;position:relative;overflow:hidden;box-sizing:border-box;font-weight:400}
.cspage .mast{display:flex;align-items:center;justify-content:space-between;padding:12px 22px 8px;min-height:78px;box-sizing:border-box}
.cspage .mast .nm{font-size:18px;font-weight:800;color:#1f8a12;line-height:1.25}
.cspage .mast .sub{font-size:11px;color:#3e6434;font-weight:600;margin-top:1px;direction:ltr;text-align:right}
.cspage .mast img{height:62px;width:auto;display:block}
.cspage .rule1{height:6px;background:#1f8a12}.cspage .rulegap{height:3px}.cspage .rule2{height:2px;background:#16700c}
.cspage .body{box-sizing:border-box;padding:8px 22px 0;font-weight:400}
.cspage h2{text-align:center;color:#111;margin:6px 0 0;font-size:22px;font-weight:400}
.cspage .who{text-align:center;margin:0 0 8px;font-weight:400;color:#111}
.cspage .meta{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #cfcfcf;border-radius:8px;overflow:hidden}
.cspage .meta div{padding:5px 8px;background:#fafafa;border-left:1px solid #e5e5e5}
.cspage .meta div:nth-child(3n){border-left:0}
.cspage .meta i{display:block;font-style:normal;color:#666;font-size:11px;font-weight:400}
.cspage .meta b{font-size:13px;font-weight:400}
.cspage .ageband{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 8px;margin-top:6px;background:#fafafa;border:1px solid #d0d0d0;border-radius:8px;font-size:13px;color:#111}
.cspage .ageband b{font-weight:400;direction:ltr}
.cspage h4{margin:10px 0 0;background:#f3f3f3;color:#111;padding:4px 8px;border-right:4px solid #666;font-size:13px;font-weight:400}
.cspage table{width:100%;border-collapse:collapse;font-size:12px;margin-top:0;font-weight:400}
.cspage th{background:#f0f0f0;color:#111;text-align:right;font-weight:400}
.cspage td,.cspage th{border:1px solid #d4d4d4;padding:4px 6px}
.cspage td.n{direction:ltr;text-align:left}
.cspage tr.tot td{font-weight:700;background:#efefef}
.cspage .band{display:flex;justify-content:space-between;gap:8px;padding:6px 8px;margin-top:6px;background:#fafafa;border:1px solid #d4d4d4;border-radius:8px;font-size:13px;font-weight:400}
.cspage .band b{direction:ltr;font-weight:400}
.cspage .band.tot{background:#efefef;font-weight:700}
.cspage .band.tot b{font-weight:700}
.cspage .fine{margin:2px 8px 0;color:#666;font-size:11px;font-weight:400}
.cspage .sg{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:18px;margin-bottom:8px;padding:0 8px;font-size:11px;text-align:center}
.cspage .sg div{border-top:1.5px solid #9a9a9a;padding-top:4px;color:#222;font-weight:400}
.cspage .dep{display:flex;align-items:center;gap:6px;font-size:11px;color:#333;margin:0;padding:6px 14px 2px;font-weight:400;background:#fff}
.cspage .dep img{height:20px}
.cspage .foot{position:absolute;left:0;right:0;bottom:0;background:#fff}
.cspage .pmeta{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;padding:4px 14px 5px;font-size:9px;color:#243024}
.cspage .pmeta span:nth-child(1){justify-self:start}.cspage .pmeta span:nth-child(2){text-align:center}.cspage .pmeta span:nth-child(3){justify-self:end}
.cspage .co{background:#1f8a12;color:#fff;min-height:84px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;padding:8px 16px;font-size:9.5px;line-height:1.45}
.cspage .co .r{display:flex;justify-content:space-between;gap:12px;align-items:center}.cspage .co .ln{height:1px;background:rgba(255,255,255,.8);margin:4px 0}`;
function mast(){return `<div class="mast"><div><div class="nm">شركة العلا لفرز الحاصلات الزراعية</div><div class="sub">Al Ola for Agricultural Crops Sorting</div></div><img src="alola_logo_green.png" alt=""></div><div class="rule1"></div><div class="rulegap"></div><div class="rule2"></div>`}
function foot(st){return `<div class="foot"><div class="dep"><img src="rashed_logo_gray.png" alt=""><span>اعتماد: شركة الراشد للتجارة</span></div><div class="pmeta"><span dir="ltr">${esc(st.no||'')}</span><span>بيان تكلفة — ${esc(st.reefer||'')} — <span dir="ltr">${esc(dmy(st.date))}</span></span><span>صفحة 1 من 1</span></div><div class="co"><div class="r"><span>العنوان: قطعة رقم ٢٠٦ ورقم ٢٠٨ - حوض البطن رقم ٥ - ترسا - طوخ - قليوبية</span><span dir="ltr">E-mail: alola.co2023@gmail.com</span></div><div class="ln"></div><div class="r"><span dir="ltr">Tel: 013/2604937 | Fax: 013/2604938</span><span>ب.ض 206232 · س.ت 798-899-781</span></div></div></div>`}
function metaCell(k,v){return `<div><i>${k}</i><b>${esc(v||'—')}</b></div>`}
function palletBlock(st){const rows=(st.pallets||[]).filter(p=>p&&String(p.date||'').trim());if(!rows.length)return '';
 const body=rows.map(p=>`<tr><td><span dir="ltr">${esc(p.p||p.id||'')}</span></td><td>${esc(p.name||'')}</td><td><span dir="ltr">${esc(p.date)}</span></td><td>${esc(ageLabel(p.date))}</td></tr>`).join('');
 return `<h4>الباليتات</h4><table><thead><tr><th>رقم الباليت</th><th>الصنف</th><th>تاريخ الإنتاج</th><th>عمر الباليت</th></tr></thead><tbody>${body}</tbody></table>`}
function page(st,q){
 const owner=printOwner(st.owner);
 const ded=q.deductions.map(d=>`<tr><td>${esc(d.name)}</td><td>${fm(d.count)}</td><td>${fm(d.unitKg,3)}</td><td>KG ${fm(d.weight,1)}</td></tr>`).join('');
 const lines=q.lines.map(p=>`<tr><td>${esc(p.name)}</td><td>KG ${fm(p.netKg,1)}</td><td>${p.pricePerTon===''?'—':fm(p.pricePerTon,2)}</td><td>${p.usd==null?'—':fm(p.usd,2)}</td><td>${p.egpTon==null?'—':fm(p.egpTon,2)}</td></tr>`).join('');
 return `<div class="cspage">${mast()}<div class="body"><h2>بيان تكلفة</h2>${owner?`<div class="who">${esc(owner)}</div>`:''}<div class="meta">${metaCell('رقم الشحنة',st.shipNo)}${metaCell('التاريخ',st.date)}${metaCell('المستورد',st.importer)}${metaCell('رقم البراد',st.reefer)}${metaCell('اسم السائق',st.driver)}${metaCell('الجهة',st.dest)}${metaCell('اللوط',st.lots)}${metaCell('رقم بيان التكلفة',st.no)}${metaCell('رقم الخطاب',st.letterNo)}</div>
<div class="ageband"><span>عمر البراد / الحاوية</span><b>${esc(ageLabel(st.date))}</b></div>
${palletBlock(st)}
<h4>يخصم (المهمات)</h4><table><thead><tr><th>الصنف</th><th>العدد</th><th>وزن الوحدة</th><th>الوزن</th></tr></thead><tbody>${ded}</tbody></table>
<div class="band"><span>الوزن القائم</span><b>KG ${fm(q.gross,1)}</b></div><p class="fine">وزن الشحنة القائم كما في الباكينج ليست</p>
<div class="band"><span>عدد العبوات</span><b>${fm(q.packages)}</b></div><p class="fine">${esc(q.packNote||'')}</p>
<div class="band"><span>إجمالي المخصوم</span><b>KG ${fm(q.tare,1)}</b></div><p class="fine">مجموع أوزان العبوات والباليتات</p>
<div class="band tot"><span>الوزن الصافي بدون مهمات</span><b>KG ${fm(q.net,1)}</b></div><p class="fine">الوزن القائم ناقص إجمالي المخصوم</p>
<h4>بيان التكلفة</h4><table><thead><tr><th>الصنف</th><th>الوزن الصافي</th><th>سعر الطن $</th><th>الإجمالي $</th><th>سعر الطن ج</th></tr></thead><tbody>${lines}<tr class="tot"><td>الإجمالي</td><td>KG ${fm(q.net,1)}</td><td></td><td>${q.ready?fm(q.usd,2):'—'}</td><td></td></tr></tbody></table><p class="fine">مجموع الوزن الصافي وتكلفة الأصناف بالدولار</p>
<div class="band"><span>سعر الصرف</span><b>${q.fxRate?fm(q.fxRate,2)+' ج':'—'}</b></div><p class="fine">${esc(st.fxNote||'')}</p>
<div class="band tot"><span>الإجمالي بالجنيه</span><b>${q.egp==null?'—':fm(q.egp,2)+' ج'}</b></div><p class="fine">الإجمالي بالدولار × سعر الصرف</p>
<div class="sg"><div>المورد</div><div>التوقيع</div><div>الاعتماد</div></div>
</div>${foot(st)}</div>`}
function fit(pg){const body=pg.querySelector('.body'),f=pg.querySelector('.foot');if(!body||!f)return 1;const avail=()=>f.offsetTop-body.offsetTop-6;if(body.scrollHeight>avail()){let s=avail()/body.scrollHeight;body.style.transformOrigin='top right';body.style.width=(body.offsetWidth/s)+'px';s=Math.min(s,avail()/body.scrollHeight);body.style.transform=`scale(${s})`;return Math.round(s*100)/100}return 1}
function aoa(st,q){const own=printOwner(st.owner);const pals=(st.pallets||[]).filter(p=>p&&String(p.date||'').trim());return [['بيان تكلفة — شركة العلا'],['رقم بيان التكلفة',st.no],['رقم الخطاب',st.letterNo||''],['المورد',own],['المستورد',st.importer||''],['رقم الشحنة',st.shipNo||''],['التاريخ',st.date||''],['رقم البراد',st.reefer||''],['عمر البراد / الحاوية',ageLabel(st.date)],['اسم السائق',st.driver||''],['الجهة',st.dest||''],['اللوط',st.lots||''],
 ['الوزن القائم',q.gross],['عدد العبوات',q.packages],['عدد الباليتات',q.palletCount],['إجمالي المخصوم',q.tare],['الوزن الصافي بدون مهمات',q.net],['الإجمالي $',q.ready?q.usd:''],['سعر الصرف',q.fxRate||''],['الإجمالي بالجنيه',q.egp==null?'':q.egp],['ملاحظة الصرف',st.fxNote||''],[],
 ['الخصم','العدد','وزن الوحدة','الوزن'],...q.deductions.map(d=>[d.name,d.count,d.unitKg,d.weight]),[],
 ['الصنف','نوع العبوة','عدد العبوات','الوزن الصافي','سعر الطن $','الإجمالي $','سعر الطن ج'],...q.lines.map(l=>[l.name,l.ctype||'',l.cartons,l.netKg,l.pricePerTon,l.usd==null?'':l.usd,l.egpTon==null?'':l.egpTon]),
 ...(pals.length?[[],['رقم الباليت','الصنف','تاريخ الإنتاج','عمر الباليت'],...pals.map(p=>[p.p||p.id||'',p.name||'',p.date,ageLabel(p.date)])]:[])]}
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
window.CS={CSS,page,aoa,ageDays,ageLabel,blockedOwner,printOwner,
 fileName(st){const r=String(st.reefer||st.shipNo||'').replace(/[^A-Za-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'NA';const d=/^\d{4}-\d{2}-\d{2}$/.test(st.date||'')?st.date:new Date().toISOString().slice(0,10);return 'CostStatement_'+r+'_'+d+'.pdf'},
 async preview(st,q,host){stage();return render(st,q,host)},
 async pdf(st,q){const S=stage();const{pg,scale}=await render(st,q,S);const{jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'pt',format:'a4',compress:true});
  const cv=await html2canvas(pg,{scale:2,backgroundColor:'#fff',logging:false,width:794,height:1123,windowWidth:794});pdf.addImage(cv.toDataURL('image/jpeg',.92),'JPEG',0,0,595.28,841.89);
  const emb=embed(aoa(st,q));pdf.setFont('helvetica');pdf.setFontSize(2);(emb.match(/.{1,400}/g)||[]).forEach((l,i)=>pdf.text(l,2,3+i*2.2,{renderingMode:'invisible'}));
  const title='بيان تكلفة '+(st.no||'')+' '+(st.reefer||'')+' '+(st.date||'');pdf.setProperties({title,subject:title,keywords:emb,creator:'Al-Ola Cost Statement'});
  S.innerHTML='';return{blob:new Blob([patchPdfTitle(pdf.output('arraybuffer'),title)],{type:'application/pdf'}),scale}}};
})();
