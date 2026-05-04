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
  // Render info desa dengan kategori & sub-tab Pendidikan
loadJSON('data/info-desa.json', 'info-content', info => {
  const div = document.createElement('div');
  div.className = 'info-container';
  
  // Tab navigation utama
  div.innerHTML = `
    <div class="info-tabs">
      <button class="tab-btn active" data-tab="umum">Informasi Umum</button>
      <button class="tab-btn" data-tab="rumahsakit">Rumah Sakit</button>
      <button class="tab-btn" data-tab="pelayanan">Kantor Pelayanan</button>
      <button class="tab-btn" data-tab="pemerintah">Pemerintah Daerah</button>
      <button class="tab-btn" data-tab="pendidikan">Pendidikan</button>
    </div>
    
    <div class="tab-content">
      <!-- Tab Umum -->
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
      
      <!-- Tab Rumah Sakit -->
      <div id="rumahsakit" class="tab-pane">
        <h3>🏥 Rumah Sakit di Yogyakarta</h3>
        <div class="list-container">
          ${info.layanan_publik.rumah_sakit.map(rs => `
            <div class="list-item">
              <img src="${rs.foto}" alt="${rs.nama}" class="list-item-img" onerror="this.src='https://placehold.co/400x250/2c5e4f/white?text=RS'">
              <div class="list-item-content">
                <h4>${rs.nama}</h4>
                <p><strong>Alamat:</strong> ${rs.alamat}</p>
                <p><strong>Telepon:</strong> ${rs.telepon}</p>
                <p><strong>CP:</strong> ${rs.cp}</p>
                <p><span class="badge">${rs.kategori}</span></p>
                ${rs.website ? `<a href="${rs.website}" target="_blank" rel="noopener" class="btn-website">🌐 Kunjungi Website</a>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Tab Kantor Pelayanan -->
      <div id="pelayanan" class="tab-pane">
        <h3>🏢 Kantor Pelayanan Masyarakat</h3>
        <div class="list-container">
          ${info.layanan_publik.kantor_pelayanan.map(kantor => `
            <div class="list-item">
              <img src="${kantor.foto}" alt="${kantor.nama}" class="list-item-img" onerror="this.src='https://placehold.co/400x250/d4a373/white?text=Kantor'">
              <div class="list-item-content">
                <h4>${kantor.nama}</h4>
                <p><strong>Alamat:</strong> ${kantor.alamat}</p>
                <p><strong>Telepon:</strong> ${kantor.telepon}</p>
                <p><strong>CP:</strong> ${kantor.cp}</p>
                <p><strong>Jam Kerja:</strong> ${kantor.jam_kerja}</p>
                ${kantor.website ? `<a href="${kantor.website}" target="_blank" rel="noopener" class="btn-website">🌐 Kunjungi Website</a>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Tab Pemerintah Daerah -->
      <div id="pemerintah" class="tab-pane">
        <h3>🏛️ Pemerintah Daerah</h3>
        <div class="list-container">
          ${info.layanan_publik.pemerintah_daerah.map(pemda => `
            <div class="list-item">
              <img src="${pemda.foto}" alt="${pemda.nama}" class="list-item-img" onerror="this.src='https://placehold.co/400x250/2c5e4f/white?text=Pemda'">
              <div class="list-item-content">
                <h4>${pemda.nama}</h4>
                <p><strong>Alamat:</strong> ${pemda.alamat}</p>
                <p><strong>Telepon:</strong> ${pemda.telepon}</p>
                ${pemda.email ? `<p><strong>Email:</strong> ${pemda.email}</p>` : ''}
                ${pemda.website ? `<a href="https://${pemda.website.replace(/^https?:\/\//, '')}" target="_blank" rel="noopener" class="btn-website">🌐 Kunjungi Website</a>` : ''}
                ${pemda.hotline ? `<p><strong>Hotline:</strong> ${pemda.hotline}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Tab Pendidikan dengan Sub-Tab Kategori -->
      <div id="pendidikan" class="tab-pane">
        <h3>🎓 Lembaga Pendidikan</h3>
        <div class="edu-subtabs">
          <button class="edu-tab-btn active" data-edu="all">Semua Lembaga</button>
          <button class="edu-tab-btn" data-edu="sd">SD / Sederajat</button>
          <button class="edu-tab-btn" data-edu="smp">SMP / Sederajat</button>
          <button class="edu-tab-btn" data-edu="sma">SMA / SMK / Sederajat</button>
          <button class="edu-tab-btn" data-edu="universitas">Universitas</button>
        </div>
        <div class="edu-content">
          <div id="edu-all" class="edu-pane active"></div>
          <div id="edu-sd" class="edu-pane"></div>
          <div id="edu-smp" class="edu-pane"></div>
          <div id="edu-sma" class="edu-pane"></div>
          <div id="edu-universitas" class="edu-pane"></div>
        </div>
      </div>
    </div>
  `;
  
  // Helper render kartu pendidikan dengan foto & website
  const renderEduCard = (item) => `
    <div class="edu-card">
      <img src="${item.foto}" alt="${item.nama}" class="edu-card-img" onerror="this.src='https://placehold.co/600x300/2c5e4f/white?text=Sekolah'">
      <div class="edu-card-body">
        <h4>${item.nama}</h4>
        <span class="badge">${item.jenjang}</span>
        <p><strong>Alamat:</strong> ${item.alamat}</p>
        <p><strong>Telepon:</strong> ${item.telepon}</p>
        <p><strong>CP:</strong> ${item.cp}</p>
        ${item.website ? `<a href="${item.website}" target="_blank" rel="noopener" class="edu-link">🌐 Kunjungi Website Resmi</a>` : ''}
      </div>
    </div>
  `;

  // Populate konten per kategori
  const eduData = info.layanan_publik.pendidikan;
  document.getElementById('edu-sd').innerHTML = eduData.sd.map(renderEduCard).join('');
  document.getElementById('edu-smp').innerHTML = eduData.smp.map(renderEduCard).join('');
  document.getElementById('edu-sma').innerHTML = eduData.sma.map(renderEduCard).join('');
  document.getElementById('edu-universitas').innerHTML = eduData.universitas.map(renderEduCard).join('');
  
  // Populate "Semua" (gabungan semua level)
  document.getElementById('edu-all').innerHTML = 
    `<h4 style="margin:1rem 0 0.5rem; color:var(--primary);">SD / SEDERAJAT</h4>` + eduData.sd.map(renderEduCard).join('') +
    `<h4 style="margin:1.5rem 0 0.5rem; color:var(--primary);">SMP / SEDERAJAT</h4>` + eduData.smp.map(renderEduCard).join('') +
    `<h4 style="margin:1.5rem 0 0.5rem; color:var(--primary);">SMA / SMK / SEDERAJAT</h4>` + eduData.sma.map(renderEduCard).join('') +
    `<h4 style="margin:1.5rem 0 0.5rem; color:var(--primary);">UNIVERSITAS</h4>` + eduData.universitas.map(renderEduCard).join('');

  // Event Listener: Tab Utama
  const tabBtns = div.querySelectorAll('.tab-btn');
  const tabPanes = div.querySelectorAll('.tab-pane');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      div.querySelector(`#${tabId}`).classList.add('active');
    });
  });

  // Event Listener: Sub-Tab Pendidikan
  const eduBtns = div.querySelectorAll('.edu-tab-btn');
  const eduPanes = div.querySelectorAll('.edu-pane');
  eduBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const eduId = btn.getAttribute('data-edu');
      eduBtns.forEach(b => b.classList.remove('active'));
      eduPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      div.querySelector(`#edu-${eduId}`).classList.add('active');
    });
  });

  return div;
});
    
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