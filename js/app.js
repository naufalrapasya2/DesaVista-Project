// ===== MOBILE MENU TOGGLE =====
const menuBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// ===== LOAD JSON DATA =====
async function loadJSON(url, containerId, callback) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    const container = document.getElementById(containerId);
    if (container) {
      callback(data, container);
    }
  } catch (error) {
    console.error(`Error loading ${url}:`, error);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div style="text-align:center; padding:2rem; background:#fff3cd; border-radius:8px;">
          <p style="color:#856404;">⚠️ Data tidak tersedia</p>
          <p style="font-size:0.9rem;">${error.message}</p>
        </div>`;
    }
  }
}

// ===== RENDER DESTINASI WISATA =====
loadJSON('data/destinasi.json', 'destinasi-list', (data) => {
  const container = document.getElementById('destinasi-list');
  container.innerHTML = data.map(item => `
    <div class="card">
      <img src="${item.img}" alt="${item.nama}" loading="lazy" onerror="this.src='https://placehold.co/400x250/2c5e4f/white?text=${encodeURIComponent(item.nama)}'">
      <div class="card-body">
        <span class="badge">${item.kategori}</span>
        <h3>${item.nama}</h3>
        <p>${item.deskripsi.substring(0, 120)}...</p>
        <button class="btn-detail" onclick="showDestinasiDetail(${item.id})">
          Lihat Detail
        </button>
      </div>
    </div>
  `).join('');
  
  // Simpan data destinasi untuk modal
  window.destinasiData = data;
});

// ===== SHOW DESTINASI DETAIL MODAL =====
function showDestinasiDetail(id) {
  const item = window.destinasiData.find(d => d.id === id);
  if (!item) return;
  
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <h2>${item.nama}</h2>
    <span class="badge">${item.kategori}</span>
    <img src="${item.img}" alt="${item.nama}" style="width:100%; height:250px; object-fit:cover; border-radius:8px; margin:1rem 0;">
    <p><strong>📝 Deskripsi:</strong> ${item.deskripsi}</p>
    <p><strong>📍 Lokasi:</strong> ${item.lokasi}</p>
    <p><strong>💰 Harga:</strong> ${item.harga}</p>
    <p><strong>⏰ Jam Buka:</strong> ${item.jam_buka}</p>
    <p><strong>🏨 Fasilitas:</strong></p>
    <ul class="fasilitas-list">
      ${item.fasilitas.map(f => `<li>${f}</li>`).join('')}
    </ul>
    ${item.detail_url ? `<a href="${item.detail_url}" target="_blank" class="btn" style="display:block; text-align:center; margin-top:1rem;">🌐 Kunjungi Website</a>` : ''}
  `;
  
  document.getElementById('modal-destinasi').style.display = 'flex';
}

// ===== CLOSE MODAL =====
function closeModal() {
  document.getElementById('modal-destinasi').style.display = 'none';
}

