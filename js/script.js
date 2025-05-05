const passwordCorrect = "smkspb25";
const countdownDate = new Date("2025-05-05T23:00:00").getTime(); // Waktu mulai
const autoCloseDate = new Date(countdownDate + 1 * 60 * 60 * 1000).getTime(); // Tutup 1 jam setelahnya

function checkLogin() {
    const now = Date.now();
    if (now < countdownDate) {
        alert("Pengumuman belum dibuka.");
        return;
    }
    if (now > autoCloseDate) {
        alert("Pengumuman sudah ditutup.");
        return;
    }

    const nisn = document.getElementById("nisn").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (pass !== passwordCorrect) {
        alert("Password salah!");
        return;
    }

    const siswa = siswaData.find(s => s.nomor === nisn);
    if (!siswa) {
        alert("Nomor peserta tidak ditemukan.");
        return;
    }

    document.getElementById("login-form").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("nama").textContent = siswa.nama;
    document.getElementById("kelas").textContent = siswa.kelas;
    document.getElementById("nomor").textContent = siswa.nomor;
    document.getElementById("status").textContent = siswa.status;
}

function logout() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("result").style.display = "none";
}

function printPDF() {
    window.print();
}

function updateCountdown() {
    const now = new Date().getTime();

    if (now < countdownDate) {
        const distance = countdownDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML =
            `Pengumuman dimulai dalam: ${days}h ${hours}j ${minutes}m ${seconds}d`;
        document.getElementById("login-form").style.display = "none";
    } else if (now >= countdownDate && now <= autoCloseDate) {
        const distance = autoCloseDate - now;
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML =
            `Pengumuman aktif. Ditutup dalam: ${hours}j ${minutes}m ${seconds}d`;
        document.getElementById("login-form").style.display = "block";
    } else {
        document.getElementById("countdown").innerHTML = "Pengumuman telah ditutup";
        document.getElementById("login-form").style.display = "none";
    }
}

setInterval(updateCountdown, 1000);
