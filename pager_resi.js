// =============================
// pager_resi.js
// =============================
// Ambil resi dari beberapa halaman (default: 1)
// Termasuk: set page size ke 50, looping halaman, copy otomatis
// Cara panggil: window.collectResiPages(2)  // contoh ambil 2 halaman

window.collectResiPages = function(pagesToCollect = 1) {
  const pageSize = 50;              // Set ke 50 / Halaman
  const openDropdownMs = 500;       // Delay setelah klik dropdown
  const afterSelectMs = 2000;       // Delay reload setelah set pageSize
  const afterPageChangeMs = 1500;   // Delay reload setelah pindah halaman
  const resiSelector = 'div[data-v-4d63f3ac]'; // Selector resi

  function clickDropdownAndSelect(size, cb) {
    const dropdown = document.querySelector('.ssc-select-reference');
    if (!dropdown) return cb(new Error('Dropdown tidak ditemukan'));
    dropdown.click();

    setTimeout(() => {
      const titleText = `${size}  / Halaman`; // perhatikan spasi ganda
      const option = document.querySelector(`li.ssc-option[title="${titleText}"]`)
                || [...document.querySelectorAll('li.ssc-option')]
                   .find(el => el.textContent.includes(`${size} / Halaman`));
      if (!option) return cb(new Error(`Opsi "${size} / Halaman" tidak ditemukan`));
      option.click();
      cb(null);
    }, openDropdownMs);
  }

  function collectResiFromPage() {
    const nodes = document.querySelectorAll(resiSelector);
    if (!nodes || nodes.length === 0) return [];
    return Array.from(nodes)
      .map(el => {
        const first = el.childNodes && el.childNodes.length ? el.childNodes[0].textContent : el.textContent;
        return (first || '').trim();
      })
      .filter(t => t && t.startsWith('SPXID'));
  }

  function goToNextPageByNumber(targetPageNumber) {
    const pagerItems = [...document.querySelectorAll('.pager-item')];
    if (pagerItems.length) {
      let target = pagerItems.find(el => el.textContent.trim() == String(targetPageNumber));
      if (target) { target.click(); return true; }
      let active = pagerItems.find(el => el.classList.contains('active'));
      if (active) {
        let next = active.nextElementSibling;
        if (next && next.classList.contains('pager-item')) {
          next.click();
          return true;
        }
      }
    }
    const nextBtn = document.querySelector('.pager-next, .next, [aria-label="Next"]');
    if (nextBtn) { nextBtn.click(); return true; }
    return false;
  }

  (async () => {
    try {
      console.log(`➡️ Mulai collect ${pagesToCollect} halaman (pageSize=${pageSize})`);

      await new Promise((resolve, reject) => {
        clickDropdownAndSelect(pageSize, (err) => {
          if (err) return reject(err);
          setTimeout(resolve, afterSelectMs);
        });
      });
      console.log(`✅ Page size diset ke ${pageSize}`);

      const collected = [];
      let activePageNum = null;
      const activeEl = document.querySelector('.pager-item.active');
      if (activeEl) activePageNum = parseInt(activeEl.textContent.trim()) || null;

      for (let i = 0; i < pagesToCollect; i++) {
        await new Promise(r => setTimeout(r, i === 0 ? 300 : afterPageChangeMs));
        const pageResi = collectResiFromPage();
        console.log(`📥 Halaman ${i+1}: ${pageResi.length} resi ditemukan`);
        collected.push(...pageResi);

        if (i < pagesToCollect - 1) {
          let nextPageNumber = activePageNum ? activePageNum + (i + 1) : null;
          const ok = nextPageNumber ? goToNextPageByNumber(nextPageNumber) : goToNextPageByNumber(null);
          if (!ok) {
            console.log('⚠️ Tidak bisa navigasi ke halaman berikutnya.');
            break;
          } else {
            console.log('➡️ Navigasi ke halaman berikutnya...');
          }
          await new Promise(r => setTimeout(r, 200));
        }
      }

      const uniq = [];
      const seen = new Set();
      for (const r of collected) {
        if (!seen.has(r)) { seen.add(r); uniq.push(r); }
      }

      if (uniq.length === 0) return console.log('⚠️ Tidak ada resi ditemukan.');

      const text = uniq.join('\n');
      try {
        await navigator.clipboard.writeText(text);
        console.log(`📋 ${uniq.length} resi dicopy ke clipboard (navigator.clipboard).`);
      } catch {
        const ta = document.createElement('textarea');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        if (ok) console.log(`📋 ${uniq.length} resi dicopy ke clipboard (fallback execCommand).`);
        else console.log('⚠️ Gagal copy otomatis, salin manual:', uniq);
      }
    } catch (err) {
      console.error('❌ Error:', err);
    }
  })();
};
