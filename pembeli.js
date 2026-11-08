const ART={D1:['🏖️','a1'],D2:['🌲','a2'],D3:['🌊','a3']};
const DESK={D1:'Pantai berpasir lembut dengan panorama matahari terbenam.',D2:'Hutan rindang dengan jalur santai untuk keluarga.',D3:'Air terjun segar di tengah alam untuk para petualang.'};
function pesan(){
  const f={nama:$('nama').value,hp:$('hp').value,dId:$('dest').value,tgl:$('tgl').value,jml:$('jml').value};
  const err=validasiPesan(f);
  if(err){msg('m1',err,false);return}
  const d=db.dest.find(x=>x.id===f.dId);db.seq++;
  const t={id:'TRX-'+String(db.seq).padStart(3,'0'),nama:f.nama.trim(),hp:f.hp.trim(),dId:d.id,tgl:f.tgl,jml:+f.jml,total:d.harga*(+f.jml),status:'Aktif'};
  db.trx.push(t);
  if(!save()){db.trx.pop();db.seq--;msg('m1','Gagal menyimpan data. Penyimpanan browser tidak tersedia.',false);return}
  msg('m1','Pemesanan berhasil. ID: '+t.id+', '+d.nama+', '+t.tgl+', total '+rp(t.total)+'.',true);
  $('nama').value='';$('hp').value='';$('jml').value='1';render();
}
function pilih(id){$('dest').value=id;info();ringkas()}
function ringkas(){
  const d=db.dest.find(x=>x.id===$('dest').value),j=$('jml').value.trim();
  const ok=/^\d+$/.test(j)&&+j>=1&&+j<=10;
  $('sd').textContent=d?d.nama:'-';$('st').textContent=$('tgl').value||'-';
  $('sj').textContent=ok?j+' tiket':'-';$('sh').textContent=d?rp(d.harga):'-';
  $('sT').textContent=d&&ok?rp(d.harga*(+j)):'-';
}
function info(){const t=$('tgl').value,d=$('dest').value;$('info').textContent=t&&d?'Sisa kuota tanggal '+t+': '+sisa(d,t)+' tiket':'Pilih destinasi & tanggal untuk melihat sisa kuota.'}
function render(){
  const cur=$('dest').value;
  $('dest').innerHTML=db.dest.map(d=>`<option value="${d.id}">${d.nama} – ${rp(d.harga)}</option>`).join('');
  if(cur)$('dest').value=cur;
  $('cards').innerHTML=db.dest.map(d=>{const a=ART[d.id]||['🎟️','a1'];
    return`<div class="card"><div class="art ${a[1]}">${a[0]}</div><div class="cb"><h3>${d.nama}</h3><p>${DESK[d.id]||'Destinasi wisata pilihan.'}</p><div class="meta"><span>Kuota ${d.kuota} tiket/hari</span></div><div class="pr"><div><small>mulai dari</small><br><b>${rp(d.harga)}</b> /tiket</div><a class="btn2" href="#form-pesan" onclick="pilih('${d.id}')">Pesan</a></div></div></div>`}).join('');
  info();ringkas();
}
load();$('tgl').value=ymd(new Date());render();
$('pesan').onclick=pesan;
$('dest').onchange=()=>{info();ringkas()};$('tgl').onchange=()=>{info();ringkas()};$('jml').oninput=ringkas;
window.addEventListener('storage',()=>{load();render()});