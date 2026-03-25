// ============================================
//  RESQ — DISASTER RELIEF COORDINATION APP
//  app.js — All logic, data, and interactions
// ============================================

// ============ LOCAL STORAGE DATA LAYER ============

const DB = {
  get: (key) => { try { return JSON.parse(localStorage.getItem('resq_' + key)) || []; } catch { return []; } },
  set: (key, val) => { try { localStorage.setItem('resq_' + key, JSON.stringify(val)); } catch {} },
  push: (key, val) => { const arr = DB.get(key); arr.push(val); DB.set(key, arr); return arr; }
};

// ============ SEED VOLUNTEER DATA ============

const SEED_VOLUNTEERS = [
  { id: 'v001', name: 'Ravi Kumar', age: 28, phone: '+91 98001 11234', location: 'Sector 4, Nagpur', skills: ['Search & Rescue', 'Engineering / Repair'], availability: 'immediate', status: 'deployed', experience: 'Ex-Army, 5 years service', avatar: '#e74c3c', initials: 'RK' },
  { id: 'v002', name: 'Dr. Meera Singh', age: 34, phone: '+91 98002 22345', location: 'Sector 7, Nagpur', skills: ['Medical / First Aid', 'Counselling'], availability: 'immediate', status: 'deployed', experience: 'MBBS, Red Cross certified', avatar: '#27ae60', initials: 'MS' },
  { id: 'v003', name: 'Priya Sharma', age: 25, phone: '+91 98003 33456', location: 'Civil Lines, Nagpur', skills: ['Food / Cooking', 'Logistics'], availability: 'immediate', status: 'available', experience: 'NGO volunteer, 2 years', avatar: '#e67e22', initials: 'PS' },
  { id: 'v004', name: 'Amit Khanna', age: 30, phone: '+91 98004 44567', location: 'Old Town, Nagpur', skills: ['Transport / Driver', 'Logistics'], availability: '24hrs', status: 'available', experience: '4WD vehicle, 8 years driving', avatar: '#2980b9', initials: 'AK' },
  { id: 'v005', name: 'Sunita Nair', age: 27, phone: '+91 98005 55678', location: 'Dharampeth, Nagpur', skills: ['Counselling', 'Communications / Tech'], availability: 'immediate', status: 'available', experience: 'Psychology grad, NCC trained', avatar: '#8e44ad', initials: 'SN' },
  { id: 'v006', name: 'Suresh Tiwari', age: 42, phone: '+91 98006 66789', location: 'NH-48, Zone C', skills: ['Engineering / Repair', 'Heavy Equipment'], availability: 'immediate', status: 'deployed', experience: 'Civil engineer, 15 years', avatar: '#c0392b', initials: 'ST' },
  { id: 'v007', name: 'Neha Rao', age: 29, phone: '+91 98007 77890', location: 'Colony 3, Nagpur', skills: ['Engineering / Repair', 'Communications / Tech'], availability: '24hrs', status: 'available', experience: 'Electrical engineer', avatar: '#16a085', initials: 'NR' },
  { id: 'v008', name: 'Pooja Malhotra', age: 31, phone: '+91 98008 88901', location: 'Sitabuldi, Nagpur', skills: ['Medical / First Aid', 'Logistics'], availability: 'immediate', status: 'available', experience: 'Nurse, 6 years ICU experience', avatar: '#d35400', initials: 'PM' },
  { id: 'v009', name: 'Ajay Verma', age: 36, phone: '+91 98009 99012', location: 'Wardha Road, Nagpur', skills: ['Transport / Driver', 'Search & Rescue'], availability: 'weekends', status: 'offline', experience: 'Truck driver, Red Cross basic training', avatar: '#7f8c8d', initials: 'AV' },
  { id: 'v010', name: 'Kavita Desai', age: 24, phone: '+91 98010 10123', location: 'Pratap Nagar, Nagpur', skills: ['Translation / Language', 'Counselling'], availability: 'immediate', status: 'available', experience: 'Speaks Hindi, Marathi, English, Telugu', avatar: '#9b59b6', initials: 'KD' },
];

