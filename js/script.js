// Import data siswa dari students.js
import { studentsData } from '../assets/data/students.js';

// Konfigurasi Aplikasi
const SCHOOL_NAME = "SMP Al-Qur'an Putra Bahari Ternate";
const PASSWORD = "smpAL-QUR'AN25";
const LOGO_PATH = 'assets/images/logo.png'; // Path logo sekolah Anda
const BACKGROUND_PATH = 'assets/images/background.jpg'; // Path gambar background Anda

// Tanggal dan waktu pengumuman (YYYY-MM-DD HH:MM:SS)
const ANNOUNCEMENT_DATE = new Date('2025-06-15T10:00:00').getTime(); // Contoh: 15 Juni 2025, 10:00:00 WITA
// Batas waktu akses pengumuman (setelah tanggal pengumuman, misal 7 hari setelah pengumuman)
const ACCESS_LIMIT_DAYS = 7; 

// DOM Elements
const loginSection = document.getElementById('loginSection');
const resultSection = document.getElementById('resultSection');
const nisnInput = document.getElementById('nisn');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const messageDiv = document.getElementById('message');
const studentName = document.getElementById('studentName');
const studentDOB = document.getElementById('studentDOB');
const studentNISN = document.getElementById('studentNISN');
const studentExamNumber = document.getElementById('studentExamNumber');
const studentStatus = document.getElementById('studentStatus');
const logoutButton = document.getElementById('logoutButton');
const printButton = document.getElementById('printButton');
const countdownDiv = document.getElementById('countdown');
const schoolNameHeader = document.getElementById('schoolNameHeader');
const schoolNameSubtitle = document.getElementById('schoolNameSubtitle');
const schoolLogo = document.getElementById('schoolLogo');
const copyrightYear = document.getElementById('copyrightYear');

// Set School Name and Logo
schoolNameHeader.textContent = SCHOOL_NAME;
schoolNameSubtitle.textContent = `Pengumuman Kelulusan ${SCHOOL_NAME}`;
schoolLogo.src = LOGO_PATH;
document.body.style.backgroundImage = `url('${BACKGROUND_PATH}')`;
copyrightYear.textContent = new Date().getFullYear();

let loggedInStudent = null; // Menyimpan data siswa yang berhasil login

