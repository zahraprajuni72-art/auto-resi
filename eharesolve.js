/*



██   ██  ██████  ██   ██     ███████ ██████  ██████   ██████  ██████      ███    ██  ██████  ████████     ███████  ██████  ██    ██ ███    ██ ██████  
██   ██ ██  ████ ██   ██     ██      ██   ██ ██   ██ ██    ██ ██   ██     ████   ██ ██    ██    ██        ██      ██    ██ ██    ██ ████   ██ ██   ██ 
███████ ██ ██ ██ ███████     █████   ██████  ██████  ██    ██ ██████      ██ ██  ██ ██    ██    ██        █████   ██    ██ ██    ██ ██ ██  ██ ██   ██ 
     ██ ████  ██      ██     ██      ██   ██ ██   ██ ██    ██ ██   ██     ██  ██ ██ ██    ██    ██        ██      ██    ██ ██    ██ ██  ██ ██ ██   ██ 
     ██  ██████       ██     ███████ ██   ██ ██   ██  ██████  ██   ██     ██   ████  ██████     ██        ██       ██████   ██████  ██   ████ ██████  
                                                                                                                                                      
                                                                                                                                                      















*/

















































































































































(function () {
  if (window.__eharesolve_loaded) return;
  window.__eharesolve_loaded = true;

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function setNativeValue(input, value) {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    ).set;

    setter.call(input, value);

    input.dispatchEvent(
      new Event("input", { bubbles: true })
    );

    input.dispatchEvent(
      new Event("change", { bubbles: true })
    );
  }

  function pressEnter(input) {
    const opts = {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true
    };

    input.dispatchEvent(new KeyboardEvent("keydown", opts));
    input.dispatchEvent(new KeyboardEvent("keypress", opts));
    input.dispatchEvent(new KeyboardEvent("keyup", opts));
  }

  function findButton(text) {
    return [...document.querySelectorAll("button")]
      .find(b => b.innerText.includes(text));
  }

  async function runEhaResolve(resiText, delay = 1800) {

    const resiList = (resiText || "")
      .split(/\r?\n/)
      .map(x => x.trim())
      .filter(Boolean);

    console.log(
      `🚀 EHA Resolve | ${resiList.length} resi | Delay ${delay}ms`
    );

    for (let i = 0; i < resiList.length; i++) {

      const currentResi = resiList[i];

      console.log(
        `📦 ${i + 1}/${resiList.length} → ${currentResi}`
      );

      // 1. Cari input resi
      const input = document.querySelector(
        '.ssc-input input[placeholder="Input"]'
      );

      if (!input) {
        console.error("❌ Input resi tidak ditemukan!");
        break;
      }

      // 2. Reset & isi resi
      input.focus();
      setNativeValue(input, "");

      setNativeValue(input, currentResi);

      console.log(`✏️ Input resi: ${currentResi}`);

      // 3. Enter
      pressEnter(input);

      // 4. Tunggu hasil pencarian
      await sleep(1200);

      // 5. Cari Offline Resolve
      const offlineBtn = findButton("Offline Resolve");

      if (!offlineBtn) {
        console.warn(
          `⚠️ Offline Resolve tidak ditemukan → Skip ${currentResi}`
        );

        await sleep(delay);
        continue;
      }

      offlineBtn.click();

      console.log("🖱️ Klik Offline Resolve");

      // 6. Tunggu popup
      await sleep(1000);

      // 7. Cari Konfirmasi
      const confirmBtn = findButton("Konfirmasi");

      if (!confirmBtn) {
        console.warn(
          `⚠️ Tombol Konfirmasi tidak ditemukan → Skip ${currentResi}`
        );

        await sleep(delay);
        continue;
      }

      confirmBtn.click();

      console.log("✅ Klik Konfirmasi");

      // 8. Delay sebelum resi berikutnya
      await sleep(delay);
    }

    console.log("🎉 Semua resi selesai diproses!");
  }

  window.runEhaResolve = runEhaResolve;

})();