function initDB() {
  if (!DB.get('volunteers').length) {
    DB.set('volunteers', SEED_VOLUNTEERS);
  }
}

// ============ NAVIGATION ============

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'volunteers') renderVolunteers();
}

// ============ SKILLS TOGGLE ============

const selectedSkills = [];

function toggleSkill(el) {
  el.classList.toggle('selected');
  const skill = el.dataset.skill;
  const idx = selectedSkills.indexOf(skill);
  if (idx === -1) selectedSkills.push(skill);
  else selectedSkills.splice(idx, 1);
}

// ============ NEED TOGGLE ============

const selectedNeeds = [];

function toggleNeed(el) {
  el.classList.toggle('selected');
  const need = el.dataset.need;
  const idx = selectedNeeds.indexOf(need);
  if (idx === -1) selectedNeeds.push(need);
  else selectedNeeds.splice(idx, 1);
}

// ============ REGISTRATION SUBMIT ============

function submitRegistration(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const age = document.getElementById('reg-age').value;
  const phone = document.getElementById('reg-phone').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const location = document.getElementById('reg-location').value.trim();
  const experience = document.getElementById('reg-experience').value.trim();
  const emergencyName = document.getElementById('reg-emergency-name').value.trim();
  const emergencyPhone = document.getElementById('reg-emergency-phone').value.trim();
  const availability = document.querySelector('input[name="availability"]:checked')?.value || 'immediate';

  if (!name || !phone || !location) { showToast('Please fill all required fields.', true); return; }
  if (selectedSkills.length === 0) { showToast('Please select at least one skill.', true); return; }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#e74c3c','#e67e22','#27ae60','#2980b9','#8e44ad','#16a085','#d35400','#c0392b','#1abc9c'];
  const avatar = colors[Math.floor(Math.random() * colors.length)];

  const volunteer = {
    id: 'v' + Date.now(),
    name, age, phone, email, location, experience,
    emergencyContact: { name: emergencyName, phone: emergencyPhone },
    skills: [...selectedSkills],
    availability,
    status: 'available',
    avatar, initials,
    registeredAt: new Date().toISOString()
  };

  DB.push('volunteers', volunteer);

  // Update live counter
  const vols = DB.get('volunteers');
  const counter = document.getElementById('stat-volunteers');
  if (counter) counter.textContent = vols.length.toLocaleString();

  showToast(`✅ Welcome, ${name}! You are now live in the network. Coordinators can see your profile.`);
  e.target.reset();
  selectedSkills.length = 0;
  document.querySelectorAll('.skill-option.selected').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('input[name="availability"]').forEach(el => el.checked = false);

  setTimeout(() => showPage('volunteers'), 1800);
}

// ============ REQUEST SUBMIT ============

