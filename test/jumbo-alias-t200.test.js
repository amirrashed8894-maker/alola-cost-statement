/* t200 (أمير): «جامبو بلاستيك» و«جامبو بلاستيك 15 ك/كيلو» = عبوة واحدة في بيان التكلفة (الفارغ 0.65). تشغيل: node test/jumbo-alias-t200.test.js */
const assert=require('assert'),fs=require('fs'),vm=require('vm');
const src=fs.readFileSync(__dirname+'/../app.js','utf8');const pick=re=>{const m=src.match(re);assert(m,String(re));return m[0]};
const code=[pick(/^const AD=.*$/m),pick(/^const nk=.*$/m),pick(/^const PACKS149=.*$/m),pick(/^const jk=.*$/m),pick(/^function matchPack\(ctype\)\{[\s\S]*?return hit\?hit\.name:''\}/m)].join('\n');
const run=packs=>{const ctx={M:{packs}};vm.createContext(ctx);vm.runInContext(code+'\nthis.matchPack=matchPack;this.PACKS149=PACKS149;',ctx);return ctx};
let n=0;const t=(m,f)=>{f();n++;console.log('✓',m)};
const base=run([]).PACKS149.map(p=>Object.assign({},p));
t('الجامبو بكل أسمائه → «جامبو بلاستيك 15 ك» (0.65)',()=>{const c=run(base.concat([{name:'صندوق بلاستيك 8 ك',kg:0.35}]));
 ['جامبو بلاستيك','جامبو بلاستيك 15 كيلو','جامبو بلاستيك ١٥ كيلو','جامبو بلاستيك 15 ك','صندوق بلاستيك جامبو 15 ك','صندوق جامبو 15 كجم'].forEach(x=>assert.strictEqual(c.matchPack(x),'جامبو بلاستيك 15 ك',x));
 assert.strictEqual(base.find(p=>p.name==='جامبو بلاستيك 15 ك').kg,0.65)});
t('العبوات التانية زي ما هي (صندوق 8 ك مش جامبو، مقفول 15 ك)',()=>{const c=run(base.concat([{name:'صندوق بلاستيك 8 ك',kg:0.35}]));
 assert.strictEqual(c.matchPack('صندوق بلاستيك 8 ك'),'صندوق بلاستيك 8 ك');assert.strictEqual(c.matchPack('مقفول 15 ك'),'مقفول 15 ك');assert.strictEqual(c.matchPack('كرتون مقفول 15 كيلو'),'مقفول 15 ك');assert.strictEqual(c.matchPack('أوبن توب 7 ك'),'أوبن توب 7 ك')});
t('لو المستخدم عنده اسم جامبو تاني محفوظ (من غير الافتراضي) بيتلقط',()=>{const c=run([{name:'صندوق بلاستيك جامبو',kg:0.65},{name:'مقفول 15 ك',kg:0.85}]);assert.strictEqual(c.matchPack('جامبو بلاستيك 15 كيلو'),'صندوق بلاستيك جامبو')});
console.log(n+' اختبار عدّوا');