// --- Countdown Timer ---
function updateCountdown() {
    const now = new Date().getTime();
    const distance = ANNOUNCEMENT_DATE - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
        clearInterval(countdownInterval);
        countdownDiv.innerHTML = "Pengumuman Sudah Dibuka!";
        checkAccessTime(); // Cek batas waktu akses setelah pengumuman dibuka
        loginButton.disabled = false; // Aktifkan tombol login setelah countdown selesai
    } else {
        countdownDiv.innerHTML = `
            <div>${days}<span>HARI</span></div>
            <div>${hours}<span>JAM</span></div>
            <div>${minutes}<span>MENIT</span></div>
            <div>${seconds}<span>DETIK</span></div>
        `;
        loginButton.disabled = true; // Nonaktifkan tombol login sebelum countdown selesai
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Jalankan sekali saat load untuk menghindari delay

// --- Check Access Time Limit ---
function checkAccessTime() {
    const now = new Date().getTime();
    const announcementTime = ANNOUNCEMENT_DATE;
    const accessLimitTime = announcementTime + (ACCESS_LIMIT_DAYS * 24 * 60 * 60 * 1000); // Batas waktu akses

    if (now > accessLimitTime) {
        messageDiv.textContent = "Mohon maaf, waktu akses pengumuman sudah berakhir.";
        messageDiv.style.color = "red";
        loginSection.style.display = 'none';
        resultSection.style.display = 'none';
        clearInterval(countdownInterval); // Hentikan countdown jika sudah lewat batas akses
    } else {
        // Jika masih dalam periode akses, tampilkan login jika belum ada hasil
        if (!loggedInStudent && (now >= ANNOUNCEMENT_DATE)) {
            loginSection.style.display = 'block';
        }
    }
}

// Jalankan saat load untuk memastikan status akses
checkAccessTime();

// --- Login Logic ---
loginButton.addEventListener('click', () => {
    const nisn = nisnInput.value.trim();
    const password = passwordInput.value.trim();

    if (new Date().getTime() < ANNOUNCEMENT_DATE) {
        messageDiv.textContent = "Pengumuman belum dibuka. Harap tunggu hingga waktu yang ditentukan.";
        messageDiv.style.color = "orange";
        return;
    }

    if (nisn === "" || password === "") {
        messageDiv.textContent = "NISN dan Password tidak boleh kosong.";
        messageDiv.style.color = "red";
        return;
    }

    if (password !== PASSWORD) {
        messageDiv.textContent = "Password salah.";
        messageDiv.style.color = "red";
        return;
    }

    const student = studentsData.find(s => s.nisn === nisn);

    if (student) {
        loggedInStudent = student;
        displayResult(student);
    } else {
        messageDiv.textContent = "NISN tidak ditemukan.";
        messageDiv.style.color = "red";
    }
});

// --- Display Result ---
function displayResult(student) {
    loginSection.style.display = 'none';
    resultSection.style.display = 'block';
    messageDiv.textContent = ""; // Bersihkan pesan error

    studentName.textContent = student.name;
    studentDOB.textContent = student.dob;
    studentNISN.textContent = student.nisn;
    studentExamNumber.textContent = student.examNumber;

    studentStatus.textContent = student.status;
    studentStatus.className = 'status-kelulusan ' + student.status.replace(/\s/g, '-').toUpperCase(); // Class untuk styling LULUS/TIDAK-LULUS
}

// --- Logout Logic ---
logoutButton.addEventListener('click', () => {
    loggedInStudent = null;
    nisnInput.value = "";
    passwordInput.value = "";
    loginSection.style.display = 'block';
    resultSection.style.display = 'none';
    messageDiv.textContent = "";
});

// --- Print PDF Logic (using jsPDF library) ---
printButton.addEventListener('click', () => {
    if (!loggedInStudent) {
        alert("Silakan login terlebih dahulu untuk mencetak bukti kelulusan.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont('helvetica');
    doc.setFontSize(10);

    // Header
    doc.addImage(LOGO_PATH, 'PNG', 15, 10, 30, 30);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(SCHOOL_NAME, 50, 20);
    doc.setFontSize(12);
    doc.text("Bukti Pengumuman Kelulusan", 50, 27);
    doc.text("Tahun Ajaran 2024/2025", 50, 34);
    doc.line(15, 45, 195, 45); // Garis pemisah

    // Student Data
    doc.setFontSize(11);
    let yPos = 60;
    doc.text("Data Siswa:", 15, yPos);
    yPos += 8;
    doc.text(`Nama Lengkap   : ${loggedInStudent.name}`, 25, yPos);
    yPos += 8;
    doc.text(`Tempat, Tgl Lahir : ${loggedInStudent.dob}`, 25, yPos);
    yPos += 8;
    doc.text(`NISN               : ${loggedInStudent.nisn}`, 25, yPos);
    yPos += 8;
    doc.text(`Nomor Ujian       : ${loggedInStudent.examNumber}`, 25, yPos);

    yPos += 20;
    doc.setFontSize(16);
    doc.text("STATUS KELULUSAN:", 15, yPos);
    yPos += 10;
    doc.setFontSize(24);
    if (loggedInStudent.status === "LULUS") {
        doc.setTextColor(40, 167, 69); // Hijau
    } else {
        doc.setTextColor(220, 53, 69); // Merah
    }
    doc.text(loggedInStudent.status.toUpperCase(), 105, yPos, { align: 'center' }); // Tengah

    doc.setTextColor(0, 0, 0); // Reset warna teks
    doc.setFontSize(10);
    yPos += 20;
    doc.text("Demikian pengumuman kelulusan ini disampaikan untuk diketahui sebagaimana mestinya.", 15, yPos);

    // Footer
    doc.setFontSize(9);
    doc.text(`Dicetak pada: ${new Date().toLocaleString()}`, 15, doc.internal.pageSize.height - 15);
    doc.text(`Copyright © ${new Date().getFullYear()} ${SCHOOL_NAME}`, 15, doc.internal.pageSize.height - 10);

    doc.save(`bukti-kelulusan-${loggedInStudent.nisn}.pdf`);
});

// Initial display setup
if (new Date().getTime() < ANNOUNCEMENT_DATE) {
    loginSection.style.display = 'none';
    resultSection.style.display = 'none';
} else {
    loginSection.style.display = 'block';
    resultSection.style.display = 'none';
}
