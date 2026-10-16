// Data yang anda cari tidak ada 











































































































































































































































































(function () {
  if (window.__ehabatch_loaded) return;
  window.__ehabatch_loaded = true;

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function getActiveInput() {
    return Array.from(
      document.querySelectorAll('input[placeholder="Mohon masukan"]')
    ).find(el => el.offsetParent !== null);
  }

  function setValue(input, value) {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    ).set;

    const lastValue = input.value;
    setter.call(input, value);

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    if (input._valueTracker) {
      input._valueTracker.setValue(lastValue);
    }
  }

  function pressEnter(input) {
    const opts = {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true
    };

    ["keydown", "keypress", "keyup"].forEach(type => {
      input.dispatchEvent(new KeyboardEvent(type, opts));
    });
  }

  async function runEhaBatch(resiText, delay = 1800) {
    const resiList = (resiText || "")
      .split(/\r?\n/)
      .map(x => x.trim())
      .filter(Boolean);

    console.log(`🚀 EHA Batch | ${resiList.length} resi | Delay ${delay}ms`);

    for (let i = 0; i < resiList.length; i++) {
      const resi = resiList[i];

      console.log(`📦 ${i + 1}/${resiList.length} → ${resi}`);

      let input = getActiveInput();

      while (!input) {
        console.log("⏳ Menunggu input...");
        await sleep(1000);
        input = getActiveInput();
      }

      input.click();
      input.focus();

      setValue(input, resi);

      await sleep(400);

      pressEnter(input);

      console.log(`✅ ${resi} dikirim`);

      await sleep(delay);
    }

    console.log("🎉 Semua resi selesai!");
  }

  window.runEhaBatch = runEhaBatch;
})();
