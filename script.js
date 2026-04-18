document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    feather.replace();

    // 2. Global Search
    const searchInput = document.getElementById('global-search');
    if(searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                showToast(`Searching for "${e.target.value}"...`);
                e.target.value = '';
            }
        });
    }

    // 3. Navigation SPA Logic
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-section');
    let chartsInitialized = false;
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const targetId = item.getAttribute('data-target');
            views.forEach(view => {
                view.classList.remove('active-view');
                if(view.id === targetId) {
                    view.classList.add('active-view');
                }
            });

            // Handle specific view initializations when they become visible
            if (targetId === 'view-live-map') {
                initFullMap();
                setTimeout(() => { if(fullMap) fullMap.invalidateSize(); }, 50);
            }
            if (targetId === 'view-analytics' && !chartsInitialized) {
                initAnalyticsCharts();
                chartsInitialized = true;
            }
            if (targetId === 'view-safety') {
                renderSafetyCenter();
            }
        });
    });

    // 4. Data Setup
    const incidentData = [
        { id: '1', driver: 'Marcus Thorne', time: '14:20', type: 'COLLISION', category: 'red', icon: 'alert-octagon', loc: 'Connaught Place', status: 'Active', coords: [28.6304, 77.2177] },
        { id: '2', driver: 'Elena Rodriguez', time: '12:05', type: 'HARSH BRAKING', category: 'blue', icon: 'wind', loc: 'Ring Road', status: 'Logged', coords: [28.5921, 77.2280] },
        { id: '3', driver: 'James Wilson', time: '09:15', type: 'RAPID ACCEL', category: 'purple', icon: 'zap', loc: 'Cyber Hub', status: 'Resolved', coords: [28.4950, 77.0895] },
        { id: '4', driver: 'Sara Jenkins', time: 'Yesterday', type: 'ENGINE MALF', category: 'red', icon: 'tool', loc: 'Nehru Place', status: 'Logged', coords: [28.5494, 77.2530] }
    ];

    // 5. Render Sidebar Events (Overview Tab)
    const eventsContainer = document.getElementById('events-list-container');
    if (eventsContainer) {
        eventsContainer.innerHTML = '';
        incidentData.forEach(event => {
            const html = `
                <div class="event-item" onclick="showToast('Viewing event details for ${event.driver}')">
                    <div class="event-icon ${event.category}"><i data-feather="${event.icon}"></i></div>
                    <div class="event-details">
                        <div class="event-title-row">
                            <h4>${event.driver}</h4>
                            <span class="event-time">${event.time}</span>
                        </div>
                        <span class="badge-tag ${event.category}">${event.type}</span>
                        <div class="event-loc">${event.loc} &bull; <span class="status-${event.status}">${event.status}</span></div>
                    </div>
                </div>
            `;
            eventsContainer.insertAdjacentHTML('beforeend', html);
        });
        feather.replace();
    }

    // 6. Map Initialization (Overview Tab)
    const mapboxKey = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your actual Mapbox access token
    
    let dashboardMap;
    const mapElement = document.getElementById('fleet-map');
    if (mapElement) {
        dashboardMap = L.map('fleet-map', { zoomControl: false }).setView([28.6139, 77.2090], 11);
        L.control.zoom({ position: 'bottomright' }).addTo(dashboardMap);
        
        L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxKey}`, {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(dashboardMap);

        // Add markers
        incidentData.filter(d => d.coords).forEach(event => {
            const colorMap = { 'red': '#ef4444', 'blue': '#3b82f6', 'purple': '#8b5cf6' };
            const markerColor = colorMap[event.category];
            const svgIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color:${markerColor}; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
                iconSize: [16,16],
                iconAnchor: [8,8]
            });

            const marker = L.marker(event.coords, {icon: svgIcon}).addTo(dashboardMap);
            const popupContent = `
                <div class="popup-inner">
                    <div class="popup-title">${event.driver}</div>
                    <div class="popup-desc">${event.type}</div>
                    <div class="popup-status" style="background:${markerColor}20; color:${markerColor};">${event.status}</div>
                </div>
            `;
            marker.bindPopup(popupContent, { closeButton: false, offset: [0, -4] });
            
            // Interaction
            marker.on('mouseover', function() { this.openPopup(); });
            marker.on('mouseout', function() { this.closePopup(); });
            marker.on('click', () => { showToast(`Selected vehicle: ${event.driver}`); });
        });
    }

    // 7. Chart Initialization (Overview Tab)
    const ctx = document.getElementById('incidentChart');
    if (ctx) {
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'AI Detections',
                    data: [12, 19, 15, 25, 22, 10, 8],
                    borderColor: '#3b82f6',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#3b82f6',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', padding: 12, cornerRadius: 8, titleFont: {size: 13, family: 'Inter'}, bodyFont: {size: 12, family: 'Inter'}, displayColors: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f1f5f9', drawBorder: false }, ticks: { font: {family: 'Inter', size: 11}, color: '#94a3b8', stepSize: 10 } },
                    x: { grid: { display: false }, ticks: { font: {family: 'Inter', size: 11}, color: '#94a3b8' } }
                },
                interaction: { intersect: false, mode: 'index' },
            }
        });
    }


    // -------------------------------------------------------------------------
    // NEW TABS IMPLEMENTATION
    // -------------------------------------------------------------------------

    // 8. Alerts Data Table Rendering
    const extendedAlertsData = [
        ...incidentData,
        { id: '5', driver: 'Alex Chen', time: 'Mon 08:30', type: 'SPEEDING', category: 'purple', icon: 'zap', loc: 'India Gate', status: 'Resolved', coords: [28.6129, 77.2295] },
        { id: '6', driver: 'Sarah Lee', time: 'Sun 16:45', type: 'HARSH CORNER', category: 'blue', icon: 'corner-down-right', loc: 'Vasant Kunj', status: 'Logged', coords: [28.5298, 77.1633] },
        { id: '7', driver: 'Tom Hanks', time: 'Sun 10:10', type: 'TAILGATING', category: 'red', icon: 'alert-triangle', loc: 'NH-8 Subhash Chowk', status: 'Active', coords: [28.4282, 77.0326] }
    ];

    function renderAlertsTable() {
        const tableBody = document.getElementById('alerts-table-body');
        if(!tableBody) return;
        tableBody.innerHTML = '';
        
        extendedAlertsData.forEach(event => {
            const tr = document.createElement('tr');
            const initials = event.driver.split(' ').map(n=>n[0]).join('');
            tr.innerHTML = `
                <td>
                    <div class="table-driver-info">
                        <div class="table-avatar">${initials}</div>
                        <strong>${event.driver}</strong>
                    </div>
                </td>
                <td><span class="badge-tag ${event.category}" style="margin:0">${event.type}</span></td>
                <td>${event.loc}</td>
                <td>${event.time}</td>
                <td><span class="status-${event.status}">${event.status}</span></td>
                <td><button class="btn-secondary" style="padding: 6px 12px; font-size: 11px;" onclick="showToast('Viewing dashcam footage for ${event.driver}')">View Video</button></td>
            `;
            tableBody.appendChild(tr);
        });
    }
    renderAlertsTable();

    // 9. Second Full-Page Map Initialization
    let fullMap;
    function initFullMap() {
        if (fullMap) return;
        const fmElement = document.getElementById('full-page-map');
        if(!fmElement) return;

        fullMap = L.map('full-page-map', { zoomControl: false }).setView([28.6139, 77.2090], 12);
        L.control.zoom({ position: 'bottomright' }).addTo(fullMap);
        
        L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxKey}`, {
            maxZoom: 19,
            attribution: '&copy; Mapbox'
        }).addTo(fullMap);

        // Add markers
        extendedAlertsData.filter(d => d.coords).forEach(event => {
            const colorMap = { 'red': '#ef4444', 'blue': '#3b82f6', 'purple': '#8b5cf6' };
            const markerColor = colorMap[event.category] || '#3b82f6';
            const svgIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color:${markerColor}; width:18px; height:18px; border-radius:50%; border:3px solid #1e293b; box-shadow:0 0 10px ${markerColor}aa;"></div>`,
                iconSize: [18,18],
                iconAnchor: [9,9]
            });

            const marker = L.marker(event.coords, {icon: svgIcon}).addTo(fullMap);
            marker.bindPopup(`<b>${event.driver}</b><br>${event.type}`, { closeButton: false, offset: [0, -4] });
            
            marker.on('mouseover', function() { this.openPopup(); });
            marker.on('mouseout', function() { this.closePopup(); });
            marker.on('click', () => { showToast(`Selected vehicle: ${event.driver}`); });
        });
    }

    // 10. Analytics Charts Initialization
    function initAnalyticsCharts() {
        const typeCtx = document.getElementById('typeChart');
        if(typeCtx) {
            new Chart(typeCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Collisions', 'Harsh Braking', 'Rapid Accel', 'Speeding'],
                    datasets: [{
                        data: [15, 45, 25, 15],
                        backgroundColor: ['#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { padding: 20, font: {family: 'Inter', size:12}, color: '#475569' } }
                    },
                    cutout: '70%'
                }
            });
        }

        const driverCtx = document.getElementById('driverChart');
        if(driverCtx) {
            new Chart(driverCtx, {
                type: 'bar',
                data: {
                    labels: ['M. Thorne', 'E. Rodriguez', 'J. Wilson', 'S. Jenkins', 'A. Chen'],
                    datasets: [{
                        label: 'Total Violations',
                        data: [8, 3, 5, 2, 6],
                        backgroundColor: '#3b82f6',
                        borderRadius: 6,
                        barThickness: 24
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: {family: 'Inter'}, color: '#94a3b8' } },
                        x: { grid: { display: false }, ticks: { font: {family: 'Inter'}, color: '#64748b' } }
                    }
                }
            });
        }
    }
    // deferred initialization used by router
    // initAnalyticsCharts();
    // 11. Sidebar Toggle & Fixed Logic
    function setupSidebarToggle() {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('sidebar-toggle-btn');
        const pinBtn = document.getElementById('pin-sidebar-btn');
        
        if (!sidebar || !toggleBtn || !pinBtn) return;

        let isClosed = false;
        let isFloating = false;

        toggleBtn.addEventListener('click', () => {
            isClosed = !isClosed;
            if (isClosed) {
                sidebar.classList.add('closed');
            } else {
                sidebar.classList.remove('closed');
            }
            
            // Map invalidate size during/after CSS transition
            setTimeout(() => {
                if (typeof map !== 'undefined' && map) map.invalidateSize();
                if (typeof fullMap !== 'undefined' && fullMap) fullMap.invalidateSize();
            }, 350);
        });

        pinBtn.addEventListener('click', () => {
            isFloating = !isFloating;
            const iconElement = pinBtn.querySelector('i');
            
            if (isFloating) {
                sidebar.classList.add('floating');
                if(iconElement) iconElement.setAttribute('data-feather', 'unlock');
                if (window.showToast) window.showToast('Sidebar unpinned (Floating Mode)');
            } else {
                sidebar.classList.remove('floating');
                if(iconElement) iconElement.setAttribute('data-feather', 'lock');
                if (window.showToast) window.showToast('Sidebar pinned (Layout Mode)');
            }
            if(window.feather) feather.replace();
            
            setTimeout(() => {
                if (typeof map !== 'undefined' && map) map.invalidateSize();
                if (typeof fullMap !== 'undefined' && fullMap) fullMap.invalidateSize();
            }, 350);
        });
    }
    setupSidebarToggle();

    // 12. Settings Tab Logic
    function setupSettingsTabs() {
        const settingsNavItems = document.querySelectorAll('.settings-nav-item');
        const settingsPanels = document.querySelectorAll('.settings-panel');

        settingsNavItems.forEach(item => {
            item.addEventListener('click', () => {
                settingsNavItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                const targetId = item.getAttribute('data-settings-target');
                settingsPanels.forEach(panel => {
                    if (panel.id === targetId) {
                        panel.classList.remove('hidden');
                        panel.classList.add('active-panel');
                    } else {
                        panel.classList.add('hidden');
                        panel.classList.remove('active-panel');
                    }
                });
            });
        });
    }
    setupSettingsTabs();

    // 13. Safety Center Logic
    const safetyScores = [
        { driver: 'Marcus Thorne', score: 68, trend: '-5', status: 'Critical', avatar: 'M' },
        { driver: 'Sara Jenkins', score: 72, trend: '-2', status: 'Warning', avatar: 'S' },
        { driver: 'Alex Chen', score: 98, trend: '+2', status: 'Excellent', avatar: 'A' },
        { driver: 'Elena Rodriguez', score: 95, trend: '+4', status: 'Excellent', avatar: 'E' },
        { driver: 'James Wilson', score: 92, trend: '+1', status: 'Good', avatar: 'J' },
    ];

    function renderSafetyCenter() {
        const coachingContainer = document.getElementById('coaching-list');
        const leaderContainer = document.getElementById('leaderboard-list');
        if (!coachingContainer || !leaderContainer) return;

        coachingContainer.innerHTML = '';
        safetyScores.filter(d => d.score < 80).forEach(driver => {
            const barColor = driver.score < 70 ? '#ef4444' : '#f59e0b';
            const html = `
                <div style="display:flex; justify-content:space-between; align-items:center; padding: 12px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="display:flex; align-items:center; gap:12px; flex-grow:1;">
                        <div class="table-avatar" style="background:#fff; border:1px solid #e2e8f0; width:36px; height:36px;">${driver.avatar}</div>
                        <div style="flex-grow:1; max-width:200px;">
                            <div style="font-size:13px; font-weight:600; color:#0f172a; margin-bottom:4px;">${driver.driver}</div>
                            <div style="width:100%; height:6px; background:#e2e8f0; border-radius:10px; overflow:hidden;">
                                <div style="width:${driver.score}%; height:100%; background:${barColor}; animation: progressSlide 1s ease-out forwards;"></div>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
                        <span style="font-weight:700; font-size:16px; color:${barColor};">${driver.score}</span>
                        <button class="btn-primary" style="padding:4px 10px; font-size:11px;" onclick="showToast('Initiating coaching workflow for ${driver.driver}')">Coach</button>
                    </div>
                </div>
            `;
            coachingContainer.insertAdjacentHTML('beforeend', html);
        });

        leaderContainer.innerHTML = '';
        safetyScores.filter(d => d.score >= 90).sort((a,b) => b.score - a.score).forEach((driver, idx) => {
            const html = `
                <div style="display:flex; align-items:center; gap:16px; padding: 12px; background:white; border-radius:12px; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow='none'">
                    <div style="font-size:16px; font-weight:700; color:#94a3b8; width:20px;">#${idx+1}</div>
                    <div class="table-avatar" style="background:#eff6ff; color:#3b82f6;">${driver.avatar}</div>
                    <div style="flex-grow:1;">
                        <div style="font-size:13px; font-weight:600; color:#0f172a;">${driver.driver}</div>
                        <div style="font-size:11px; color:#10b981; font-weight:600;"><i data-feather="trending-up" style="width:12px; height:12px;"></i> ${driver.trend} this week</div>
                    </div>
                    <div style="font-size:16px; font-weight:700; color:#3b82f6;">${driver.score}</div>
                </div>
            `;
            leaderContainer.insertAdjacentHTML('beforeend', html);
        });
        if(window.feather) feather.replace();
    }

    // 14. Profile Dropdown Logic
    const profileBtn = document.getElementById('user-profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
            const notifDropdown = document.getElementById('notification-dropdown');
            if(notifDropdown) notifDropdown.classList.remove('show');
        });
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // 15. Notification Dropdown Logic
    const notifBtn = document.getElementById('notification-btn');
    const notifDropdown = document.getElementById('notification-dropdown');
    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('show');
            if(profileDropdown) profileDropdown.classList.remove('show');
        });
        document.addEventListener('click', (e) => {
            if (!notifBtn.contains(e.target)) {
                notifDropdown.classList.remove('show');
            }
        });
    }
});

// Global Authentication Logic
window.handleLogout = function() {
    localStorage.removeItem('isLoggedIn');
    window.location.replace('login.html');
};

// Toast System
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-feather="check-circle"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Replace icon
    if(window.feather) { feather.replace(); }
    
    // Trigger animation
    setTimeout(() => { toast.classList.add('show'); }, 10);
    
    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.remove(); }, 400);
    }, 3000);
}

// Make showToast accessible globally
window.showToast = showToast;
