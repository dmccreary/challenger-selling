// ROI Calculator - compute the ROI of a story library and test its assumptions
// CANVAS_HEIGHT: 740
// Learners total the investment and return, compute ROI, and check their
// work. A what-if panel then shows how attribution confidence, counting
// margin instead of revenue, and the hurdle rate change the conclusion.

const APP_HEIGHT = 740;
const COSTS = [['Personnel time', 30000], ['Software licenses', 15000], ['External services', 5000]];
const BENEFITS = [['Story-attributed revenue', 200000], ['Efficiency savings (shorter sales cycle)', 30000]];
const INVEST = COSTS.reduce((s, c) => s + c[1], 0);
const RETURN = BENEFITS.reduce((s, b) => s + b[1], 0);
const ROI = (RETURN - INVEST) / INVEST * 100;

const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
const num = s => parseFloat(String(s).replace(/[$,%\s]/g, ''));

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    let attempts = 0;

    app.innerHTML = `
        <h2>ROI Calculator</h2>
        <p class="subtitle">Calculate the ROI of a story library initiative, then test the assumptions behind it.</p>
        <div class="context"><strong>Scenario:</strong> Your company invested $50,000 in a story library initiative. In the first year, story-attributed revenue increased by $200,000, and a shorter sales cycle saved $30,000 in time costs.</div>
        <div class="two-col">
            <div class="card">
                <h3>Step 1: Investment costs</h3>
                <table class="summary">${COSTS.map(c => `<tr><td>${c[0]}</td><td style="text-align:right;">${fmt(c[1])}</td></tr>`).join('')}
                    <tr><td><strong>Total investment</strong></td><td style="text-align:right;"><input type="text" id="inv" placeholder="$" style="width:110px;text-align:right;"></td></tr></table>
            </div>
            <div class="card">
                <h3>Step 2: Return benefits</h3>
                <table class="summary">${BENEFITS.map(b => `<tr><td>${b[0]}</td><td style="text-align:right;">${fmt(b[1])}</td></tr>`).join('')}
                    <tr><td><strong>Total return</strong></td><td style="text-align:right;"><input type="text" id="ret" placeholder="$" style="width:110px;text-align:right;"></td></tr></table>
            </div>
        </div>
        <div class="card">
            <h3>Step 3: Calculate ROI</h3>
            <p style="margin:0 0 6px 0;font-size:0.92em;"><strong>ROI = (Total return &minus; Total investment) &divide; Total investment &times; 100</strong></p>
            <label for="roi" style="font-weight:bold;font-size:0.9em;">ROI (%)</label>
            <input type="text" id="roi" placeholder="%" style="width:110px;margin-left:6px;">
        </div>
        <div class="btn-row"><button id="check" disabled>Check My Calculation</button></div>
        <div id="feedback"></div>
        <div id="whatif"></div>
    `;

    const inv = app.querySelector('#inv'), ret = app.querySelector('#ret'), roi = app.querySelector('#roi');
    const check = app.querySelector('#check');
    [inv, ret, roi].forEach(i => i.addEventListener('input', () => { check.disabled = ![inv, ret, roi].every(x => !isNaN(num(x.value))); }));

    check.addEventListener('click', () => {
        attempts++;
        const vi = num(inv.value), vr = num(ret.value), vo = num(roi.value);
        const okI = Math.abs(vi - INVEST) < 1, okR = Math.abs(vr - RETURN) < 1, okO = Math.abs(vo - ROI) <= 1;
        const fb = app.querySelector('#feedback');
        const line = (ok, label, mine, want, hint) => `<div>${ok ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>'} <strong>${label}:</strong> ${mine}${ok ? '' : ` &mdash; ${hint}`}</div>`;
        let html = line(okI, 'Total investment', fmt(vi), fmt(INVEST), 'add all three cost lines.') +
            line(okR, 'Total return', fmt(vr), fmt(RETURN), 'include the efficiency savings as well as revenue; ROI counts all benefits.') +
            line(okO, 'ROI', vo + '%', ROI + '%', okI && okR ? 'subtract the investment from the return before dividing (net gain &divide; investment).' : 'fix the totals first, then subtract and divide.');
        if (okI && okR && okO) {
            fb.innerHTML = `<div class="feedback ok">${html}<br><strong>Correct${attempts === 1 ? ' on the first try' : ''}.</strong> Your ROI calculation: (${fmt(RETURN)} &minus; ${fmt(INVEST)}) &divide; ${fmt(INVEST)} = ${fmt(RETURN - INVEST)} &divide; ${fmt(INVEST)} = <strong>${ROI}%</strong>. A 360% ROI indicates a strong return. But how solid are the assumptions behind it?</div>`;
            if (!app.querySelector('#attr')) renderWhatIf();
        } else {
            fb.innerHTML = `<div class="feedback bad">${html}${attempts >= 2 ? `<br><em>Worked answer: (${fmt(RETURN)} &minus; ${fmt(INVEST)}) &divide; ${fmt(INVEST)} &times; 100 = ${ROI}%.</em>` : '<br><em>Fix the flagged values and check again.</em>'}</div>`;
        }
    });

    function renderWhatIf() {
        const w = app.querySelector('#whatif');
        w.innerHTML = `
            <div class="card">
                <h3>Step 4: Test the assumptions</h3>
                <div class="field-row">
                    <div class="field">
                        <label for="attr">How much of the $200K was really caused by stories? <span id="attr-v">100%</span></label>
                        <input type="range" id="attr" min="25" max="100" step="5" value="100">
                    </div>
                    <div class="field">
                        <label for="hurdle">Your organization's hurdle rate</label>
                        <select id="hurdle"><option value="15">15% (typical cost of capital)</option><option value="50">50% (competing priorities)</option><option value="100" selected>100% (strategic initiatives must double)</option><option value="300">300% (very selective)</option></select>
                    </div>
                </div>
                <div class="checklist"><label><input type="checkbox" id="margin"> Count gross margin (40%) on the revenue instead of the full revenue</label></div>
                <div id="calc"></div>
            </div>
            <div class="feedback warn"><strong>Remember:</strong> ROI includes every cost and benefit, not just revenue, and it is built on estimates. Show your assumptions, test how sensitive the result is to them, and compare the result to your organization's hurdle rate: a positive ROI is not automatically a good one.</div>`;
        ['attr', 'hurdle', 'margin'].forEach(id => w.querySelector('#' + id).addEventListener('input', recalc));
        recalc();
        app.scrollTop = w.offsetTop - 8;
    }

    function recalc() {
        const attr = +app.querySelector('#attr').value / 100;
        const hurdle = +app.querySelector('#hurdle').value;
        const margin = app.querySelector('#margin').checked ? 0.4 : 1;
        app.querySelector('#attr-v').textContent = Math.round(attr * 100) + '%';
        const rev = BENEFITS[0][1] * attr * margin;
        const total = rev + BENEFITS[1][1];
        const r = (total - INVEST) / INVEST * 100;
        const verdict = r > hurdle + 5 ? ['exceeds', 'ok'] : r >= hurdle - 5 ? ['roughly meets', 'warn'] : ['fails', 'bad'];
        const scale = Math.max(400, r, hurdle) * 1.05;
        const bar = (label, val, color) => `<div style="display:flex;align-items:center;gap:6px;margin:3px 0;font-size:0.88em;"><span style="width:90px;">${label}</span><div style="flex:1;background:#eceff1;border-radius:4px;height:16px;position:relative;"><div style="width:${Math.max(0, val) / scale * 100}%;background:${color};height:100%;border-radius:4px;"></div></div><span style="width:52px;text-align:right;">${Math.round(val)}%</span></div>`;
        app.querySelector('#calc').innerHTML = `
            <p style="margin:6px 0;font-size:0.92em;">Return = ${fmt(BENEFITS[0][1])} &times; ${Math.round(attr * 100)}% attributed${margin < 1 ? ' &times; 40% margin' : ''} + ${fmt(BENEFITS[1][1])} savings = <strong>${fmt(total)}</strong></p>
            ${bar('Your ROI', r, r >= hurdle ? '#2e7d32' : '#c62828')}${bar('Hurdle rate', hurdle, '#78909c')}
            <div class="feedback ${verdict[1]}" style="margin:6px 0 0 0;">ROI = (${fmt(total)} &minus; ${fmt(INVEST)}) &divide; ${fmt(INVEST)} = <strong>${Math.round(r)}%</strong>. This <strong>${verdict[0]}</strong> a ${hurdle}% hurdle rate.
            ${attr < 1 || margin < 1 ? '' : ' Try lowering attribution or counting margin to see how quickly the headline number shrinks.'}</div>`;
    }
});
