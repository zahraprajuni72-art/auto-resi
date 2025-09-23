// auto_resi.js
(function(){
  if (window.__auto_resi_loaded) return;
  window.__auto_resi_loaded = true;

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function setNativeValue(el, value){
    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc?.set) desc.set.call(el, value); else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function pressEnter(el){
    const opts = { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true };
    el.dispatchEvent(new KeyboardEvent("keydown", opts));
    el.dispatchEvent(new KeyboardEvent("keypress", opts));
    el.dispatchEvent(new KeyboardEvent("keyup", opts));
  }

  async function waitForSelector(selector, timeout = 3000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;
      await sleep(300);
    }
    return null;
  }

  async function processDaftarResiText(daftarResiText){
    const resiList = (daftarResiText||"").split(/\r?\n/).map(s => s.trim()).filter(Boolean);

    for (let i = 0; i < resiList.length; i++) {
      const resi = resiList[i];
      console.log(`🚚 ${i+1}/${resiList.length} → ${resi}`);

      // 1. Input resi
      const input = await waitForSelector('input[placeholder="Input"]', 3000);
      if (!input) { console.error("❌ Input resi tidak ditemukan"); break; }
      input.focus();
      setNativeValue(input, resi);
      pressEnter(input);
      await sleep(1000);

      // 2. Input alasan
      const alasanInput = await waitForSelector('input[placeholder="Mohon masukan"]', 3000);
      if (!alasanInput) { console.warn("⚠️ Input alasan tidak ditemukan"); continue; }
      alasanInput.focus();
      setNativeValue(alasanInput, "Salah Assigned Kurir");
      pressEnter(alasanInput);
      alasanInput.blur();
      await sleep(1000);

      // 3. Klik tombol resolve
      const resolveBtn = await waitForSelector('button.ssc-button.ssc-btn-type-text[data-chain-click*="resolve_update_status"]', 1500);
      if (resolveBtn) {
        resolveBtn.click();
        console.log("🟢 Klik tombol resolve");
      } else {
        console.warn("⚠️ Tombol resolve tidak ditemukan."); continue;
      }
      await sleep(700);

      // 4. Klik tombol konfirmasi
      const confirmBtn = await waitForSelector('button.ssc-message-box-action-button.ssc-btn-type-primary', 1500);
      if (confirmBtn) {
        confirmBtn.click();
        console.log("✅ Klik tombol konfirmasi");
      } else {
        console.warn("⚠️ Tombol konfirmasi tidak ditemukan.");
      }
      await sleep(1000);
    }

    console.log("🎉 Semua resi selesai diproses!");
  }

  // expose global function
  window.runAutoResi = processDaftarResiText;
})();
