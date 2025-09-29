// =============================
// pager_pageX.js
// =============================
// Script ambil resi dari halaman tertentu
// Auto set 50 / Halaman → lompat ke targetPage → copy resi

window.collectPageResi = function(targetPage = 1) {
  const pageSize = 50;
  const openDropdownMs = 500;
  const afterSelectMs = 2000;
  const afterPageChangeMs = 2000;
  const resiSelector = 'div[data-v-4d63f3ac]';

  function clickDropdownAndSelect(size, cb) {
    const dropdown = document.querySelector('.ssc-select-reference');
    if (!dropdown) return cb(new Error('Dropdown tidak ditemukan'));
    dropdown.click();
    setTimeout(() => {
      const titleText = `${size}  / Halaman`;
      const option = document.querySelector(`li.ssc-option[title="${titleText}"]`)
        || [...document.querySelectorAll('li.ssc-option')]
             .find(el => el.textContent.includes(`${size} / Halaman`));
      if (!option) return cb(new Error(`Opsi "${size} / Halaman" tidak ditemukan`));
      option.click();
      cb(null);
    }, openDropdownMs);
  }

  function goToPage(num) {
    const pagerItems = [...document.querySelectorAll('.pager-item')];
    const target = pagerItems.find(el => el.textContent.trim() == String(num));
    if (target) { target.click(); return true; }
    return false;
  }

  function collectResiFromPage() {
    return Array.from(document.querySelectorAll(resiSelector))
      .map(el => (el.childNodes?.[0]?.textContent || el.textContent || '').trim())
      .filter(t => t.startsWith('SPXID'));
  }

  (async () => {
    try {
      console.log(`➡️ Set page size ke ${pageSize} ...`);
      await new Promise((resolve, reject) => {
        clickDropdownAndSelect(pageSize, (err) => {
          if (err) return reject(err);
          setTimeout(resolve, afterSelectMs);
        });
      });

      console.log(`➡️ Pindah ke halaman ${targetPage} ...`);
      const ok = goToPage(targetPage);
      if (!ok) {
        console.log(`⚠️ Tombol halaman ${targetPage} tidak ditemukan.`);
        return;
      }
      await new Promise(r => setTimeout(r, afterPageChangeMs));

      const uniq = [...new Set(collectResiFromPage())];
      if (uniq.length === 0) return console.log(`⚠️ Tidak ada resi di halaman ${targetPage}.`);
      const text = uniq.join('\n');

      // Copy via execCommand
      const ta = document.createElement('textarea');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.value = text;
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const okCopy = document.execCommand('copy');
      setTimeout(() => ta.remove(), 100);

      if (okCopy) {
        console.log(`📋 ${uniq.length} resi dari halaman ${targetPage} dicopy ke clipboard.`);
      } else {
        console.log('⚠️ Copy gagal, ini hasilnya:\n', text);
      }
    } catch (e) {
      console.error('❌ Error:', e);
    }
  })();
};
