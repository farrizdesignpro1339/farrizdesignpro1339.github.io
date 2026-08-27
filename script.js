// M3 Expressive - soft motion, no hacker effects

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

// Skill bar animation
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const w = entry.target.getAttribute('data-width');
            entry.target.style.width = w + '%';
        }
    });
}, { threshold: 0.4 });
skillFills.forEach(f => skillObserver.observe(f));

// Fade in sections
const fadeSections = document.querySelectorAll('section');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('fade-in');
    });
}, { threshold: 0.08 });
fadeSections.forEach(s => fadeObserver.observe(s));

// Stagger project cards
const cards = document.querySelectorAll('.project-card');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry,i) => {
        if(entry.isIntersecting){
            entry.target.style.opacity='0';
            entry.target.style.transform='translateY(12px)';
            setTimeout(()=>{
                entry.target.style.transition='all 0.5s cubic-bezier(0.2,0,0,1)';
                entry.target.style.opacity='1';
                entry.target.style.transform='translateY(0)';
            }, i*80);
        }
    });
},{threshold:0.15});
cards.forEach(c=>cardObserver.observe(c));

// Detect visitor OS (keep useful feature)
function detectOS(){
    const ua=navigator.userAgent;
    let os='Unknown OS';
    let host=navigator.platform||'Unknown Device';
    if(ua.indexOf('Android')!==-1) os='Android';
    else if(ua.indexOf('iPhone')!==-1||ua.indexOf('iPad')!==-1) os='iOS';
    else if(ua.indexOf('Win')!==-1) os='Windows';
    else if(ua.indexOf('Mac')!==-1) os='macOS';
    else if(ua.indexOf('Linux')!==-1) os='Linux';
    let browser='Unknown Browser';
    if(ua.indexOf('Firefox')!==-1) browser='Firefox';
    else if(ua.indexOf('Edg')!==-1) browser='Edge';
    else if(ua.indexOf('Chrome')!==-1) browser='Chrome';
    else if(ua.indexOf('Safari')!==-1) browser='Safari';
    else if(ua.indexOf('OPR')!==-1||ua.indexOf('Opera')!==-1) browser='Opera';
    const isMobile=/Android|iPhone|iPad|iPod/i.test(ua);
    return {os, host, browser, deviceType:isMobile?'Mobile':'Desktop'};
}
function updateVisitorInfo(){
    const elOS=document.getElementById('visitor-os');
    if(!elOS) return;
    const info=detectOS();
    document.getElementById('visitor-os').textContent=info.os;
    document.getElementById('visitor-host').textContent=info.host;
    document.getElementById('visitor-browser').textContent=info.browser;
    document.getElementById('visitor-device').textContent=info.deviceType;
}
updateVisitorInfo();