function submitRequest(e) {
  e.preventDefault();
  const name = document.getElementById('req-name').value.trim();
  const phone = document.getElementById('req-phone').value.trim();
  const location = document.getElementById('req-location').value.trim();
  const desc = document.getElementById('req-desc').value.trim();
  const count = document.getElementById('req-count').value;
  const medical = document.getElementById('req-medical').value.trim();
  const urgency = document.querySelector('input[name="urgency"]:checked')?.value;

  if (!name || !phone || !location || !desc) { showToast('Please fill all required fields.', true); return; }
  if (!urgency) { showToast('Please select urgency level.', true); return; }

  const request = {
    id: 'R' + Date.now(),
    name, phone, location, desc, count, medical,
    needs: [...selectedNeeds],
    urgency,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  DB.push('help_requests', request);

  const urgencyMsg = urgency === 'critical' ? 'A coordinator has been notified immediately.' : 'Your request is in the queue.';
  showToast(`🆘 Request received, ${name}. ${urgencyMsg} We will contact you at ${phone}.`);
  e.target.reset();
  selectedNeeds.length = 0;
  document.querySelectorAll('.need-type.selected').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('input[name="urgency"]').forEach(el => el.checked = false);
}

// ============ VOLUNTEERS PAGE ============

let currentFilter = 'all';
let currentSearch = '';

function renderVolunteers(filter, search) {
  if (filter !== undefined) currentFilter = filter;
  if (search !== undefined) currentSearch = search.toLowerCase();

  const grid = document.getElementById('vol-grid');
  if (!grid) return;

  let vols = DB.get('volunteers');

  if (currentFilter === 'available') vols = vols.filter(v => v.status === 'available');
  else if (currentFilter === 'deployed') vols = vols.filter(v => v.status === 'deployed');

  if (currentSearch) {
    vols = vols.filter(v =>
      v.name.toLowerCase().includes(currentSearch) ||
      (v.skills || []).some(s => s.toLowerCase().includes(currentSearch)) ||
      (v.location || '').toLowerCase().includes(currentSearch)
    );
  }

  if (!vols.length) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:4rem; color:var(--text3); font-family:var(--font-mono);">No volunteers found.</div>`;
    return;
  }

  grid.innerHTML = vols.map(v => `
    <div class="vol-card ${v.status}" style="animation: fadeIn 0.4s ease both">
      <div class="vol-avatar" style="background:${v.avatar || '#555'}">${v.initials || '??'}</div>
      <div class="vol-name">${v.name}</div>
      <div class="vol-loc">📍 ${v.location || '—'}</div>
      <span class="vol-status status-${v.status}">${statusLabel(v.status)}</span>
      ${v.availability ? `<div style="font-size:0.75rem;color:var(--text3);font-family:var(--font-mono);margin-bottom:0.75rem">⏱ ${availLabel(v.availability)}</div>` : ''}
      <div class="vol-skills">
        ${(v.skills || []).map(s => `<span class="vol-skill-tag">${s}</span>`).join('')}
      </div>
      ${v.experience ? `<div style="font-size:0.78rem;color:var(--text3);margin-top:0.75rem;border-top:1px solid var(--border);padding-top:0.75rem">${v.experience}</div>` : ''}
    </div>
  `).join('');
}

function statusLabel(s) {
  return { available: '● AVAILABLE', deployed: '◉ DEPLOYED', offline: '○ OFFLINE' }[s] || s.toUpperCase();
}

function availLabel(a) {
  return { immediate: 'Available immediately', '24hrs': 'Within 24 hours', weekends: 'Weekends only' }[a] || a;
}

function filterVols(btn, filter) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderVolunteers(filter, currentSearch);
}

function searchVols(val) {
  renderVolunteers(currentFilter, val);
}

// ============ SOS ============

function triggerSOS() {
  document.getElementById('sos-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      document.getElementById('sos-coords').textContent =
        `GPS: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`;
    }, () => {
      document.getElementById('sos-coords').textContent = 'GPS unavailable — sharing cell tower location';
    });
  }
}

function closeSOS() {
  document.getElementById('sos-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ============ TASK DETAIL ============

function openTask(id) {
  showToast(`📋 Task ${id} opened — full detail view coming in next build.`);
}

// ============ TOAST ============

function showToast(msg, error = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (error ? ' error' : '');
  setTimeout(() => t.classList.add('hidden'), 5000);
}

// ============ ANIMATED STATS COUNTER ============

function animateCount(el, target, duration = 1500) {
  const start = 0;
  const step = (target / duration) * 16;
  let current = start;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 16);
}

// ============ LIVE TICKER DUPLICATE ============

function setupTicker() {
  const ticker = document.querySelector('.ticker');
  if (!ticker) return;
  // Duplicate for infinite scroll
  ticker.innerHTML += ticker.innerHTML;
}

// ============ INIT ============

document.addEventListener('DOMContentLoaded', () => {
  initDB();
  setupTicker();

  // Animate hero stats
  const vols = DB.get('volunteers');
  setTimeout(() => {
    const sv = document.getElementById('stat-volunteers');
    const sh = document.getElementById('stat-helped');
    const so = document.getElementById('stat-ops');
    if (sv) animateCount(sv, Math.max(vols.length, 1247));
    if (sh) animateCount(sh, 8932);
    if (so) animateCount(so, 43);
  }, 300);

  // Close SOS on backdrop click
  document.getElementById('sos-modal').addEventListener('click', function(e) {
    if (e.target === this) closeSOS();
  });
});
