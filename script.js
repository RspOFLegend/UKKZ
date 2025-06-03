// Variables
let musicPlaying = false;
const weddingDate = new Date('2026-11-23T08:00:00').getTime();

// Countdown target
const targetDate = new Date(2025, 7, 15, 19, 0, 0); // August 15, 2025, 7:00 PM

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Disable scroll on load (pastikan <body class="noscroll"> sudah di HTML)
    updateCountdown();
    setInterval(updateCountdown, 1000);

    new SimpleSlideshow();
    initFloatingMusicPlayer();

    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            console.log('RSVP Data:', data);
            alert('Terima kasih! Konfirmasi kehadiran Anda telah diterima.');
            this.reset();
        });
    }

    const form = document.getElementById('rsvpConfirmationForm');
    const radioGroups = document.querySelectorAll('.radio-group');
    const guestCountGroup = document.getElementById('guestCountGroup');
    const guestCountDisplay = document.getElementById('guestCount');
    const guestCountInput = document.getElementById('guestCountInput');
    const decreaseBtn = document.getElementById('decreaseGuest');
    const increaseBtn = document.getElementById('increaseGuest');
    const submitBtn = document.getElementById('submitBtn');
    const messageContainer = document.getElementById('messageContainer');

    let currentGuestCount = 1;
    const maxGuests = 10;

    if (form) {
        radioGroups.forEach(group => {
            group.addEventListener('click', function () {
                const radio = this.querySelector('input[type="radio"]');
                const value = this.dataset.value;

                radioGroups.forEach(g => g.classList.remove('selected'));

                radio.checked = true;
                this.classList.add('selected');

                if (value === 'hadir') {
                    guestCountGroup.style.display = 'block';
                    setTimeout(() => {
                        guestCountGroup.style.opacity = '1';
                        guestCountGroup.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    guestCountGroup.style.display = 'none';
                    currentGuestCount = 1;
                    updateGuestCount();
                }
            });
        });

        decreaseBtn.addEventListener('click', () => {
            if (currentGuestCount > 1) {
                currentGuestCount--;
                updateGuestCount();
            }
        });

        increaseBtn.addEventListener('click', () => {
            if (currentGuestCount < maxGuests) {
                currentGuestCount++;
                updateGuestCount();
            }
        });

        function updateGuestCount() {
            guestCountDisplay.textContent = currentGuestCount;
            guestCountInput.value = currentGuestCount;
            decreaseBtn.disabled = currentGuestCount <= 1;
            increaseBtn.disabled = currentGuestCount >= maxGuests;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = {
                nama: formData.get('guestName'),
                kehadiran: formData.get('attendance'),
                jumlah_tamu: formData.get('guestCount'),
                pesan: formData.get('additionalMessage')
            };

            if (!data.nama.trim()) {
                showMessage('Mohon masukkan nama lengkap Anda', 'error');
                return;
            }

            if (!data.kehadiran) {
                showMessage('Mohon pilih konfirmasi kehadiran', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Mengirim...';

            setTimeout(() => {
                console.log('RSVP Data:', data);

                let message = `Terima kasih ${data.nama}! `;
                if (data.kehadiran === 'hadir') {
                    message += `Konfirmasi kehadiran untuk ${data.jumlah_tamu} orang telah diterima.`;
                } else {
                    message += `Kami memahami Anda tidak dapat hadir. Terima kasih atas konfirmasinya.`;
                }

                showMessage(message, 'success');
                form.reset();
                radioGroups.forEach(g => g.classList.remove('selected'));
                guestCountGroup.style.display = 'none';
                currentGuestCount = 1;
                updateGuestCount();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Konfirmasi Kehadiran';

            }, 2000);
        });

        function showMessage(text, type) {
            messageContainer.textContent = text;
            messageContainer.className = `message-container message-${type}`;
            messageContainer.style.display = 'block';
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 5000);
        }

        guestCountGroup.style.opacity = '0';
        guestCountGroup.style.transform = 'translateY(20px)';
        guestCountGroup.style.transition = 'all 0.3s ease';
        updateGuestCount();

        const elements = document.querySelectorAll('.flower-decoration, .rsvp-title, .rsvp-subtitle, .rsvp-form-container');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    if (typeof AOS !== 'undefined') AOS.init();

    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function () {
            alert('Menu - Fitur navigasi bisa ditambahkan di sini');
        });
    }

    const acaraMenuBtn = document.querySelector('.menu-btn-acara');
    if (acaraMenuBtn) {
        acaraMenuBtn.addEventListener('click', function () {
            alert('Menu clicked! Customize this functionality as needed.');
        });
    }

    const flower = document.querySelector('.flower-tengah');
    if (flower) {
        flower.addEventListener('mouseenter', function () {
            this.style.transform = 'translate(-50%, -50%) scale(1.1)';
        });
        flower.addEventListener('mouseleave', function () {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    const cards = document.querySelectorAll('.event-card-acara');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Floating Music Player Initialization
function initFloatingMusicPlayer() {
    const musicPlayer = document.getElementById('musicPlayer');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');

    if (!musicPlayer || !backgroundMusic) return;

    let isPlaying = false;

    function toggleFloatingMusic() {
        if (isPlaying) {
            backgroundMusic.pause();
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
            musicPlayer.classList.remove('playing');
            isPlaying = false;
            musicPlaying = false;
        } else {
            backgroundMusic.play().then(() => {
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'block';
                musicPlayer.classList.add('playing');
                isPlaying = true;
                musicPlaying = true;
            }).catch(error => {
                console.log('Error playing audio:', error);
                alert('Tidak dapat memutar musik. Pastikan file audio tersedia.');
            });
        }
    }

    musicPlayer.addEventListener('click', toggleFloatingMusic);

    backgroundMusic.addEventListener('ended', function () {
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        musicPlayer.classList.remove('playing');
        isPlaying = false;
        musicPlaying = false;
    });

    backgroundMusic.addEventListener('play', function () {
        localStorage.setItem('musicPlaying', 'true');
        localStorage.setItem('musicTime', backgroundMusic.currentTime);
    });

    backgroundMusic.addEventListener('pause', function () {
        localStorage.setItem('musicPlaying', 'false');
        localStorage.setItem('musicTime', backgroundMusic.currentTime);
    });

    const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
    const savedTime = localStorage.getItem('musicTime');

    if (savedTime) {
        backgroundMusic.currentTime = parseFloat(savedTime);
    }

    if (wasPlaying) {
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        musicPlayer.classList.add('playing');
        isPlaying = true;
        musicPlaying = true;
    }
}

// Scroll event animation
window.addEventListener('scroll', function () {
    const cards = document.querySelectorAll('.event-card-acara');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Invitation Open
function openInvitation() {
    const opening = document.getElementById('opening');
    const mainContent = document.getElementById('mainContent');
    const leaves = document.getElementById('fallingLeaves');

    if (leaves) leaves.style.display = 'none';
    if (opening) opening.style.display = 'none';
    if (mainContent) {
        mainContent.classList.add('active');
        tryPlayMusic();
    }

    // ✅ Aktifkan scroll
    document.body.classList.remove("noscroll");

    // Sembunyikan tombol jika perlu
    const openBtn = document.querySelector('.open-btn');
    if (openBtn) openBtn.style.display = 'none';
}

// Background movement
document.addEventListener('mousemove', (e) => {
    const container = document.querySelector('.container');
    if (container) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        container.style.transform = `translate(${x * 10 - 5}px, ${y * 10 - 5}px)`;
    }
});

// Music Controls
function toggleMusic() {
    const music = document.getElementById('backgroundMusic');
    const musicIcon = document.getElementById('musicIcon');
    const musicPlayer = document.getElementById('musicPlayer');

    if (!music || !musicIcon || !musicPlayer) return;

    if (musicPlaying) {
        music.pause();
        musicIcon.className = 'fas fa-music';
        musicPlayer.classList.remove('playing');
        musicPlaying = false;
    } else {
        tryPlayMusic();
    }
}

function tryPlayMusic() {
    const music = document.getElementById('backgroundMusic');
    const musicIcon = document.getElementById('musicIcon');
    const musicPlayer = document.getElementById('musicPlayer');

    if (music && musicIcon && musicPlayer) {
        const playPromise = music.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    musicIcon.className = 'fas fa-pause';
                    musicPlayer.classList.add('playing');
                    musicPlaying = true;
                })
                .catch(error => {
                    console.log('Autoplay failed:', error);
                });
        }
    }
}

// Location buttons
function openLocationAcara(eventType) {
    const url = "https://www.google.com/maps/place/Galaxy+Hotel+Banjarmasin/@-3.3244779,114.5988812,17z/data=!4m9!3m8!1s0x2de423e4212fce4b:0x32f154230278af69!5m2!4m1!1i2!8m2!3d-3.3244833!4d114.6014561!16s%2Fg%2F1yh4g682c?entry=ttu";
    window.open(url, '_blank');
}

// Slideshow Class
class SimpleSlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.slideInterval = null;

        this.init();
    }

    init() {
        this.startAutoSlide();

        const container = document.querySelector('.slideshow-container');
        if (container) {
            container.addEventListener('mouseenter', () => this.pauseAutoSlide());
            container.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }

    goToSlide(slideIndex) {
        if (this.slides.length === 0) return;
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = slideIndex;
        this.slides[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 2300);
    }

    pauseAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}

// Slideshow Height Adjustment
function adjustSlideshowHeight(size) {
    const section = document.querySelector('.slideshow-section');
    if (section) section.className = `slideshow-section height-${size}`;
}

// Kembali ke tab awal saat halaman di-refresh
window.onbeforeunload = function () {
    window.scrollTo(0, 0); // Scroll ke atas

    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.classList.remove('active');
    }

    const opening = document.getElementById('opening');
    if (opening) {
        opening.style.display = 'block';
    }

    const leaves = document.getElementById('fallingLeaves');
    if (leaves) {
        leaves.style.display = 'block';
    }

    // Tambahan opsional: Matikan musik jika masih jalan
    const music = document.getElementById('backgroundMusic');
    if (music) music.pause();
};
