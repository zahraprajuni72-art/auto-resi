// =============================
// auto_at.js
// =============================

// Fungsi utama: jalanin auto input resi
window.runAutoAT = function(resiText, delay = 800) {
  // Ubah text ke array
  const resiList = resiText.trim().split(/\s+/);

  let i = 0;
  function inputResi() {
    if (i >= resiList.length) {
      console.log("✅ Semua resi selesai diproses (AT)!");
      return;
    }

    let inputBox = document.querySelector('input[placeholder="Please Scan Or Input SPX TN/TO"]');
    if (inputBox) {
      inputBox.value = resiList[i];
      inputBox.dispatchEvent(new Event("input", { bubbles: true }));

      let evt = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
      inputBox.dispatchEvent(evt);

      console.log("➡️ Resi diproses (AT):", resiList[i]);
    } else {
      console.log("⚠️ Input box tidak ditemukan!");
    }

    i++;
    setTimeout(inputResi, delay);
  }

  inputResi();
};
