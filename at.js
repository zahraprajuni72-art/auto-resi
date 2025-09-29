// =============================
// at.js (Auto Input Resi AT)
// =============================

// Fungsi utama: auto input resi ke kolom + Enter
window.runAutoAT = function(resiText, delay = 800) {
  // Ubah text ke array per baris
  const resiList = resiText.trim().split(/\s+/);

  let i = 0;
  function inputResi() {
    if (i >= resiList.length) {
      console.log("✅ Semua resi selesai diproses (AT)!");
      return;
    }

    // Cari input box
    let inputBox = document.querySelector('input[placeholder="Please Scan Or Input SPX TN/TO"]');
    if (inputBox) {
      // Masukkan resi
      inputBox.value = resiList[i];
      inputBox.dispatchEvent(new Event("input", { bubbles: true }));

      // Simulasi tekan Enter
      let evt = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
      inputBox.dispatchEvent(evt);

      console.log(`➡️ Resi diproses (AT): ${resiList[i]} (${i+1}/${resiList.length})`);
    } else {
      console.log("⚠️ Input box tidak ditemukan!");
    }

    i++;
    setTimeout(inputResi, delay);
  }

  // Mulai eksekusi
  inputResi();
};
