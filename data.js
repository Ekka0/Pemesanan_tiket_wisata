const KEY='tiketWisataV1';
const DEF={dest:[{id:'D1',nama:'Pantai Indah',harga:25000,kuota:100},{id:'D2',nama:'Taman Hutan',harga:15000,kuota:50},{id:'D3',nama:'Air Terjun',harga:20000,kuota:30}],trx:[],seq:0};
let db;
function load(){let r=null;try{r=JSON.parse(localStorage.getItem(KEY))}catch(e){}
  db=(r&&Array.isArray(r.dest)&&r.dest.length&&Array.isArray(r.trx))?r:JSON.parse(JSON.stringify(DEF));
  if(!db.seq)db.seq=db.trx.length}
function save(){try{localStorage.setItem(KEY,JSON.stringify(db));return true}catch(e){return false}}
const $=id=>document.getElementById(id);
const rp=n=>'Rp'+n.toLocaleString('id-ID');
function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function msg(id,t,ok){const e=$(id);e.textContent=t;e.className='msg '+(ok?'ok':'err')}
function esc(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function terjual(dId,tgl){return db.trx.filter(t=>t.dId===dId&&t.tgl===tgl&&t.status==='Aktif').reduce((a,t)=>a+t.jml,0)}
function sisa(dId,tgl){const d=db.dest.find(x=>x.id===dId);return d.kuota-terjual(dId,tgl)}
function validasiPesan(f){
  const nama=f.nama.trim();
  if(!nama)return'Nama pemesan wajib diisi.';
  if(nama.length<3)return'Nama minimal 3 karakter.';
  if(!/^[A-Za-z\s.'-]+$/.test(nama))return'Nama hanya boleh berisi huruf.';
  if(!f.hp.trim())return'No. HP wajib diisi.';
  if(!/^08\d{8,11}$/.test(f.hp.trim()))return'Format No. HP tidak valid (harus diawali 08, 10–13 digit).';
  if(!f.tgl)return'Tanggal kunjungan wajib diisi.';
  const t=new Date();const today=ymd(t);t.setDate(t.getDate()+90);
  if(f.tgl<today)return'Tanggal kunjungan tidak boleh di masa lalu.';
  if(f.tgl>ymd(t))return'Tanggal kunjungan maksimal 90 hari ke depan.';
  if(f.jml.trim()==='')return'Jumlah tiket wajib diisi.';
  if(!/^\d+$/.test(f.jml.trim()))return'Jumlah tiket harus berupa angka bulat.';
  const j=+f.jml;
  if(j<1)return'Jumlah tiket minimal 1.';
  if(j>10)return'Jumlah tiket maksimal 10 per transaksi.';
  if(db.trx.some(x=>x.status==='Aktif'&&x.nama.toLowerCase()===nama.toLowerCase()&&x.hp===f.hp.trim()&&x.dId===f.dId&&x.tgl===f.tgl))return'Pesanan duplikat: pemesan yang sama sudah memesan destinasi & tanggal ini.';
  const s=sisa(f.dId,f.tgl);
  if(j>s)return'Kuota tidak mencukupi. Sisa kuota pada tanggal tersebut: '+s+' tiket.';
  return null;
}