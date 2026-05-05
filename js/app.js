// js/app.js - Versi Minimal & Stabil
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DesaVista App Loaded');

  // ===== MOBILE MENU TOGGLE =====
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // ===== FUNGSI LOAD JSON =====
  async function loadJSON(url, containerId, callback) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      data.forEach(item => {
        const el = renderFn(item);
        container.appendChild(el);
      });
      if (!container) {
        console.error(`❌ Element #${containerId} tidak ditemukan!`);
        return;
      }
      
      callback(data, container);
    } catch (error) {
      console.error(`❌ Gagal load ${url}:`, error);
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `
          <div style="padding:2rem; text-align:center; background:#fff3cd; border-radius:8px;">
            <p style="color:#856404;">⚠️ Data tidak tersedia</p>
            <p style="font-size:0.9rem; color:#666;">${error.message}</p>
          </div>`;
      }
    }
  }

  // ===== RENDER DESTINASI WISATA =====
  loadJSON('data/destinasi.json', 'destinasi-list', (data, container) => {
    container.innerHTML = data.map(item => `
      <div class="card">
        <img src="${item.img}" alt="${item.nama}" loading="lazy" onerror="this.src='https://placehold.co/400x250/2c5e4f/white?text=Destinasi'">
        <div class="card-body">
          <span class="badge">${item.kategori}</span>
          <h3>${item.nama}</h3>
          <p>${item.deskripsi.substring(0, 100)}...</p>
          <button class="btn-detail" onclick="showDetail('${item.nama}', '${item.deskripsi}', '${item.lokasi}', '${item.harga}')">
            Lihat Detail
          </button>
        </div>
      </div>
    `).join('');
  });

  // ===== RENDER GALERI =====
  loadJSON('data/galeri.json', 'galeri-list', (data, container) => {
    container.innerHTML = data.map(item => `
      <div class="card">
        <img src="${item.img}" alt="${item.judul}" loading="lazy" onerror="this.src='https://placehold.co/400x250/d4a373/white?text=Galeri'">
        <div class="card-body">
          <h3>${item.judul}</h3>
        </div>
      </div>
    `).join('');
  });

  // ===== RENDER INFO DESA (FOKUS UTAMA) =====
  loadJSON('data/info-desa.json', 'info-content', (info, container) => {
    // Pastikan struktur data ada
    const layanan = info.layanan_publik || {};
    const pendidikan = layanan.pendidikan || {};
    
    container.innerHTML = `
      <!-- Tabs Navigation -->
      <div class="info-tabs">
        <button class="tab-btn active" onclick="switchTab('umum')">📋 Umum</button>
        <button class="tab-btn" onclick="switchTab('rumahsakit')">🏥 Rumah Sakit</button>
        <button class="tab-btn" onclick="switchTab('pelayanan')">🏢 Pelayanan</button>
        <button class="tab-btn" onclick="switchTab('pendidikan')">🎓 Pendidikan</button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        
        <!-- TAB: UMUM -->
        <div id="tab-umum" class="tab-pane active">
          <h3>📜 Sejarah Yogyakarta</h3>
          <p>${info.sejarah || 'Data tidak tersedia'}</p>
          
          <h3 style="margin-top:1.5rem;">🏨 Fasilitas</h3>
          <p>${info.fasilitas || '-'}</p>
          
          <h3 style="margin-top:1rem;">⏰ Jam Operasional</h3>
          <p>${info.jam_operasional || '-'}</p>
          
          <h3 style="margin-top:1rem;">🎫 Tiket Masuk</h3>
          <p>${info.tiket || '-'}</p>
        </div>

        <!-- TAB: RUMAH SAKIT -->
        <div id="tab-rumahsakit" class="tab-pane">
          <h3>🏥 Daftar Rumah Sakit</h3>
          <div class="list-container">
            ${(layanan.rumah_sakit || []).map(rs => `
              <div class="list-item">
                <img src="${rs.foto || 'https://placehold.co/100x100/2c5e4f/white?text=RS'}" 
                     alt="${rs.nama}" class="list-img"
                     onerror="this.src='https://placehold.co/100x100/2c5e4f/white?text=RS'">
                <div class="list-info">
                  <h4>${rs.nama}</h4>
                  <p>📍 ${rs.alamat}</p>
                  <p>📞 ${rs.telepon} | 👤 ${rs.cp}</p>
                  <span class="badge">${rs.kategori}</span>
                  ${rs.website ? `<br><a href="${rs.website}" target="_blank" class="btn-website">🌐 Website</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- TAB: PELAYANAN -->
        <div id="tab-pelayanan" class="tab-pane">
          <h3>🏢 Kantor Pelayanan</h3>
          <div class="list-container">
            ${(layanan.kantor_pelayanan || []).map(kantor => `
              <div class="list-item">
                <img src="${kantor.foto || 'https://placehold.co/100x100/d4a373/white?text=Kantor'}" 
                     alt="${kantor.nama}" class="list-img"
                     onerror="this.src='https://placehold.co/100x100/d4a373/white?text=Kantor'">
                <div class="list-info">
                  <h4>${kantor.nama}</h4>
                  <p>📍 ${kantor.alamat}</p>
                  <p>📞 ${kantor.telepon} | 👤 ${kantor.cp}</p>
                  <p>⏰ ${kantor.jam_kerja}</p>
                  ${kantor.website ? `<a href="${kantor.website}" target="_blank" class="btn-website">🌐 Website</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- TAB: PENDIDIKAN -->
        <div id="tab-pendidikan" class="tab-pane">
          <h3>🎓 Lembaga Pendidikan</h3>
          
          <!-- Sub Tabs Pendidikan -->
          <div class="edu-subtabs">
            <button class="edu-tab-btn active" onclick="switchEdu('all')">Semua</button>
            <button class="edu-tab-btn" onclick="switchEdu('sd')">SD</button>
            <button class="edu-tab-btn" onclick="switchEdu('smp')">SMP</button>
            <button class="edu-tab-btn" onclick="switchEdu('sma')">SMA</button>
            <button class="edu-tab-btn" onclick="switchEdu('universitas')">Universitas</button>
          </div>

          <!-- Content Pendidikan -->
          <div id="edu-all" class="edu-pane active">
            ${renderEduSection('SD', pendidikan.sd)}
            ${renderEduSection('SMP', pendidikan.smp)}
            ${renderEduSection('SMA', pendidikan.sma)}
            ${renderEduSection('Universitas', pendidikan.universitas)}
          </div>
          <div id="edu-sd" class="edu-pane">${renderEduSection('SD', pendidikan.sd)}</div>
          <div id="edu-smp" class="edu-pane">${renderEduSection('SMP', pendidikan.smp)}</div>
          <div id="edu-sma" class="edu-pane">${renderEduSection('SMA', pendidikan.sma)}</div>
          <div id="edu-universitas" class="edu-pane">${renderEduSection('Universitas', pendidikan.universitas)}</div>
        </div>

      </div>
    `;
  });

  // ===== HELPER: Render Section Pendidikan =====
  function renderEduSection(title, items) {
    if (!items || items.length === 0) return '';
    return `
      <h4 style="margin:1.5rem 0 1rem; color:var(--primary); border-bottom:2px solid var(--secondary); padding-bottom:0.5rem;">
        ${title}
      </h4>
      <div class="edu-grid">
        ${items.map(sekolah => `
          <div class="edu-card">
            <img src="${sekolah.foto || 'https://placehold.co/350x50/2c5e4f/white?text=Sekolah'}" 
                 alt="${sekolah.nama}" class="edu-img"
                 onerror="this.src='https://placehold.co/300x150/2c5e4f/white?text=Sekolah'">
            <div class="edu-body">
              <h4>${sekolah.nama}</h4>
              <span class="badge">${sekolah.jenjang}</span>
              <p>📍 ${sekolah.alamat}</p>
              <p>📞 ${sekolah.telepon}</p>
              <p>👤 ${sekolah.cp}</p>
              ${sekolah.website ? `<a href="${sekolah.website}" target="_blank" class="edu-link">🌐 Website</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
});

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