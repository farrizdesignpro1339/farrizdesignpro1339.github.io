// Matrix rain background
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('matrix-canvas').appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1793D1';
    ctx.font = fontSize + 'px Fira Code';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Typing effect for hero terminal
const terminalLines = document.querySelectorAll('.terminal-body .line');
terminalLines.forEach((line, index) => {
    line.style.opacity = '0';
    setTimeout(() => {
        line.style.opacity = '1';
        line.style.animation = 'fadeInUp 0.4s ease forwards';
    }, index * 200);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Skill bar animation on scroll
const skillFills = document.querySelectorAll('.skill-fill');

const observerOptions = {
    threshold: 0.5
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width + '%';
        }
    });
}, observerOptions);

skillFills.forEach(fill => {
    skillObserver.observe(fill);
});

// Fade in sections on scroll
const fadeSections = document.querySelectorAll('section');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

fadeSections.forEach(section => {
    fadeObserver.observe(section);
});

// Konami code easter egg
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        konamiCode = [];
    }
});

// Random glitch effect
function randomGlitch() {
    const glitchEl = document.querySelector('.glitch');
    if (glitchEl) {
        glitchEl.style.textShadow = '2px 0 #1793D1, -2px 0 #ff3333';
        setTimeout(() => {
            glitchEl.style.textShadow = 'none';
        }, 100);
    }
    setTimeout(randomGlitch, Math.random() * 5000 + 3000);
}

randomGlitch();

// Detect visitor OS
function detectOS() {
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    let host = navigator.platform || 'Unknown Device';

    if (ua.indexOf('Android') !== -1) os = 'Android';
    else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) os = 'iOS';
    else if (ua.indexOf('Win') !== -1) os = 'Windows';
    else if (ua.indexOf('Mac') !== -1) os = 'macOS';
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';

    // Detect browser
    let browser = 'Unknown Browser';
    if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
    else if (ua.indexOf('Edg') !== -1) browser = 'Edge';
    else if (ua.indexOf('Chrome') !== -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') !== -1) browser = 'Safari';
    else if (ua.indexOf('OPR') !== -1 || ua.indexOf('Opera') !== -1) browser = 'Opera';

    // Detect if mobile
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';

    return { os, host, browser, deviceType };
}

function updateVisitorInfo() {
    const visitorOS = document.getElementById('visitor-os');
    const visitorHost = document.getElementById('visitor-host');
    const visitorBrowser = document.getElementById('visitor-browser');
    const visitorDevice = document.getElementById('visitor-device');

    if (visitorOS) {
        const info = detectOS();
        visitorOS.textContent = info.os;
        visitorHost.textContent = info.host;
        visitorBrowser.textContent = info.browser;
        visitorDevice.textContent = info.deviceType;
    }
}

// Run on load
updateVisitorInfo();
