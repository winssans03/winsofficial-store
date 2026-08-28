const KEY='wins_products_v1', OKEY='wins_orders_v1';
const seed=[
{id:1,name:'Panel Pterodactyl 4GB',cat:'panel',price:4000,stock:25,desc:'Panel untuk kebutuhan server.'},
{id:2,name:'Panel Pterodactyl 8GB',cat:'panel',price:6000,stock:20,desc:'Resource lebih besar untuk server.'},
{id:3,name:'VPS Starter',cat:'vps',price:12000,stock:10,desc:'VPS untuk website, aplikasi, dan development legal.'},
{id:4,name:'Nokos',cat:'nokos',price:5000,stock:50,desc:'Nomor virtual dari provider yang sesuai ketentuan.'},
{id:5,name:'Nokos Telegram',cat:'telegram',price:7000,stock:30,desc:'Nomor virtual untuk penggunaan akun yang sah.'}
];
function get(k,s){try{return JSON.parse(localStorage.getItem(k))||s}catch(e){return s}}
function set(k,v){localStorage.setItem(k,JSON.stringify(v))}
if(!localStorage.getItem(KEY)) set(KEY,seed);
const rupiah=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const products=get(KEY,seed), orders=get(OKEY,[]);
document.querySelector('#productCount')?.replaceChildren(String(products.length));

const box=document.querySelector('#products');
if(box){
 const cat=new URLSearchParams(location.search).get('cat');
 box.innerHTML=products.filter(p=>!cat||p.cat===cat).map(p=>`<article class="card"><div class="icon">${p.cat==='vps'?'☁️':p.cat==='panel'?'🖥️':p.cat==='telegram'?'✈️':'📱'}</div><small>${p.cat.toUpperCase()}</small><h3>${p.name}</h3><p>${p.desc}</p><div class="price">${rupiah(p.price)}</div><span class="stock">Stok ${p.stock}</span><button class="btn blue full" onclick="buy(${p.id})">Beli Sekarang</button></article>`).join('');
}
window.buy=id=>{location.href='checkout.html?id='+id};

const form=document.querySelector('#checkoutForm');
if(form){
 const id=Number(new URLSearchParams(location.search).get('id')); const p=products.find(x=>x.id===id);
 if(p){product.value=p.name; total.textContent=rupiah(p.price)}
 form.addEventListener('submit',e=>{
  e.preventDefault(); const p2=products.find(x=>x.id===id); if(!p2||p2.stock<1)return alert('Stok habis.');
  const order={id:'WO'+Date.now().toString().slice(-8),product:p2.name,price:p2.price,name:name.value,phone:phone.value,note:note.value,status:'Menunggu pembayaran',created:new Date().toLocaleString('id-ID')};
  const os=get(OKEY,[]); os.unshift(order); set(OKEY,os); p2.stock--; set(KEY,products);
  const msg=encodeURIComponent(`Halo Admin WINSOFFICIAL,\nOrder: ${order.id}\nProduk: ${order.product}\nNama: ${order.name}\nWhatsApp: ${order.phone}\nTotal: ${rupiah(order.price)}\nCatatan: ${order.note||'-'}`);
  alert('Pesanan dibuat. Selanjutnya konfirmasi ke admin.');
  location.href='https://t.me/woftcx?text='+msg;
 });
}
const ob=document.querySelector('#orders');
if(ob){const os=get(OKEY,[]);ob.innerHTML=os.length?os.map(o=>`<div class="order"><b>${o.id}</b><h3>${o.product}</h3><span>${rupiah(o.price)} · ${o.status}</span><small>${o.created}</small></div>`).join(''):'<div class="box muted">Belum ada pesanan.</div>'}

function renderAdmin(){
 const ps=get(KEY,seed),os=get(OKEY,[]);
 const sp=document.querySelector('#statProducts'); if(!sp)return;
 sp.textContent=ps.length; document.querySelector('#statOrders').textContent=os.length; document.querySelector('#statStock').textContent=ps.reduce((a,p)=>a+p.stock,0);
 document.querySelector('#adminProducts').innerHTML=ps.map(p=>`<div class="admin-row"><div><b>${p.name}</b><small>${rupiah(p.price)} · stok ${p.stock}</small></div><button onclick="delProduct(${p.id})">Hapus</button></div>`).join('');
 document.querySelector('#adminOrders').innerHTML=os.slice(0,20).map(o=>`<div class="admin-row"><div><b>${o.id} — ${o.product}</b><small>${o.name} · ${rupiah(o.price)} · ${o.status}</small></div></div>`).join('')||'<p class="muted">Belum ada pesanan.</p>';
}
window.delProduct=id=>{if(confirm('Hapus produk?')){set(KEY,get(KEY,seed).filter(p=>p.id!==id));renderAdmin()}};
document.querySelector('#addProduct')?.addEventListener('submit',e=>{
 e.preventDefault();const ps=get(KEY,seed);ps.push({id:Date.now(),name:pname.value,cat:pcat.value,price:Number(pprice.value),stock:Number(pstock.value),desc:pdesc.value||'Produk digital WINSOFFICIAL.'});set(KEY,ps);e.target.reset();renderAdmin();
});
renderAdmin();
document.querySelector('.hamb')?.addEventListener('click',()=>document.querySelector('nav').classList.toggle('show'));