// Close modal when clicking outside
document.getElementById('modal-destinasi')?.addEventListener('click', (e) => {
  if (e.target.id === 'modal-destinasi') closeModal();
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===== RENDER GALERI =====
loadJSON('data/galeri.json', 'galeri-list', (data) => {
  const container = document.getElementById('galeri-list');
  container.innerHTML = data.map(item => `
    <div class="card">
      <img src="${item.img}" alt="${item.judul}" loading="lazy" onerror="this.src='https://placehold.co/400x250/d4a373/white?text=Galeri'">
      <div class="card-body">
        <h3>${item.judul}</h3>
        <p>${item.deskripsi || ''}</p>
      </div>
    </div>
  `).join('');
});

// ===== RENDER INFO DESA =====
loadJSON('data/info-desa.json', 'info-content', (info) => {
  const layanan = info.layanan_publik || {};
  const pendidikan = layanan.pendidikan || {};
  
  const container = document.getElementById('info-content');
  container.innerHTML = `
    <!-- Tabs Navigation -->
    <div class="info-tabs">
      <button class="tab-btn active" onclick="switchTab('umum', this)">📋 Informasi Umum</button>
      <button class="tab-btn" onclick="switchTab('rumahsakit', this)">🏥 Rumah Sakit</button>
      <button class="tab-btn" onclick="switchTab('pelayanan', this)">🏢 Kantor Pelayanan</button>
      <button class="tab-btn" onclick="switchTab('pemerintah', this)">🏛️ Pemerintah Daerah</button>
      <button class="tab-btn" onclick="switchTab('pendidikan', this)">🎓 Pendidikan</button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      
      <!-- TAB: UMUM -->
      <div id="tab-umum" class="tab-pane active">
        <h3>📜 Sejarah Yogyakarta</h3>
        <p>${info.sejarah || 'Data tidak tersedia'}</p>
        
        <h3>🏨 Fasilitas Desa Wisata</h3>
        <p>${info.fasilitas || '-'}</p>
        
        <h3>⏰ Jam Operasional</h3>
        <p>${info.jam_operasional || '-'}</p>
        
        <h3>🎫 Harga Tiket</h3>
        <p>${info.tiket || '-'}</p>
      </div>

      <!-- TAB: RUMAH SAKIT (dengan layout card seperti pendidikan) -->
      <div id="tab-rumahsakit" class="tab-pane">
        <h3>🏥 Rumah Sakit di Yogyakarta</h3>
        ${renderLayananSection('Rumah Sakit', layanan.rumah_sakit || [], 'kategori')}
      </div>

      <!-- TAB: KANTOR PELAYANAN (dengan layout card seperti pendidikan) -->
      <div id="tab-pelayanan" class="tab-pane">
        <h3>🏢 Kantor Pelayanan Masyarakat</h3>
        ${renderLayananSection('Kantor Pelayanan', layanan.kantor_pelayanan || [], '')}
      </div>

      <!-- TAB: PEMERINTAH DAERAH (dengan layout card seperti pendidikan) -->
      <div id="tab-pemerintah" class="tab-pane">
        <h3>🏛️ Pemerintah Daerah</h3>
        ${renderLayananSection('Pemerintah Daerah', layanan.pemerintah_daerah || [], '')}
      </div>

      <!-- TAB: PENDIDIKAN dengan SUB-TABS -->
      <div id="tab-pendidikan" class="tab-pane">
        <h3>🎓 Lembaga Pendidikan di Yogyakarta</h3>
        
        <!-- Sub-Tabs Pendidikan -->
        <div class="edu-subtabs">
          <button class="edu-tab-btn active" onclick="switchEdu('all', this)">Semua Lembaga</button>
          <button class="edu-tab-btn" onclick="switchEdu('sd', this)">SD / Sederajat</button>
          <button class="edu-tab-btn" onclick="switchEdu('smp', this)">SMP / Sederajat</button>
          <button class="edu-tab-btn" onclick="switchEdu('sma', this)">SMA / Sederajat</button>
          <button class="edu-tab-btn" onclick="switchEdu('universitas', this)">Universitas</button>
        </div>

        <!-- Content: Semua -->
        <div id="edu-all" class="edu-pane active">
          ${renderEduSection('SD / Sederajat', pendidikan.sd || [])}
          ${renderEduSection('SMP / Sederajat', pendidikan.smp || [])}
          ${renderEduSection('SMA / Sederajat', pendidikan.sma || [])}
          ${renderEduSection('Universitas', pendidikan.universitas || [])}
        </div>

        <!-- Content: SD -->
        <div id="edu-sd" class="edu-pane">
          ${renderEduSection('SD / Sederajat', pendidikan.sd || [])}
        </div>

        <!-- Content: SMP -->
        <div id="edu-smp" class="edu-pane">
          ${renderEduSection('SMP / Sederajat', pendidikan.smp || [])}
        </div>

        <!-- Content: SMA -->
        <div id="edu-sma" class="edu-pane">
          ${renderEduSection('SMA / Sederajat', pendidikan.sma || [])}
        </div>

        <!-- Content: Universitas -->
        <div id="edu-universitas" class="edu-pane">
          ${renderEduSection('Universitas', pendidikan.universitas || [])}
        </div>
      </div>

    </div>
  `;
});

// ===== HELPER: Render Layanan Section (Rumah Sakit, Pelayanan, Pemerintah) =====
function renderLayananSection(title, items, badgeField) {
  if (!items || items.length === 0) {
    return `<p style="text-align:center; padding:2rem; color:#666;">Data tidak tersedia</p>`;
  }
  
  return `
    <div class="layanan-grid">
      ${items.map(item => `
        <div class="layanan-card">
          <img src="${item.foto || 'https://placehold.co/400x200/2c5e4f/white?text=${encodeURIComponent(title)}'}" 
               alt="${item.nama}" 
               onerror="this.src='https://placehold.co/400x200/2c5e4f/white?text=${encodeURIComponent(item.nama)}'">
          <div class="layanan-card-body">
            <h4>${item.nama}</h4>
            ${badgeField && item[badgeField] ? `<span class="badge">${item[badgeField]}</span>` : ''}
            <p><strong>📍 Alamat:</strong> ${item.alamat}</p>
            <p><strong>📞 Telepon:</strong> ${item.telepon}</p>
            <p><strong>👤 CP:</strong> ${item.cp}</p>
            ${item.jam_operasional ? `<p><strong>⏰ Jam Operasional:</strong> ${item.jam_operasional}</p>` : ''}
            ${item.email ? `<p><strong>📧 Email:</strong> ${item.email}</p>` : ''}
            ${item.hotline ? `<p><strong>🚨 Hotline:</strong> ${item.hotline}</p>` : ''}
            ${item.website ? `<a href="${item.website}" target="_blank" class="btn-website">🌐 Kunjungi Website</a>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== HELPER: Render Education Section =====
function renderEduSection(title, items) {
  if (!items || items.length === 0) {
    return `<p style="text-align:center; padding:2rem; color:#666;">Data tidak tersedia</p>`;
  }
  
  return `
    <h4 style="margin:1.5rem 0 1rem; color:var(--primary); border-bottom:2px solid var(--secondary); padding-bottom:0.5rem;">
      ${title}
    </h4>
    <div class="edu-grid">
      ${items.map(sekolah => `
        <div class="edu-card">
          <img src="${sekolah.foto || 'https://placehold.co/400x200/2c5e4f/white?text=Sekolah'}" 
               alt="${sekolah.nama}" 
               onerror="this.src='https://placehold.co/400x200/2c5e4f/white?text=${encodeURIComponent(sekolah.nama)}'">
          <div class="edu-card-body">
            <h4>${sekolah.nama}</h4>
            <span class="badge">${sekolah.jenjang}</span>
            <p><strong>📍 Alamat:</strong> ${sekolah.alamat}</p>
            <p><strong>📞 Telepon:</strong> ${sekolah.telepon}</p>
            <p><strong>👤 CP:</strong> ${sekolah.cp}</p>
            ${sekolah.website ? `<a href="${sekolah.website}" target="_blank" class="edu-link">🌐 Website Resmi</a>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== SWITCH TAB UTAMA =====
function switchTab(tabName, btn) {
  // Reset semua tab buttons
  document.querySelectorAll('.info-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  // Reset semua tab panes
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  
  // Aktifkan yang dipilih
  btn.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// ===== SWITCH SUB-TAB PENDIDIKAN =====
function switchEdu(level, btn) {
  // Reset semua edu buttons
  document.querySelectorAll('.edu-tab-btn').forEach(b => b.classList.remove('active'));
  // Reset semua edu panes
  document.querySelectorAll('.edu-pane').forEach(p => p.classList.remove('active'));
  
  // Aktifkan yang dipilih
  btn.classList.add('active');
  document.getElementById(`edu-${level}`).classList.add('active');
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Close mobile menu if open
      navLinks?.classList.remove('active');
    }
  });
});