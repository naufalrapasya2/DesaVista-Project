document.addEventListener('DOMContentLoaded', () => {
  // Toggle mobile menu
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));

  // Fetch & render JSON
  async function loadJSON(url, containerId, renderFn) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      
      if (Array.isArray(data)) {
        data.forEach(item => {
          const el = renderFn(item);
          container.appendChild(el);
        });
      } else {
        // Untuk object (info-desa)
        const el = renderFn(data);
        container.appendChild(el);
      }
    } catch (err) {
      console.error(err);
      document.getElementById(containerId).innerHTML = `
        <div class="error-box">
          <p style="color:red">⚠️ Data tidak tersedia.</p>
          <p>Pastikan server lokal berjalan (Live Server).</p>
        </div>`;
    }
  }

  // Render destinasi dengan klik
  loadJSON('data/destinasi.json', 'destinasi-list', item => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.nama}" loading="lazy">
      <div class="card-body">
        <span class="badge">${item.kategori}</span>
        <h3>${item.nama}</h3>
        <p>${item.deskripsi.substring(0, 100)}...</p>
        <button class="btn-detail" data-id="${item.id}">Lihat Detail</button>
      </div>`;
    
    // Event listener untuk tombol detail
    const btn = div.querySelector('.btn-detail');
    btn.addEventListener('click', () => showDestinasiDetail(item));
    
    return div;
  });

  // Render galeri
  loadJSON('data/galeri.json', 'galeri-list', item => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.judul}" loading="lazy">
      <div class="card-body">
        <h3>${item.judul}</h3>
      </div>`;
    return div;
  });

  // Render info desa dengan kategori
  loadJSON('data/info-desa.json', 'info-content', info => {
    const div = document.createElement('div');
    div.className = 'info-container';
    
    // Tab navigation
    div.innerHTML = `
      <div class="info-tabs">
        <button class="tab-btn active" data-tab="umum">Informasi Umum</button>
        <button class="tab-btn" data-tab="rumahsakit">Rumah Sakit</button>
        <button class="tab-btn" data-tab="pelayanan">Kantor Pelayanan</button>
        <button class="tab-btn" data-tab="pemerintah">Pemerintah Daerah</button>
        <button class="tab-btn" data-tab="pendidikan">Pendidikan</button>
      </div>
      
      <div class="tab-content">
        <div id="umum" class="tab-pane active">
          <h3>📜 Sejarah Desa</h3>
          <p>${info.sejarah}</p>
          
          <h3>🏨 Fasilitas</h3>
          <p>${info.fasilitas}</p>
          
          <h3>⏰ Jam Operasional</h3>
          <p>${info.jam_operasional}</p>
          
          <h3>🎫 Harga Tiket</h3>
          <p>${info.tiket}</p>
        </div>
        
        <div id="rumahsakit" class="tab-pane">
          <h3>🏥 Rumah Sakit di Yogyakarta</h3>
          <div class="list-container">
            ${info.layanan_publik.rumah_sakit.map(rs => `
              <div class="list-item">
                <h4>${rs.nama}</h4>
                <p><strong>Alamat:</strong> ${rs.alamat}</p>
                <p><strong>Telepon:</strong> ${rs.telepon}</p>
                <p><strong>CP:</strong> ${rs.cp}</p>
                <p><span class="badge">${rs.kategori}</span></p>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div id="pelayanan" class="tab-pane">
          <h3>🏢 Kantor Pelayanan Masyarakat</h3>
          <div class="list-container">
            ${info.layanan_publik.kantor_pelayanan.map(kantor => `
              <div class="list-item">
                <h4>${kantor.nama}</h4>
                <p><strong>Alamat:</strong> ${kantor.alamat}</p>
                <p><strong>Telepon:</strong> ${kantor.telepon}</p>
                <p><strong>CP:</strong> ${kantor.cp}</p>
                <p><strong>Jam Kerja:</strong> ${kantor.jam_kerja}</p>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div id="pemerintah" class="tab-pane">
          <h3>🏛️ Pemerintah Daerah</h3>
          <div class="list-container">
            ${info.layanan_publik.pemerintah_daerah.map(pemda => `
              <div class="list-item">
                <h4>${pemda.nama}</h4>
                <p><strong>Alamat:</strong> ${pemda.alamat}</p>
                <p><strong>Telepon:</strong> ${pemda.telepon}</p>
                ${pemda.email ? `<p><strong>Email:</strong> ${pemda.email}</p>` : ''}
                ${pemda.website ? `<p><strong>Website:</strong> <a href="${pemda.website}" target="_blank">${pemda.website}</a></p>` : ''}
                ${pemda.hotline ? `<p><strong>Hotline:</strong> ${pemda.hotline}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        
        <div id="pendidikan" class="tab-pane">
          <h3>🎓 Lembaga Pendidikan</h3>
          <div class="list-container">
            ${info.layanan_publik.pendidikan.map(sekolah => `
              <div class="list-item">
                <h4>${sekolah.nama}</h4>
                <p><span class="badge">${sekolah.jenjang}</span></p>
                <p><strong>Alamat:</strong> ${sekolah.alamat}</p>
                <p><strong>Telepon:</strong> ${sekolah.telepon}</p>
                <p><strong>CP:</strong> ${sekolah.cp}</p>
                ${sekolah.website ? `<p><strong>Website:</strong> <a href="${sekolah.website}" target="_blank">${sekolah.website}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    // Tab functionality
    const tabBtns = div.querySelectorAll('.tab-btn');
    const tabPanes = div.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Add active to clicked
        btn.classList.add('active');
        div.querySelector(`#${tabId}`).classList.add('active');
      });
    });
    
    return div;
  });
});

// Modal untuk detail destinasi
function showDestinasiDetail(item) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <img src="${item.img}" alt="${item.nama}" class="modal-img">
      <h2>${item.nama}</h2>
      <span class="badge">${item.kategori}</span>
      <p><strong>Deskripsi:</strong> ${item.deskripsi}</p>
      <p><strong>📍 Lokasi:</strong> ${item.lokasi}</p>
      <p><strong>💰 Harga Tiket:</strong> ${item.harga}</p>
      <p><strong>⏰ Jam Buka:</strong> ${item.jam_buka}</p>
      <p><strong>🏨 Fasilitas:</strong></p>
      <ul class="fasilitas-list">
        ${item.fasilitas.map(f => `<li>${f}</li>`).join('')}
      </ul>
      ${item.detail_url !== '#' ? `<a href="${item.detail_url}" target="_blank" class="btn">Kunjungi Website</a>` : ''}
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close modal
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => modal.remove());
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
  
  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.remove();
  });
}

// ===== GLOBAL FUNCTIONS (Harus di luar DOMContentLoaded) =====

// Switch Tab Utama
function switchTab(tabName) {
  // Reset semua tab
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  
  // Aktifkan yang dipilih
  event.target.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Switch Sub-Tab Pendidikan
function switchEdu(level) {
  document.querySelectorAll('.edu-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.edu-pane').forEach(pane => pane.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(`edu-${level}`).classList.add('active');
}

// Show Detail Destinasi (Simple Modal)
function showDetail(nama, deskripsi, lokasi, harga) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>${nama}</h2>
      <p><strong>Deskripsi:</strong> ${deskripsi}</p>
      <p><strong>📍 Lokasi:</strong> ${lokasi}</p>
      <p><strong>💰 Harga:</strong> ${harga}</p>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Close when clicking outside
  modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
}