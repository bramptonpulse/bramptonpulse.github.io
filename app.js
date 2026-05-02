document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. TRANSLATOR (Shared Logic)
    // ==========================================
    const translations = {
        en: {
            navHome: "Patient Portal",
            navAdmin: "Admin Dashboard",
            navSim: "Simulation Engine",
            btnExit: "Exit Portal",
            btnLogout: "Logout",
            btnSimulate: "⚠ Simulate Condition X Surge",
            btnReset: "↺ Reset Simulation",
            titlePulse: "Brampton Pulse",
            titleSpecs: "System Specifications",
            titleSim: "Simulation Module",
            cardSIR: "SIR Model - Brampton",
            cardStats: "Ward Statistics",
            cardTiers: "Auto Response Tiers",
            cardParams: "Simulation Parameters",
            metricActive: "Active Reports",
            metricSurge: "Wards in Surge",
            metricER: "ER Forecast",
            metricLead: "Lead Warning Time"
        },
        fr: {
            navHome: "Portail Patient",
            navAdmin: "Tableau de Bord",
            navSim: "Moteur de Simulation",
            btnExit: "Quitter le Portail",
            btnLogout: "Déconnexion",
            btnSimulate: "⚠ Simuler la Vague",
            btnReset: "↺ Réinitialiser",
            titlePulse: "Brampton Pulse",
            titleSpecs: "Spécifications du Système",
            titleSim: "Module de Simulation",
            cardSIR: "Modèle SIR - Brampton",
            cardStats: "Statistiques de Quartier",
            cardTiers: "Paliers de Réponse",
            cardParams: "Paramètres de Simulation",
            metricActive: "Rapports Actifs",
            metricSurge: "Zones en Alerte",
            metricER: "Prévisions Urgences",
            metricLead: "Délai d'Alerte"
        },
        pa: {
            navHome: "ਪੇਸ਼ੈਂਟ ਪੋਰਟਲ",
            navAdmin: "ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ",
            navSim: "ਸਿਮੂਲੇਸ਼ਨ ਇੰਜਣ",
            btnExit: "ਬਾਹਰ ਜਾਓ",
            btnLogout: "ਲਾਗ ਆਉਟ",
            btnSimulate: "⚠ ਸਿਮੂਲੇਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ",
            btnReset: "↺ ਰੀਸੈਟ ਕਰੋ",
            titlePulse: "ਬ੍ਰੈਂਪਟਨ ਪਲਸ",
            titleSpecs: "ਸਿਸਟਮ ਨਿਰਧਾਰਨ",
            titleSim: "ਸਿਮੂਲੇਸ਼ਨ ਮੋਡੀਊਲ",
            cardSIR: "SIR ਮਾਡਲ",
            cardStats: "ਵਾਰਡ ਦੇ ਅੰਕੜੇ",
            cardTiers: "ਰਿਸਪਾਂਸ ਪੱਧਰ",
            cardParams: "ਸਿਮੂਲੇਸ਼ਨ ਪੈਰਾਮੀਟਰ",
            metricActive: "ਸਰਗਰਮ ਰਿਪੋਰਟਾਂ",
            metricSurge: "ਹਾਈ ਰਿਸਕ ਵਾਰਡ",
            metricER: "ER ਭਵਿੱਖਬਾਣੀ",
            metricLead: "ਚੇਤਾਵਨੀ ਸਮਾਂ"
        },
        hi: {
            navHome: "पेशेंट पोर्टल",
            navAdmin: "एडमिन डैशबोर्ड",
            navSim: "सिमुलेशन इंजन",
            btnExit: "बाहर निकलें",
            btnLogout: "लॉग आउट",
            btnSimulate: "⚠ सिमुलेशन शुरू करें",
            btnReset: "↺ रीसेट करें",
            titlePulse: "ब्रैम्पटन पल्स",
            titleSpecs: "सिस्टम विनिर्देश",
            titleSim: "सिमुलेशन मॉड्यूल",
            cardSIR: "SIR मॉडल",
            cardStats: "वार्ड आँकड़े",
            cardTiers: "प्रतिक्रिया स्तर",
            cardParams: "सिमुलेशन पैरामीटर",
            metricActive: "सक्रिय रिपोर्ट",
            metricSurge: "हाई रिस्क वार्ड",
            metricER: "ER पूर्वानुमान",
            metricLead: "चेतावनी समय"
        }
    };

    function applyLanguage(langCode) {
        const dict = translations[langCode];
        if (dict) {
            document.querySelectorAll("[data-i18n]").forEach(el => {
                const key = el.getAttribute("data-i18n");
                if (dict[key]) el.innerText = dict[key];
            });
            localStorage.setItem("pulseLang", langCode);
        }
    }


    const langSelect = document.getElementById("language-select");
    if (langSelect) {
        const savedLang = localStorage.getItem("pulseLang") || "en";
        langSelect.value = savedLang;
        applyLanguage(savedLang);
        langSelect.addEventListener("change", (e) => applyLanguage(e.target.value));
    }

    // Header Time
    const timeSpan = document.getElementById("header-time");
    if (timeSpan) {
        const tick = () => { timeSpan.innerText = new Date().toLocaleTimeString(); };
        tick(); setInterval(tick, 1000);
    }

    // ==========================================
    // 2. SIMULATION ENGINE LOGIC
    // ==========================================
    const WARD_DEFAULTS = {
        castlemore:   { pop: 55100, beds: 55,  name: "Castlemore",        score: 31, reports: 58, today: 5 },
        northpark:    { pop: 60400, beds: 60,  name: "North Park",        score: 14, reports: 21, today: 0 },
        bramalea:     { pop: 85300, beds: 286, name: "Bramalea",          score: 22, reports: 43, today: 1 },
        springdale:   { pop: 75800, beds: 75,  name: "Springdale",        score: 25, reports: 53, today: 3 },
        downtown:     { pop: 70200, beds: 385, name: "Downtown Brampton", score: 19, reports: 35, today: 2 },
        fletchers:    { pop: 65600, beds: 65,  name: "Fletcher's Creek",  score: 19, reports: 38, today: 1 },
        heartlake:    { pop: 50200, beds: 50,  name: "Heart Lake",        score: 12, reports: 19, today: -1 },
        bramptonwest: { pop: 55400, beds: 55,  name: "Brampton West",     score: 19, reports: 31, today: 2 },
        bramptoneast: { pop: 62000, beds: 60,  name: "Brampton East",     score: 15, reports: 24, today: 1 },
        goremeadows:  { pop: 58000, beds: 55,  name: "Gore Meadows",      score: 18, reports: 28, today: 0 }
    };

    const SCENARIOS = {
        mild:     { r0: 1.3, infPeriod: 7,  ifr: 0.001 },
        moderate: { r0: 2.5, infPeriod: 10, ifr: 0.005 },
        severe:   { r0: 4.0, infPeriod: 12, ifr: 0.012 },
        covid:    { r0: 2.9, infPeriod: 10, ifr: 0.009 }
    };

    const OVERFLOW_MULT = 3.5;
    const MOBILITY = 0.008;

    let currentScenario = "moderate";
    let day = 0;
    let simInterval = null;
    let wards = {};

    function buildWards() {
        const w = {};
        Object.keys(WARD_DEFAULTS).forEach(k => {
            const d = WARD_DEFAULTS[k];
            w[k] = { 
                pop: d.pop, 
                s: d.pop - (k === "springdale" ? 10 : 0),
                i: k === "springdale" ? 10 : 0, 
                r: 0, 
                d: 0,
                beds: d.beds, 
                name: d.name, 
                score: d.score,
                reports: d.reports,
                today: d.today
            };
        });
        return w;
    }

    wards = buildWards();

    // Dynamically inject ward items into simulation.html
    const wardListContainer = document.getElementById("ward-list-container");
    const mapGridContainer = document.querySelector(".map-grid");

    if (wardListContainer) {
        wardListContainer.innerHTML = "";
        Object.keys(WARD_DEFAULTS).forEach(key => {
            const d = WARD_DEFAULTS[key];
            const div = document.createElement("div");
            div.className = "ward-item";
            div.setAttribute("data-ward", key);
            div.innerHTML = `
                <div class="ward-info">
                    <div class="name">${d.name}</div>
                    <div class="stats">${d.reports} reports · ${d.today >= 0 ? '+' : ''}${d.today} today</div>
                </div>
                <div class="ward-val" id="score-${key}">${d.score}</div>
            `;
            wardListContainer.appendChild(div);
        });
    }

    if (mapGridContainer) {
        mapGridContainer.innerHTML = "";
        Object.keys(WARD_DEFAULTS).forEach(key => {
            const d = WARD_DEFAULTS[key];
            const div = document.createElement("div");
            div.className = "map-block";
            div.id = `block-${key}`;
            div.setAttribute("data-ward", key);
            div.innerHTML = `
                <span>${d.name}</span>
                <strong id="mb-${key}">${d.score}</strong>
            `;
            mapGridContainer.appendChild(div);
        });
    }


    function updateUI() {
        const g = id => document.getElementById(id);
        let totalI = 0, totalR = 0, totalD = 0, totalPop = 0;
        let highRiskCount = 0;
        let hotspot = "None", maxRate = 0;

        const wardRiskBody = g("ward-risk-body");
        if (wardRiskBody) wardRiskBody.innerHTML = "";

        Object.keys(wards).forEach(key => {
            const w = wards[key];
            totalI += w.i; totalR += w.r; totalD += w.d; totalPop += w.pop;
            
            const rate = w.i / w.pop;
            if (rate > maxRate) { maxRate = rate; if (w.i > 1) hotspot = w.name; }

            const score = Math.min(100, Math.floor(w.score + rate * 500));
            if (score > 70) highRiskCount++;

            // Update Map Block
            const mb = g("mb-" + key);
            if (mb) mb.innerText = score;
            const block = g("block-" + key);
            if (block) {
                block.style.backgroundColor = score < 40 ? "var(--bg-main)" : score < 70 ? "var(--warning-bg)" : "var(--danger-bg)";
                block.style.borderColor = score < 40 ? "var(--border)" : score < 70 ? "var(--warning)" : "var(--danger)";
            }

            // Update Left Sidebar Score
            const ls = g("score-" + key);
            if (ls) {
                ls.innerText = score;
                ls.style.color = score < 40 ? "var(--success)" : score < 70 ? "var(--warning)" : "var(--danger)";
            }

            // Populate Admin Risk Table
            if (wardRiskBody) {
                const tier = score < 40 ? "Green" : score < 70 ? "Yellow" : "Red";
                const tierColor = score < 40 ? "var(--success)" : score < 70 ? "var(--warning)" : "var(--danger)";
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${w.name}</td>
                    <td style="color:${tierColor}; font-weight:700;">${tier}</td>
                    <td>${Math.floor(rate * 100000)}</td>
                `;
                wardRiskBody.appendChild(tr);
            }
        });

        // SIR Bars
        const pS = (totalPop - totalI - totalR - totalD) / totalPop * 100;
        const pI = totalI / totalPop * 100;
        const pR = totalR / totalPop * 100;

        if (g("bar-s")) g("bar-s").style.width = pS + "%";
        if (g("lbl-s")) g("lbl-s").innerText = pS.toFixed(1) + "%";
        if (g("bar-i")) g("bar-i").style.width = pI + "%";
        if (g("lbl-i")) g("lbl-i").innerText = pI.toFixed(1) + "%";
        if (g("bar-r")) g("bar-r").style.width = pR + "%";
        if (g("lbl-r")) g("lbl-r").innerText = pR.toFixed(1) + "%";

        // City Pulse
        const pulse = Math.min(100, Math.floor(pI * 3 + (highRiskCount / Object.keys(wards).length) * 60));
        const pulseEl = g("city-pulse-score");
        if (pulseEl) pulseEl.innerText = pulse;
        const pulseText = g("city-pulse-text");
        if (pulseText) {
            pulseText.innerText = pulse < 40 ? "All clear" : pulse < 70 ? "Elevated" : "SURGE";
            pulseText.style.color = pulse < 40 ? "var(--success)" : pulse < 70 ? "var(--warning)" : "var(--danger)";
        }
        const circle = g("pulse-circle-element");
        if (circle) circle.style.borderColor = pulse < 40 ? "var(--success-bg)" : pulse < 70 ? "var(--warning-bg)" : "var(--danger-bg)";

        // Bottom Metrics
        if (g("total-cases-center")) g("total-cases-center").innerText = Math.floor(totalI).toLocaleString();
        if (g("ov-risk-wards")) g("ov-risk-wards").innerText = highRiskCount;

        // Admin Overview Cards
        if (g("ov-active-cases")) g("ov-active-cases").innerText = Math.floor(totalI).toLocaleString();
        if (g("ov-deceased")) g("ov-deceased").innerText = Math.floor(totalD).toLocaleString();

        // Status Banner
        const banner = g("status-banner");
        if (banner) {
            if (pulse < 40) {
                banner.innerText = "● All Brampton wards within normal parameters. No surge detected.";
                banner.style.background = "var(--success-bg)";
                banner.style.color = "var(--success)";
                banner.style.borderColor = "var(--success)";
            } else if (pulse < 70) {
                banner.innerText = "● ELEVATED RISK: Monitoring spread in " + hotspot + ". Activating Tier 2.";
                banner.style.background = "var(--warning-bg)";
                banner.style.color = "var(--warning)";
                banner.style.borderColor = "var(--warning)";
            } else {
                banner.innerText = "● SURGE DETECTED: Condition X spreading in " + highRiskCount + " wards. Activate Emergency Protocols.";
                banner.style.background = "var(--danger-bg)";
                banner.style.color = "var(--danger)";
                banner.style.borderColor = "var(--danger)";
            }
        }


        // Tiers
        const tG = g("tier-green"), tY = g("tier-yellow"), tR = g("tier-red");
        if (tG) { tG.classList.toggle("active", pulse < 40); }
        if (tY) { tY.classList.toggle("active", pulse >= 40 && pulse < 70); }
        if (tR) { tR.classList.toggle("active", pulse >= 70); }

        // Params
        if (g("param-status")) {
            g("param-status").innerText = pulse < 40 ? "Monitoring" : pulse < 70 ? "Elevated" : "Surge";
            g("param-status").style.color = pulse < 40 ? "var(--success)" : pulse < 70 ? "var(--warning)" : "var(--danger)";
        }
        if (g("param-hotspot")) g("param-hotspot").innerText = hotspot;
        if (g("param-r0")) g("param-r0").innerText = SCENARIOS[currentScenario].r0;
    }

    function step() {
        day++;
        const sc = SCENARIOS[currentScenario];
        const beta = sc.r0 / sc.infPeriod, gamma = 1 / sc.infPeriod, mu = sc.ifr / sc.infPeriod;
        const next = {};

        Object.keys(wards).forEach(k => {
            const w = wards[k];
            const mult = 1 - (w.mobilityReduction || 0);
            const newInf = beta * w.i * (w.s / w.pop) * mult;
            const newRec = gamma * w.i;
            const newDead = mu * w.i;
            next[k] = {
                s: Math.max(0, w.s - newInf),
                i: Math.max(0, w.i + newInf - newRec - newDead),
                r: w.r + newRec,
                d: w.d + newDead
            };
        });

        // Inter-ward mobility spread
        const keys = Object.keys(wards);
        for(let i=0; i<keys.length; i++) {
            for(let j=i+1; j<keys.length; j++) {
                const k1 = keys[i], k2 = keys[j];
                const m1 = 1 - (wards[k1].mobilityReduction || 0);
                const m2 = 1 - (wards[k2].mobilityReduction || 0);
                const cross = beta * MOBILITY * next[k1].i * (next[k2].s / wards[k2].pop) * m1 * m2;
                if (next[k2].s > cross) { next[k2].s -= cross; next[k2].i += cross; }
            }
        }

        Object.keys(wards).forEach(k => {
            wards[k].s = next[k].s; wards[k].i = next[k].i; wards[k].r = next[k].r; wards[k].d = next[k].d;
        });
        updateUI();
    }


    const btnStart = document.getElementById("btn-simulate");
    if (btnStart) {
        btnStart.addEventListener("click", () => {
            if (simInterval) {
                clearInterval(simInterval); simInterval = null;
                btnStart.innerText = "▶ Resume Simulation";
            } else {
                simInterval = setInterval(step, 200);
                btnStart.innerText = "⏸ Pause Simulation";
            }
        });
    }

    const btnReset = document.getElementById("btn-reset");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            clearInterval(simInterval); simInterval = null;
            day = 0; wards = buildWards();
            if (btnStart) btnStart.innerText = "⚠ Simulate Condition X Surge";
            updateUI();
        });
    }

    let activeWardKey = null;

    // Ward Selection Details
    document.addEventListener("click", (e) => {
        const item = e.target.closest("[data-ward]");
        if (item) {
            const k = item.getAttribute("data-ward");
            const w = wards[k];
            if (!w) return;
            
            activeWardKey = k;
            document.querySelectorAll(".ward-item, .map-block").forEach(x => x.classList.remove("selected"));
            document.querySelectorAll(`[data-ward="${k}"]`).forEach(x => x.classList.add("selected"));

            const modal = document.getElementById("region-detail-card");
            if (modal) {
                document.getElementById("detail-region-name").innerText = w.name;
                document.getElementById("det-pop").innerText = w.pop.toLocaleString();
                document.getElementById("det-i").innerText = Math.floor(w.i).toLocaleString();
                document.getElementById("det-r").innerText = Math.floor(w.r).toLocaleString();
                document.getElementById("det-d").innerText = Math.floor(w.d).toLocaleString();
                document.getElementById("det-score").innerText = Math.min(100, Math.floor(w.score + (w.i/w.pop)*500));
                
                // Populate inputs
                const inputInitI = document.getElementById("input-init-i");
                if (inputInitI) inputInitI.value = Math.floor(w.i);
                
                const inputMobility = document.getElementById("input-mobility");
                if (inputMobility) {
                    const val = (w.mobilityReduction || 0) * 100;
                    inputMobility.value = val;
                    document.getElementById("label-mobility").innerText = val + "%";
                }
                
                modal.style.display = "block";
            }
        }
    });

    // Modal Events
    const btnSaveWard = document.getElementById("btn-save-ward");
    if (btnSaveWard) {
        btnSaveWard.addEventListener("click", () => {
            if (!activeWardKey) return;
            const w = wards[activeWardKey];
            
            const newI = parseFloat(document.getElementById("input-init-i").value) || 0;
            const newMob = parseFloat(document.getElementById("input-mobility").value) / 100 || 0;
            
            w.i = newI;
            w.s = w.pop - w.i - w.r - w.d;
            w.mobilityReduction = newMob;
            
            document.getElementById("region-detail-card").style.display = "none";
            updateUI();
        });
    }

    const inputMobilityRange = document.getElementById("input-mobility");
    if (inputMobilityRange) {
        inputMobilityRange.addEventListener("input", (e) => {
            document.getElementById("label-mobility").innerText = e.target.value + "%";
        });
    }

    const btnCloseModal = document.getElementById("btn-close-modal");
    if (btnCloseModal) {
        btnCloseModal.addEventListener("click", () => {
            document.getElementById("region-detail-card").style.display = "none";
        });
    }

    // ==========================================
    // 3. LEAFLET MAP (Patient View)
    // ==========================================
    const mapContainer = document.getElementById("brampton-map");
    if (mapContainer && typeof L !== 'undefined') {
        const map = L.map('brampton-map').setView([43.7315, -79.7624], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const facilities = [
            { name: "Brampton Civic Hospital", lat: 43.7432, lng: -79.7198, type: "Hospital" },
            { name: "Peel Memorial Centre", lat: 43.6845, lng: -79.7547, type: "Urgent Care" },
            { name: "Main St. BML Clinic", lat: 43.6880, lng: -79.7600, type: "BML" },
            { name: "Bovaird BML Clinic", lat: 43.7300, lng: -79.7800, type: "BML" },
            { name: "Springdale BML Clinic", lat: 43.7550, lng: -79.7400, type: "BML" },
            { name: "Castlemore BML Clinic", lat: 43.7800, lng: -79.7000, type: "BML" },
            { name: "North Park BML Clinic", lat: 43.7500, lng: -79.7600, type: "BML" },
            { name: "Bramalea BML Clinic", lat: 43.7200, lng: -79.7200, type: "BML" }
        ];

        facilities.forEach(f => {
            const color = f.type === "Hospital" ? "#ef4444" : "#10b981";
            const marker = L.circleMarker([f.lat, f.lng], {
                radius: 8,
                fillColor: color,
                color: "#fff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);
            marker.bindPopup(`<b>${f.name}</b><br>${f.type}`);
        });
    }

    // ==========================================
    // 4. BML TABLE (Admin View)
    // ==========================================
    const bmlTableBody = document.getElementById("bml-table-body");
    if (bmlTableBody) {
        const clinics = [
            { loc: "Main St. BML", wait: "45m", vac: 23 },
            { loc: "Bovaird BML", wait: "1h 10m", vac: 8 },
            { loc: "Springdale BML", wait: "30m", vac: 31 },
            { loc: "Dixie Medical", wait: "CLOSED", vac: 0 },
            { loc: "Castlemore BML", wait: "15m", vac: 42 },
            { loc: "North Park BML", wait: "20m", vac: 18 },
            { loc: "Bramalea BML", wait: "50m", vac: 12 }
        ];
        clinics.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${c.loc}</td>
                <td style="color:${c.wait === 'CLOSED' ? 'var(--danger)' : 'var(--text-main)'}">${c.wait}</td>
                <td style="font-weight:700;">${c.vac}</td>
            `;
            bmlTableBody.appendChild(tr);
        });
    }


    updateUI();
});
