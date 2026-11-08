function ubahKuota(){
  const v=$('kv').value.trim();
  if(v==='')return msg('m2','Kuota baru wajib diisi.',false);
  if(!/^\d+$/.test(v))return msg('m2','Kuota harus berupa angka bulat.',false);
  const n=+v;
  if(n<1||n>1000)return msg('m2','Kuota harus antara 1 dan 1000.',false);
  const d=db.dest.find(x=>x.id===$('kd').value);
  const maxJual=Math.max(0,...db.trx.filter(t=>t.dId===d.id&&t.status==='Aktif').map(t=>terjual(d.id,t.tgl)));
  if(n<maxJual)return msg('m2','Kuota tidak boleh di bawah jumlah tiket yang sudah terjual ('+maxJual+').',false);
  const lama=d.kuota;d.kuota=n;
  if(!save()){d.kuota=lama;return msg('m2','Gagal menyimpan data.',false)}
  msg('m2','Kuota '+d.nama+' diubah menjadi '+n+'.',true);$('kv').value='';render();
}
function batal(id){const t=db.trx.find(x=>x.id===id);if(!t||t.status!=='Aktif')return msg('m3','Transaksi tidak dapat dibatalkan.',false);
  t.status='Dibatalkan';save();msg('m3',id+' dibatalkan, kuota dikembalikan.',true);render()}
function hapus(id){if(!confirm('Hapus '+id+' secara permanen?'))return;db.trx=db.trx.filter(x=>x.id!==id);save();msg('m3',id+' dihapus.',true);render()}
function render(){
  const ck=$('kd').value;
  $('kd').innerHTML=db.dest.map(d=>`<option value="${d.id}">${d.nama}</option>`).join('');
  if(ck)$('kd').value=ck;
  $('kuota').innerHTML=db.dest.map(d=>`<tr><td>${d.nama}</td><td>${rp(d.harga)}</td><td>${d.kuota}</td></tr>`).join('');
  const a=db.trx.filter(t=>t.status==='Aktif');
  $('rekap').innerHTML=`<div class="stat"><span>Transaksi aktif</span><b>${a.length}</b></div><div class="stat"><span>Tiket terjual</span><b>${a.reduce((s,t)=>s+t.jml,0)}</b></div><div class="stat"><span>Pendapatan</span><b>${rp(a.reduce((s,t)=>s+t.total,0))}</b></div>`;
  $('trx').innerHTML=db.trx.length?db.trx.slice().reverse().map(t=>{const d=db.dest.find(x=>x.id===t.dId);
    return`<tr><td>${t.id}</td><td>${esc(t.nama)}</td><td>${t.hp}</td><td>${d.nama}</td><td>${t.tgl}</td><td>${t.jml}</td><td>${rp(t.total)}</td><td><span class="bdg ${t.status}">${t.status}</span></td><td>${t.status==='Aktif'?`<button class="s" onclick="batal('${t.id}')">Batalkan</button>`:''}<button class="s d" onclick="hapus('${t.id}')">Hapus</button></td></tr>`}).join(''):'<tr><td colspan="9">Belum ada transaksi.</td></tr>';
}
load();render();
$('simpanKuota').onclick=ubahKuota;
window.addEventListener('storage',()=>{load();render()});