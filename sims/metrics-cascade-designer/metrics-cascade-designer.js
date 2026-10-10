// Metrics Cascade Designer - link a business objective to storytelling objectives and KPIs
// CANVAS_HEIGHT: 760
// Learners choose 2-3 storytelling objectives that drive a revenue goal and
// 1-2 KPIs for each. The cascade is drawn as a three-tier diagram, with
// misaligned or vanity KPIs flagged.

const APP_HEIGHT = 760;
const SVG_NS = 'http://www.w3.org/2000/svg';

const OBJECTIVES = {
    'Increase conversion rate': {
        kpis: ['Story conversion lift', 'Story adoption rate', 'Average deal size', 'Library page views'],
        good: ['Story conversion lift'],
        info: {
            'Story conversion lift': 'measures how much more often opportunities advance when the story is used',
            'Story adoption rate': 'is a useful activity metric, but it measures usage, not conversion',
            'Average deal size': 'belongs to the deal size objective, not conversion',
            'Library page views': 'is a vanity metric: views do not show that anything converted'
        }
    },
    'Increase deal size': {
        kpis: ['Story-attributed revenue', 'Average deal size', 'Story adoption rate', 'Win rate'],
        good: ['Story-attributed revenue', 'Average deal size'],
        info: {
            'Story-attributed revenue': 'ties revenue directly to deals where stories were used',
            'Average deal size': 'is the direct measure of this objective',
            'Story adoption rate': 'measures usage, not deal size',
            'Win rate': 'belongs to the win rate objective'
        }
    },
    'Improve win rate': {
        kpis: ['Win rate on story-led deals', 'Number of stories published', 'Story conversion lift', 'Slide downloads'],
        good: ['Win rate on story-led deals'],
        info: {
            'Win rate on story-led deals': 'compares wins in deals where stories were used against deals where they were not',
            'Number of stories published': 'is an output metric: more stories do not mean more wins',
            'Story conversion lift': 'tracks stage-to-stage movement, which belongs to the conversion objective',
            'Slide downloads': 'is a vanity metric'
        }
    },
    'Shorten sales cycle': {
        kpis: ['Days in stage on story-led deals', 'Average deal size', 'Number of stories published', 'Email open rate'],
        good: ['Days in stage on story-led deals'],
        info: {
            'Days in stage on story-led deals': 'shows directly whether stories move deals faster',
            'Average deal size': 'belongs to the deal size objective',
            'Number of stories published': 'is an output metric, not a speed measure',
            'Email open rate': 'measures attention, not cycle time'
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    let chosen = [];
    const kpis = {};

    function render() {
        app.innerHTML = `
            <h2>Metrics Cascade Designer</h2>
            <p class="subtitle">Cascade a business objective into storytelling objectives and the KPIs that track them.</p>
            <div class="context"><strong>Business objective:</strong> "Increase revenue by 20% in Q4."</div>
            <div class="card checklist">
                <h3>Step 1: Choose 2&ndash;3 storytelling objectives that drive this goal</h3>
                <div class="q-grid">${Object.keys(OBJECTIVES).map(o => `<label><input type="checkbox" value="${o}" ${chosen.includes(o) ? 'checked' : ''}> ${o}</label>`).join('')}</div>
                <div id="count" style="font-size:0.85em;color:var(--muted);"></div>
            </div>
            <div id="kpi-area" class="q-grid"></div>
            <div class="btn-row"><button id="submit" disabled>Build Cascade</button></div>
            <div id="result"></div>
        `;
        app.querySelectorAll('.checklist input').forEach(b => b.addEventListener('change', () => {
            if (b.checked) chosen.push(b.value); else { chosen = chosen.filter(o => o !== b.value); delete kpis[b.value]; }
            renderKpis();
        }));
        app.querySelector('#submit').addEventListener('click', build);
        renderKpis();
    }

    function renderKpis() {
        const area = app.querySelector('#kpi-area');
        area.innerHTML = chosen.map(o => `
            <div class="card checklist">
                <h3>Step 2: KPIs for "${o}" <span style="font-weight:normal;color:var(--muted);font-size:0.85em;">(choose 1&ndash;2)</span></h3>
                ${OBJECTIVES[o].kpis.map(k => `<label><input type="checkbox" data-o="${o}" value="${k}" ${(kpis[o] || []).includes(k) ? 'checked' : ''}> ${k}</label>`).join('')}
            </div>`).join('');
        area.querySelectorAll('input').forEach(b => b.addEventListener('change', () => {
            const o = b.dataset.o;
            kpis[o] = [...area.querySelectorAll(`input[data-o="${o}"]:checked`)].map(x => x.value);
            update();
        }));
        update();
    }

    function update() {
        const n = chosen.length;
        app.querySelector('#count').innerHTML = `Selected: ${n}${n === 4 ? ' <span class="mark-bad">(all four: focus on 2&ndash;3)</span>' : n === 1 ? ' (choose at least 2)' : ''}`;
        app.querySelector('#submit').disabled = !(n >= 2 && n <= 3 && chosen.every(o => (kpis[o] || []).length >= 1 && kpis[o].length <= 2));
    }

    function build() {
        const issues = [];
        chosen.forEach(o => kpis[o].forEach(k => {
            if (!OBJECTIVES[o].good.includes(k)) issues.push(`<strong>${k}</strong> under "${o}" ${OBJECTIVES[o].info[k]}.`);
        }));
        const missedSecond = chosen.filter(o => OBJECTIVES[o].good.length > 1 && kpis[o].length === 1 && OBJECTIVES[o].good.includes(kpis[o][0]));
        const res = app.querySelector('#result');
        res.innerHTML = `
            <div class="feedback ${issues.length ? 'bad' : 'ok'}">
                ${issues.length ? `<strong>Some KPIs do not track their objective:</strong><ul style="margin:4px 0;padding-left:20px;">${issues.map(i => `<li>${i}</li>`).join('')}</ul><em>Swap the flagged KPIs and rebuild.</em>`
                    : `<strong>Aligned cascade.</strong> Your metrics cascade: ${chosen.map(o => `${o} &rarr; ${kpis[o].join(' + ')}`).join('; ')}. This aligns storytelling with the business objective of increasing Q4 revenue by 20%.`}
                ${missedSecond.length && !issues.length ? `<br><em>Tip:</em> "${missedSecond[0]}" can also use <strong>${OBJECTIVES[missedSecond[0]].good.find(k => !kpis[missedSecond[0]].includes(k))}</strong>.` : ''}
            </div>
            <div class="graph-wrap" id="cascade"></div>
            <div class="feedback warn"><strong>Remember:</strong> not every metric is a KPI. A KPI must track its objective and drive a decision; views, downloads, and story counts are activity, not outcomes. Fewer, well-aligned KPIs beat a dashboard full of numbers.</div>`;
        drawCascade(res.querySelector('#cascade'));
        app.scrollTop = res.offsetTop - 8;
    }

    function drawCascade(wrap) {
        const allK = chosen.flatMap(o => kpis[o].map(k => ({ o, k })));
        const W = 640, H = 270;
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        const el = (tag, attrs) => { const e = document.createElementNS(SVG_NS, tag); Object.entries(attrs).forEach(([a, v]) => e.setAttribute(a, v)); svg.appendChild(e); return e; };
        const wrapText = (x, y, str, size, color, maxChars) => {
            const words = str.split(' '); const lines = []; let line = '';
            words.forEach(w => { if ((line + ' ' + w).trim().length > maxChars) { lines.push(line.trim()); line = w; } else line += ' ' + w; });
            lines.push(line.trim());
            lines.forEach((l, i) => { const t = el('text', { x, y: y + (i - (lines.length - 1) / 2) * (size + 2) + size / 3, 'text-anchor': 'middle', 'font-size': size, fill: color, 'font-family': 'Arial' }); t.textContent = l; });
        };
        const top = [W / 2, 34];
        const midX = i => (W / (chosen.length + 1)) * (i + 1);
        const botX = i => (W / (allK.length + 1)) * (i + 1);
        chosen.forEach((o, i) => el('line', { x1: top[0], y1: top[1] + 22, x2: midX(i), y2: 112, stroke: '#78909c', 'stroke-width': 2 }));
        allK.forEach(({ o, k }, j) => {
            const good = OBJECTIVES[o].good.includes(k);
            el('line', { x1: midX(chosen.indexOf(o)), y1: 156, x2: botX(j), y2: 210, stroke: good ? '#2e7d32' : '#c62828', 'stroke-width': 2, 'stroke-dasharray': good ? '' : '5 4' });
        });
        el('rect', { x: top[0] - 130, y: top[1] - 22, width: 260, height: 44, rx: 8, fill: '#0d47a1' });
        wrapText(top[0], top[1], 'Business: Increase revenue 20% in Q4', 14, 'white', 40);
        const mw = Math.min(170, W / (chosen.length + 1) - 12);
        chosen.forEach((o, i) => {
            el('rect', { x: midX(i) - mw / 2, y: 112, width: mw, height: 44, rx: 8, fill: '#1976d2' });
            wrapText(midX(i), 134, o, 12, 'white', 20);
        });
        const kw = Math.min(140, W / (allK.length + 1) - 8);
        allK.forEach(({ o, k }, j) => {
            const good = OBJECTIVES[o].good.includes(k);
            el('rect', { x: botX(j) - kw / 2, y: 210, width: kw, height: 50, rx: 8, fill: good ? '#e8f5e9' : '#ffebee', stroke: good ? '#2e7d32' : '#c62828', 'stroke-width': 2 });
            wrapText(botX(j), 235, k, 11, '#263238', Math.max(12, Math.floor(kw / 6.5)));
        });
        wrap.appendChild(svg);
    }

    render();
});
