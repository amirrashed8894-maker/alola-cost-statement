/* Alola cost statement PWA — editor, masters, packing-list PDF import, local storage. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const AD=s=>String(s??'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const num=v=>{const s=AD(v).replace(/[٬,\s]/g,'').replace('٫','.');if(s==='')return '';const x=parseFloat(s);return isFinite(x)?x:''};
const fm=(v,d=0)=>Number(v||0).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const nk=s=>AD(s==null?'':s).replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[()\[\]:.#\/\\_\-–—]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Africa/Cairo'});
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const MK='alola_cost_masters_v1',SK='alola_cost_statements_v1',CK='alola_cost_current_v1';
const PALLET=SupplyCost.PALLET_NAME;
const DEF={owners:['محمد ادريس ابراهيم عيد'],importers:[],destinations:[],drivers:[],packs:[{name:'صندوق بلاستيك 8 ك',kg:0.35},{name:'كرتون مقفول 14 ك',kg:0.8},{name:'كرتون مقفول 8 ك',kg:0.45}],palletKg:20,prices:[],fx:'',fxNote:'',letterSeq:0,tcSeq:0};
let M;try{M=JSON.parse(localStorage.getItem(MK))}catch(e){}M=Object.assign(JSON.parse(JSON.stringify(DEF)),M||{});
let ST;try{ST=JSON.parse(localStorage.getItem(SK))}catch(e){}ST=Array.isArray(ST)?ST:[];
const saveM=()=>localStorage.setItem(MK,JSON.stringify(M)),saveST=()=>localStorage.setItem(SK,JSON.stringify(ST));
function blank(){return{id:uid(),no:'',letterNo:String((+M.letterSeq||0)+1),owner:M.owners[0]||'',importer:'',shipNo:'',date:today(),reefer:'',driver:'',dest:'',lots:'',gross:'',fx:M.fx||'',fxNote:M.fxNote||'',palletCount:'',palletKg:M.palletKg,lines:[],src:''}}
let C;try{C=JSON.parse(localStorage.getItem(CK))}catch(e){}if(!C||!C.id)C=blank();
const saveC=()=>localStorage.setItem(CK,JSON.stringify(C));
let TAB='ed';
function toast(t){const el=$('toast');el.textContent=t;el.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>el.style.display='none',2800)}
const packKg=name=>{const p=M.packs.find(x=>x.name===name);return p?p.kg:''};
const priceOf=name=>{const p=M.prices.find(x=>nk(x.name)===nk(name));return p?String(p.ton):''};
function matchPack(ctype){const c=String(ctype||'');const ex=M.packs.find(p=>nk(p.name)===nk(c)||nk(p.name).endsWith(nk(c)));if(ex)return ex.name;
 const n=(AD(c).match(/(\d+(?:\.\d+)?)\s*ك/)||[])[1];if(!n)return '';const box=/صندوق|بلاست/.test(c);
 const re=new RegExp('(^|\\D)'+n.replace('.','\\.')+'\\s*ك');const cand=M.packs.filter(p=>re.test(AD(p.name)));
 const hit=cand.find(p=>box?/صندوق|بلاست/.test(p.name):!/صندوق|بلاست/.test(p.name));return hit?hit.name:''}
function quote(st){const groups=st.lines.map((l,i)=>({key:'L'+i,name:l.name||'صنف',ctype:l.pack||l.ctype||'',cartons:+num(l.cartons)||0,fruit:+num(l.fruit)||0,pallets:0,packUnit:l.pack?packKg(l.pack):0}));const prices={};st.lines.forEach((l,i)=>prices['L'+i]=num(l.ton));
 return SupplyCost.quote({groups,palletCount:+num(st.palletCount)||0,grossManual:num(st.gross),prices,fxRate:num(st.fx),settings:{packWeights:{__pallet__:num(st.palletKg)===''?M.palletKg:num(st.palletKg)}}})}
// ---------- packing-list PDF import ----------
const CT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c}return t})();
const crc=s=>{let c=~0;for(let i=0;i<s.length;i++)c=CT[(c^s.charCodeAt(i))&255]^(c>>>8);return((~c)>>>0).toString(16).padStart(8,'0')};
function dec(txt){const s=String(txt).replace(/\s+/g,'');let m=s.match(/ALOLADATA1:([A-Za-z0-9+\/=]+):([0-9a-f]{8})/);
 if(!m){const h=s.match(/ALOLACHUNKS:(\d+):([0-9a-f]{8})~/);if(!h)return null;const parts=[];for(const x of s.matchAll(/~(\d{3}):([A-Za-z0-9+\/=]{1,60})~/g))parts[+x[1]]=x[2];for(let i=0;i<+h[1];i++)if(!parts[i])throw new Error('بيانات الـ PDF المدمجة ناقصة');m=[0,parts.join(''),h[2]]}
 if(crc(m[1])!==m[2])throw new Error('بيانات الـ PDF المدمجة تالفة');return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(m[1]),c=>c.charCodeAt(0))))}
async function readPdf(file){const buf=await file.arrayBuffer();const raw=new TextDecoder('latin1').decode(new Uint8Array(buf));let d=dec(raw);
 if(!d&&/MAGGIPL1:/.test(raw))throw new Error('ده باكينج ليست ماجي مش العلا');
 if(!d&&window.pdfjsLib){pdfjsLib.GlobalWorkerOptions.workerSrc='pdf.worker.min.js';const doc=await pdfjsLib.getDocument({data:new Uint8Array(buf),isEvalSupported:false}).promise;let meta='';try{const m=await doc.getMetadata();meta=(m.info&&m.info.Keywords)||''}catch(e){}
  let flat='';for(let i=1;i<=doc.numPages;i++){const tc=await(await doc.getPage(i)).getTextContent();flat+=tc.items.map(x=>x.str).join('')}d=dec(meta)||dec(flat);if(!d&&/MAGGIPL1:/.test(flat))throw new Error('ده باكينج ليست ماجي مش العلا')}
 if(!d)throw new Error('الملف ده مفيهوش بيانات باكينج ليست مدمجة. صدّره من برنامج الباكينج ليست أو من برنامج العلا.');
 if(d.app&&d.app!=='alola')throw new Error('الملف مش من برامج العلا');
 if(d.kind==='prod')throw new Error('ده تقرير إنتاج مش باكينج ليست');if(d.kind==='cost')throw new Error('ده بيان تكلفة متصدّر قبل كده مش باكينج ليست');return d.rows}
function fromRows(rows){const hi=rows.findIndex(r=>r&&r.some(c=>nk(c)==='رقم الباليت'));if(hi<0)throw new Error('مش لاقي جدول الباليتات في الملف');
 const head={};rows.slice(0,hi).forEach(r=>{if(r&&r.length>1&&r[0]!=null&&r[1]!=null&&String(r[1]).trim()!=='')head[nk(r[0])]=String(r[1]).trim()});
 const H=(...k)=>{for(const x of k){const v=head[nk(x)];if(v&&v!=='—')return v}return ''};
 const cols=rows[hi].map(nk);const ci=(...k)=>{for(const x of k){const i=cols.findIndex(c=>c===nk(x)||c.startsWith(nk(x)));if(i>=0)return i}return -1};
 const iP=ci('رقم الباليت'),iV=ci('الصنف'),iC=ci('نوع الكرتون'),iN=ci('عدد الكراتين','كراتين'),iW=ci('وزن الكرتونه');
 const g={},pals=new Set();
 rows.slice(hi+1).forEach(r=>{if(!r||r[iP]==null||String(r[iP]).trim()==='')return;const v=String(r[iV]??'').trim(),c=String(r[iC]??'').trim(),n=+num(r[iN])||0;let w=iW>=0?+num(r[iW]):0;if(!w){const m=AD(c).match(/(\d+(?:\.\d+)?)\s*ك/);w=m?+m[1]:0}
  pals.add(String(r[iP]).trim());const k=v+'|'+c;g[k]=g[k]||{name:(v+' '+c).replace(/\s+/g,' ').trim(),ctype:c,cartons:0,fruit:0,pallets:0,noW:false};g[k].cartons+=n;g[k].fruit+=n*w;g[k].pallets++;if(!w)g[k].noW=true});
 return{info:{reefer:H('رقم الحاوية / البراد','رقم الحاوية','رقم البراد'),date:H('تاريخ التحميل'),importer:H('اسم العميل','العميل'),lots:H('رقم اللوط'),dest:H('الوجهة'),driver:H('اسم السائق','السائق')},groups:Object.values(g),pallets:pals.size}}
async function importFile(file){$('busy').style.display='flex';try{const rows=await readPdf(file);const r=fromRows(rows);
  ['reefer','date','importer','lots','dest','driver'].forEach(k=>{if(r.info[k])C[k]=k==='date'?r.info[k].slice(0,10):r.info[k]});
  C.palletCount=String(r.pallets);C.lines=r.groups.map(x=>({name:x.name,ctype:x.ctype,pack:matchPack(x.ctype),cartons:String(x.cartons),fruit:String(Math.round(x.fruit*10)/10),ton:priceOf(x.name)}));C.src=file.name;
  ['importers','destinations','drivers'].forEach((k,i)=>{const v=[C.importer,C.dest,C.driver][i];if(v&&v!=='—'&&!M[k].includes(v))M[k].push(v)});saveM();saveC();TAB='ed';render();
  const miss=C.lines.filter(l=>!l.pack).length;toast('✔ اتقرا الباكينج ليست: '+r.pallets+' باليت'+(miss?' — حدد نوع العبوة لـ '+miss+' صنف':''))}
 catch(e){alert(e.message)}finally{$('busy').style.display='none'}}
// ---------- UI ----------
const dl=(id,list)=>`<datalist id="${id}">${list.map(x=>`<option value="${esc(x)}"></option>`).join('')}</datalist>`;
const fld=(k,label,o={})=>`<div><label>${label}</label><input data-f="${k}" value="${esc(C[k])}"${o.list?` list="${o.list}"`:''}${o.type?` type="${o.type}"`:''}${o.num?' inputmode="decimal"':''}${o.ph?` placeholder="${esc(o.ph)}"`:''}${o.ro?' readonly':''}${o.ltr?' dir="ltr"':''}></div>`;
function editor(){const q=quote(C);
 const packOpts=v=>`<option value="">— نوع العبوة —</option>`+M.packs.map(p=>`<option${p.name===v?' selected':''} value="${esc(p.name)}">${esc(p.name)} (${fm(p.kg,3)})</option>`).join('')+(v&&!M.packs.some(p=>p.name===v)?`<option selected>${esc(v)}</option>`:'');
 const lines=C.lines.map((l,i)=>{const ql=q.lines[i]||{};return `<tr><td><input data-l="${i}" data-k="name" value="${esc(l.name)}" list="dlPrices" style="min-width:170px"></td><td><select data-l="${i}" data-k="pack" class="${l.pack?'':'miss'}">${packOpts(l.pack)}</select></td><td><input data-l="${i}" data-k="cartons" value="${esc(l.cartons)}" inputmode="numeric" style="width:80px"></td><td><input data-l="${i}" data-k="fruit" value="${esc(l.fruit)}" inputmode="decimal" style="width:95px"></td><td>${fm(ql.netKg,1)}</td><td><input data-l="${i}" data-k="ton" value="${esc(l.ton)}" inputmode="decimal" class="${l.ton===''?'miss':''}" style="width:85px"></td><td>${ql.usd==null?'—':fm(ql.usd,2)}</td><td>${ql.egpTon==null?'—':fm(ql.egpTon,2)}</td><td><button class="btn3 sm" data-del="${i}" type="button">×</button></td></tr>`}).join('');
 const ded=q.deductions.map(d=>`<tr><td>${esc(d.name)}</td><td>${fm(d.count)}</td><td>${fm(d.unitKg,3)}</td><td>${fm(d.weight,1)}</td></tr>`).join('');
 return `<div class="card"><h2>ربط الباكينج ليست</h2><div class="drop" id="drop">اسحب ملف PDF الباكينج ليست هنا أو اضغط لاختياره<div class="hint">من برنامج الباكينج ليست أو من برنامج العلا — بيملا البراد والتاريخ واللوط والسائق والجهة والأصناف وعدد العبوات والباليتات</div></div>${C.src?`<div class="msg ok">آخر ملف: ${esc(C.src)}</div>`:''}</div>
 <div class="card"><h2>بيانات البيان ${C.no?esc(C.no):'<span class="hint">(رقم البيان يتحدد عند الحفظ)</span>'}</h2><div class="g3">
 ${fld('owner','الاسم في رأس البيان (المورد)',{list:'dlOwners'})}${fld('importer','المستورد',{list:'dlImp'})}${fld('shipNo','رقم الشحنة')}${fld('date','التاريخ',{type:'date'})}${fld('reefer','رقم البراد',{ltr:1})}${fld('driver','اسم السائق',{list:'dlDrv'})}${fld('dest','الجهة',{list:'dlDest'})}${fld('lots','اللوط')}${fld('no','رقم بيان التكلفة',{ro:1,ph:'TC- تلقائي'})}${fld('letterNo','رقم الخطاب',{num:1})}
 ${fld('gross','الوزن القائم كجم',{num:1,ph:'تلقائي: '+fm(q.grossAuto,1)})}${fld('palletCount','عدد الباليتات',{num:1})}${fld('palletKg','وزن طقم الباليت كجم',{num:1})}${fld('fx','سعر الصرف (ج للدولار)',{num:1})}${fld('fxNote','ملاحظة الصرف')}</div>
 ${dl('dlOwners',M.owners)}${dl('dlImp',M.importers)}${dl('dlDest',M.destinations)}${dl('dlDrv',M.drivers)}${dl('dlPrices',M.prices.map(p=>p.name))}
 <h3>الأصناف</h3><div class="tw"><table><tr><th>الصنف</th><th>نوع العبوة (المهمات)</th><th>عدد العبوات</th><th>وزن الثمرة كجم</th><th>الوزن الصافي</th><th>سعر الطن $</th><th>الإجمالي $</th><th>سعر الطن ج</th><th></th></tr>${lines||'<tr><td colspan="9" class="hint">اسحب ملف باكينج ليست أو أضف صنف</td></tr>'}</table></div>
 <button class="btn2 sm" id="addL" type="button" style="margin-top:6px">+ صنف</button>
 <div class="hint" style="margin-top:4px">وزن الثمرة = العبوات × وزن العبوة من الباكينج. لو كتبت الوزن القائم، الصافي بيتوزع على الأصناف بنفس النسبة.</div>
 <h3>يخصم (المهمات)</h3><div class="tw"><table><tr><th>الصنف</th><th>العدد</th><th>وزن الوحدة</th><th>الوزن</th></tr>${ded}</table></div>
 <div class="k"><div><span>الوزن القائم</span><b>${fm(q.gross,1)}</b></div><div><span>عدد العبوات</span><b>${fm(q.packages)}</b></div><div><span>إجمالي المخصوم</span><b>${fm(q.tare,1)}</b></div><div><span>الصافي بدون مهمات</span><b>${fm(q.net,1)}</b></div><div><span>الإجمالي $</span><b>${q.ready?fm(q.usd,2):'—'}</b></div><div><span>سعر الصرف</span><b>${q.fxRate?fm(q.fxRate,2):'—'}</b></div><div><span>الإجمالي بالجنيه</span><b>${q.egp==null?'—':fm(q.egp,2)}</b></div><div><span>الحالة</span><b style="font-size:13px">${C.no?'محفوظ — التعديل بنفس الرقم':'جديد'}</b></div></div></div>`}
function list(){const rows=ST.slice().sort((a,b)=>(b.no||'').localeCompare(a.no||'')).map(s=>{const q=quote(s);return `<tr><td><b>${esc(s.no)}</b></td><td>${esc(s.date)}</td><td dir="ltr">${esc(s.reefer)}</td><td>${esc(s.importer)}</td><td>${fm(q.net,1)}</td><td>${q.ready?fm(q.usd,2):'—'}</td><td>${q.egp==null?'—':fm(q.egp,2)}</td><td><button class="btn2 sm" data-open="${s.id}" type="button">فتح وتعديل</button> <button class="btn3 sm" data-rm="${s.id}" type="button">حذف</button></td></tr>`}).join('');
 return `<div class="card"><h2>البيانات المحفوظة على الجهاز (${ST.length})</h2><div class="tw"><table><tr><th>الرقم</th><th>التاريخ</th><th>البراد</th><th>المستورد</th><th>الصافي كجم</th><th>$</th><th>ج</th><th></th></tr>${rows||'<tr><td colspan="8" class="hint">لا يوجد</td></tr>'}</table></div><div class="hint">البيان المفتوح بيتعدل ويتحفظ بنفس رقمه.</div></div>`}
function masters(){const simple=(k,t)=>`<div class="card"><h2>${t}</h2>${M[k].map((v,i)=>`<div class="li"><input data-ml="${k}" data-i="${i}" value="${esc(v)}"><button class="btn3 sm" data-mdel="${k}" data-i="${i}" type="button">حذف</button></div>`).join('')||'<div class="hint">فاضية</div>'}<div class="li"><input id="add_${k}" placeholder="إضافة جديد"><button class="btn sm" data-madd="${k}" type="button">إضافة</button></div></div>`;
 return simple('owners','الموردون (الاسم في رأس البيان)')+simple('importers','المستوردون')+simple('destinations','الجهات')+simple('drivers','السائقون')+
 `<div class="card"><h2>المهمات (العبوات) ووزن الوحدة كجم</h2>${M.packs.map((p,i)=>`<div class="li"><input data-pk="${i}" data-k="name" value="${esc(p.name)}"><input data-pk="${i}" data-k="kg" value="${esc(p.kg)}" inputmode="decimal" style="max-width:110px"><button class="btn3 sm" data-pkdel="${i}" type="button">حذف</button></div>`).join('')}<div class="li"><input id="pkN" placeholder="اسم العبوة"><input id="pkK" placeholder="كجم" inputmode="decimal" style="max-width:110px"><button class="btn sm" id="pkAdd" type="button">إضافة</button></div>
 <div class="li"><span style="flex:1">${esc(PALLET)} — كجم للطقم</span><input id="palKg" value="${esc(M.palletKg)}" inputmode="decimal" style="max-width:110px"></div></div>
 <div class="card"><h2>أسعار الطن بالدولار لكل صنف</h2>${M.prices.map((p,i)=>`<div class="li"><input data-pr="${i}" data-k="name" value="${esc(p.name)}"><input data-pr="${i}" data-k="ton" value="${esc(p.ton)}" inputmode="decimal" style="max-width:110px"><button class="btn3 sm" data-prdel="${i}" type="button">حذف</button></div>`).join('')}<div class="li"><input id="prN" placeholder="اسم الصنف كما في البيان" list="dlLines"><input id="prT" placeholder="$ للطن" inputmode="decimal" style="max-width:110px"><button class="btn sm" id="prAdd" type="button">إضافة</button></div>${dl('dlLines',C.lines.map(l=>l.name))}<div class="hint">السعر بيتحط تلقائياً لما اسم الصنف في البيان يطابق.</div></div>
 <div class="card"><h2>سعر الصرف وأرقام البيانات</h2><div class="g3"><div><label>جنيه لكل دولار</label><input id="mFx" value="${esc(M.fx)}" inputmode="decimal"></div><div><label>ملاحظة الصرف</label><input id="mFxN" value="${esc(M.fxNote)}"></div><div><label>آخر رقم خطاب</label><input id="mLet" value="${esc(M.letterSeq)}" inputmode="numeric"></div><div><label>آخر رقم بيان TC</label><input id="mTc" value="${esc(M.tcSeq)}" inputmode="numeric"></div></div><button class="btn" id="mSave" type="button" style="margin-top:8px">حفظ</button></div>`}
function render(){$('tEd').classList.toggle('on',TAB==='ed');$('tLs').classList.toggle('on',TAB==='ls');$('tMs').classList.toggle('on',TAB==='ms');$('acts').style.display=TAB==='ed'?'grid':'none';
 $('m').innerHTML=TAB==='ed'?editor():TAB==='ls'?list():masters();const q=quote(C);$('stat').innerHTML=(C.no||'بيان جديد')+'<br>'+(q.ready?fm(q.usd,2)+' $':'')}
$('tEd').onclick=()=>{TAB='ed';render()};$('tLs').onclick=()=>{TAB='ls';render()};$('tMs').onclick=()=>{TAB='ms';render()};
$('m').addEventListener('change',ev=>{const t=ev.target;
 if(t.dataset.f){C[t.dataset.f]=t.value;saveC();render();return}
 if(t.dataset.l!=null){const l=C.lines[+t.dataset.l];l[t.dataset.k]=t.value;if(t.dataset.k==='name'&&!l.ton)l.ton=priceOf(t.value);saveC();render();return}
 if(t.dataset.ml){M[t.dataset.ml][+t.dataset.i]=t.value.trim();M[t.dataset.ml]=M[t.dataset.ml].filter(Boolean);saveM();render();return}
 if(t.dataset.pk!=null){const p=M.packs[+t.dataset.pk];const old=p.name;p[t.dataset.k]=t.dataset.k==='kg'?(+num(t.value)||0):t.value.trim();if(t.dataset.k==='name')C.lines.forEach(l=>{if(l.pack===old)l.pack=p.name});saveM();saveC();render();return}
 if(t.dataset.pr!=null){const p=M.prices[+t.dataset.pr];p[t.dataset.k]=t.dataset.k==='ton'?String(num(t.value)):t.value.trim();saveM();render();return}
 if(t.id==='palKg'){M.palletKg=+num(t.value)||0;saveM();return}});
$('m').addEventListener('click',ev=>{const t=ev.target;
 if(t.id==='drop')return $('fin').click();if(t.closest&&t.closest('#drop'))return $('fin').click();
 if(t.id==='addL'){C.lines.push({name:'',ctype:'',pack:'',cartons:'',fruit:'',ton:''});saveC();render();return}
 if(t.dataset.del!=null){C.lines.splice(+t.dataset.del,1);saveC();render();return}
 if(t.dataset.open){const s=ST.find(x=>x.id===t.dataset.open);if(s){C=JSON.parse(JSON.stringify(s));saveC();TAB='ed';render()}return}
 if(t.dataset.rm){const s=ST.find(x=>x.id===t.dataset.rm);if(s&&confirm('حذف البيان '+s.no+' من الجهاز؟')){ST=ST.filter(x=>x.id!==s.id);saveST();if(C.id===s.id){C=blank();saveC()}render()}return}
 if(t.dataset.madd){const k=t.dataset.madd,v=$('add_'+k).value.trim();if(v&&!M[k].includes(v)){M[k].push(v);saveM()}render();return}
 if(t.dataset.mdel){M[t.dataset.mdel].splice(+t.dataset.i,1);saveM();render();return}
 if(t.dataset.pkdel!=null){if(confirm('حذف العبوة؟')){M.packs.splice(+t.dataset.pkdel,1);saveM();render()}return}
 if(t.id==='pkAdd'){const n=$('pkN').value.trim(),k=num($('pkK').value);if(n&&k!==''){M.packs.push({name:n,kg:+k});saveM()}render();return}
 if(t.dataset.prdel!=null){M.prices.splice(+t.dataset.prdel,1);saveM();render();return}
 if(t.id==='prAdd'){const n=$('prN').value.trim(),k=num($('prT').value);if(n){const ex=M.prices.find(p=>nk(p.name)===nk(n));if(ex)ex.ton=String(k);else M.prices.push({name:n,ton:String(k)});C.lines.forEach(l=>{if(nk(l.name)===nk(n)&&!l.ton)l.ton=String(k)});saveM();saveC()}render();return}
 if(t.id==='mSave'){M.fx=String(num($('mFx').value));M.fxNote=$('mFxN').value.trim();const a=parseInt(AD($('mLet').value),10),b=parseInt(AD($('mTc').value),10);if(a>=0)M.letterSeq=a;if(b>=0)M.tcSeq=b;saveM();toast('✔ اتحفظ');render()}});
$('m').addEventListener('dragover',ev=>{const d=ev.target.closest&&ev.target.closest('#drop');if(d){ev.preventDefault();d.classList.add('over')}});
$('m').addEventListener('dragleave',ev=>{const d=ev.target.closest&&ev.target.closest('#drop');if(d)d.classList.remove('over')});
$('m').addEventListener('drop',ev=>{const d=ev.target.closest&&ev.target.closest('#drop');if(!d)return;ev.preventDefault();d.classList.remove('over');const f=ev.dataTransfer.files[0];if(f)importFile(f)});
document.addEventListener('dragover',ev=>ev.preventDefault());document.addEventListener('drop',ev=>{if(!(ev.target.closest&&ev.target.closest('#drop'))){ev.preventDefault();const f=ev.dataTransfer&&ev.dataTransfer.files[0];if(f&&TAB==='ed')importFile(f)}});
$('fin').onchange=()=>{const f=$('fin').files[0];$('fin').value='';if(f)importFile(f)};
function problems(){const p=[];if(!C.lines.length)p.push('مفيش أصناف');C.lines.forEach((l,i)=>{if(!l.name)p.push('صنف '+(i+1)+' بدون اسم');if(!l.pack)p.push('حدد نوع العبوة لـ «'+(l.name||i+1)+'»');if(l.ton===''||num(l.ton)==='')p.push('سعر الطن ناقص لـ «'+(l.name||i+1)+'»')});if(num(C.fx)==='')p.push('سعر الصرف ناقص');return p}
function commit(){if(!C.no){M.tcSeq=(+M.tcSeq||0)+1;C.no='TC-'+String(M.tcSeq).padStart(6,'0');const ln=parseInt(AD(C.letterNo),10);if(ln>(+M.letterSeq||0))M.letterSeq=ln;saveM();C.created=new Date().toISOString()}
 C.updated=new Date().toISOString();['importers','destinations','drivers','owners'].forEach((k,i)=>{const v=(C[['importer','dest','driver','owner'][i]]||'').trim();if(v&&v!=='—'&&v!=='-'&&!M[k].includes(v))M[k].push(v)});saveM();
 const i=ST.findIndex(x=>x.id===C.id);if(i>=0)ST[i]=JSON.parse(JSON.stringify(C));else ST.push(JSON.parse(JSON.stringify(C)));saveST();saveC()}
function guard(){const p=problems();if(p.length&&!confirm('ملاحظات قبل الحفظ:\n• '+p.join('\n• ')+'\n\nتكمل برضه؟'))return false;return true}
$('bSave').onclick=()=>{if(!guard())return;commit();render();toast('✔ اتحفظ '+C.no)};
async function makePdf(){$('busy').style.display='flex';try{const r=await CS.pdf(C,quote(C));return{blob:r.blob,name:CS.fileName(C)}}catch(e){alert('خطأ أثناء تجهيز الـ PDF: '+e.message);return null}finally{$('busy').style.display='none'}}
function download(f){const u=URL.createObjectURL(f.blob);const a=document.createElement('a');a.href=u;a.download=f.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);toast('✔ اتحفظ: '+f.name)}
$('bPdf').onclick=async()=>{if(!guard())return;commit();render();const f=await makePdf();if(f)download(f)};
$('pvPdf').onclick=async()=>{const f=await makePdf();if(f)download(f)};
$('bPrev').onclick=async()=>{if(!guard())return;commit();render();$('busy').style.display='flex';try{const w=$('pvw');const r=await CS.preview(C,quote(C),w);const sc=Math.min(1,(window.innerWidth-24)/794);w.style.transform=`scale(${sc})`;w.style.height=(1123*sc)+'px';$('pv').style.display='block';if(r.scale<1)toast('تم تصغير المحتوى تلقائياً عشان البيان يطلع في صفحة واحدة')}finally{$('busy').style.display='none'}};
$('pvPrint').onclick=()=>{const w=$('pvw');const t=w.style.transform;w.style.transform='none';window.print();w.style.transform=t};
$('pvClose').onclick=()=>{$('pv').style.display='none'};
$('bNew').onclick=()=>{if(C.lines.length&&!C.no&&!confirm('البيان الحالي مش محفوظ. تبدأ بيان جديد؟'))return;C=blank();saveC();render()};
window.APP={get C(){return C},set(x){C=Object.assign(blank(),x);saveC();render()},M:()=>M,quote,commit,importFile,render};
render();
})();
