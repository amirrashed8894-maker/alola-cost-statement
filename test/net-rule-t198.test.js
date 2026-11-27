/* مراجعة t198: بيان التكلفة الأونلاين = Al-Ola Station 1.4.11 (SupplyCost.quote بقاعدة cartonGross) بالظبط. تشغيل: node test/net-rule-t198.test.js [مسار supply-cost.js بتاع المحطة] */
const assert=require('assert'),path=require('path'),fs=require('fs');
const ON=require('../supply-cost.js');const stPath=process.argv[2]||'/workspace/alola_sunfruit/station/app/supply-cost.js';
const ST=fs.existsSync(stPath)?require(stPath):null;let n=0,chk=0;const t=(m,f)=>{f();n++;console.log('✓',m)};
t('SEGU 9047590 (باكينج أمير): القائم 25,520 − 1,846.8 = 23,673.2 والسطور 22,415.5 + 1,257.7 و $14,951.85',()=>{
 const q=ON.quote({groups:[{key:'a',name:'أبو سرة مقفول صغير 7 ك',ctype:'مقفول صغير 7 ك',cartons:3040,fruit:21280,packUnit:0.45},{key:'b',name:'أبو سرة أوبن توب 7 ك',ctype:'أوبن توب 7 ك',cartons:168,fruit:1176,packUnit:0.35}],
  palletCount:21,grossManual:25520,prices:{a:630,b:660},fxRate:47.6,settings:{packWeights:{__pallet__:20}},cartonGross:true});
 assert.strictEqual(q.tare,1846.8);assert.strictEqual(q.net,23673.2);assert.deepStrictEqual(q.lines.map(l=>l.netKg),[22415.5,1257.7]);assert.strictEqual(q.usd,14951.85);assert.strictEqual(q.egp,711708.06)});
t('من غير ميزان: الصافي = الكراتين × وزن الكرتونة − الكراتين الفاضية (الباليت في القائم بس)',()=>{
 const q=ON.quote({groups:[{key:'a',name:'x',ctype:'كرتون مقفول 8 ك',cartons:1600,fruit:13440,packUnit:0.45}],palletCount:20,settings:{packWeights:{__pallet__:20}},cartonGross:true});
 assert.strictEqual(q.net,12720);assert.strictEqual(q.gross,13840)});
t('بيان قديم (من غير cartonGross) زي ما هو',()=>{const q=ON.quote({groups:[{key:'a',name:'x',ctype:'كرتون مقفول 8 ك',cartons:1600,fruit:13440,packUnit:0.45}],palletCount:20,settings:{packWeights:{__pallet__:20}}});assert.strictEqual(q.net,13440)});
if(ST)t('1000 بيان عشوائي: الأونلاين = المحطة 1.4.11 في كل رقم',()=>{let seed=11;const R=()=>(seed=(seed*16807)%2147483647)/2147483647;
 for(let k=0;k<1000;k++){const ng=1+Math.floor(R()*4),groups=[],prices={};for(let i=0;i<ng;i++){const c=Math.floor(R()*3000),w=[7,7.15,8,14,15,7.5][Math.floor(R()*6)];groups.push({key:'g'+i,name:'g'+i,ctype:'c'+i,cartons:c,fruit:Math.round(c*w*10)/10,packUnit:[0.35,0.45,0.8,0.85,0.65][Math.floor(R()*5)]});if(R()>0.1)prices['g'+i]=Math.round(300+R()*700)}
  const opt={groups,palletCount:Math.floor(R()*24),grossManual:R()>0.4?Math.round(5000+R()*25000):'',prices,fxRate:R()>0.2?+(45+R()*10).toFixed(2):'',settings:{packWeights:{__pallet__:20}},cartonGross:true};
  const a=ON.quote(JSON.parse(JSON.stringify(opt))),b=ST.quote(JSON.parse(JSON.stringify(opt)));
  for(const f of ['gross','grossAuto','tare','net','fruitTotal','usd','egp','packages','palletCount','ready']){chk++;assert.deepStrictEqual(a[f],b[f],'k'+k+' '+f)}
  a.lines.forEach((l,i)=>{for(const f of ['netKg','usd','packWeight','egpTon']){chk++;assert.deepStrictEqual(l[f],b.lines[i][f],'k'+k+' line '+i+' '+f)}})}
 console.log('  '+chk+' رقم متطابق')});
console.log(n+' اختبار عدّوا');
