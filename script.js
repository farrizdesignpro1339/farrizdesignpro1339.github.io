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

// GitHub Stats + Changelog - live from API
async function loadGitHubStats(){
  try{
    const userRes = await fetch('https://api.github.com/users/farrizdesignpro1339');
    const user = await userRes.json();
    if(user.public_repos !== undefined){
      document.getElementById('stat-repos').textContent = user.public_repos;
      document.getElementById('stat-stars') && (document.getElementById('stat-stars').textContent = '—');
    }
    // device-tree
    const dtRes = await fetch('https://api.github.com/repos/farrizdesignpro1339/android_device_xiaomi_serenity');
    const dt = await dtRes.json();
    // vendor
    const vnRes = await fetch('https://api.github.com/repos/farrizdesignpro1339/android_vendor_xiaomi_serenity');
    const vn = await vnRes.json();
    let totalStars = (dt.stargazers_count||0) + (vn.stargazers_count||0);
    let totalForks = (dt.forks_count||0) + (vn.forks_count||0);
    document.getElementById('stat-stars').textContent = totalStars;
    document.getElementById('stat-forks').textContent = totalForks;
    document.getElementById('stat-device-tree').innerHTML = `<strong>android_device_xiaomi_serenity</strong><br>⭐ ${dt.stargazers_count} · 🍴 ${dt.forks} · 📝 ${dt.open_issues} issues`;
    document.getElementById('stat-vendor').innerHTML = `<strong>android_vendor_xiaomi_serenity</strong><br>⭐ ${vn.stargazers_count} · 🍴 ${vn.forks} · 📝 ${vn.open_issues} issues`;
    // commits count via contributors? estimate
    const commitsRes = await fetch('https://api.github.com/repos/farrizdesignpro1339/android_device_xiaomi_serenity/commits?per_page=1');
    const link = commitsRes.headers.get('Link');
    // fallback: fetch commits list for count
    const allCommits = await fetch('https://api.github.com/repos/farrizdesignpro1339/android_device_xiaomi_serenity/commits?per_page=100');
    const commits = await allCommits.json();
    document.getElementById('stat-commits').textContent = Array.isArray(commits) ? commits.length + '+' : '--';
  }catch(e){
    console.log('stats error',e);
    document.getElementById('stat-stars').textContent='0';
    document.getElementById('stat-repos').textContent='2';
    document.getElementById('stat-commits').textContent='20+';
    document.getElementById('stat-forks').textContent='1';
  }
}
async function loadChangelog(){
  try{
    const res = await fetch('https://api.github.com/repos/farrizdesignpro1339/android_device_xiaomi_serenity/commits?per_page=5');
    const commits = await res.json();
    const list = document.getElementById('changelog-list');
    if(!Array.isArray(commits) || commits.length===0) throw new Error('no commits');
    list.innerHTML = commits.map(c=>{
      const msg = c.commit.message.split('\n')[0];
      const date = new Date(c.commit.author.date).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
      const author = c.commit.author.name;
      return `<div class="changelog-item"><div class="changelog-dot"></div><div><div class="changelog-msg">${msg}</div><div class="changelog-meta">${author} · ${date} · <a href="${c.html_url}" target="_blank" style="color:var(--md-primary)">view</a></div></div></div>`;
    }).join('');
  }catch(e){
    document.getElementById('changelog-list').innerHTML = '<p class="changelog-loading">Gagal load changelog. <a href="https://github.com/farrizdesignpro1339/android_device_xiaomi_serenity/commits/main" target="_blank">Buka di GitHub</a></p>';
  }
}
loadGitHubStats();
loadChangelog();
