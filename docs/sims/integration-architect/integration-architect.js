// Integration Architect - design a story integration architecture
// CANVAS_HEIGHT: 760
// Learners pick 3-4 systems to integrate and route three story data flows to
// target systems. On submit, an SVG diagram draws their architecture with
// valid flows in green and misrouted flows in red.

const APP_HEIGHT = 760;
const SVG_NS = 'http://www.w3.org/2000/svg';

const SYSTEMS = {
    'CRM': { full: 'CRM (Customer Relationship Management)', x: 470, y: 55, core: true, role: 'where reps work every deal, so stories must surface here' },
    'Sales Enablement': { full: 'Sales Enablement Platform', x: 130, y: 55, core: true, role: 'where the story library is curated and stored' },
    'Analytics': { full: 'Analytics Platform', x: 300, y: 215, core: true, role: 'where story usage is joined to deal outcomes' },
    'LMS': { full: 'LMS (Learning Management System)', x: 85, y: 215, core: false, role: 'useful for training reps on stories, but not part of the core story data loop' },
    'CMS': { full: 'CMS (Content Management System)', x: 515, y: 215, core: false, role: 'manages marketing web content; it is not where reps find or log sales stories' }
};

const FLOWS = [
    { id: 'library', label: 'Story library', detail: 'stories tagged by persona, industry, and deal stage', source: 'Sales Enablement', correct: 'CRM',
      why: 'Reps live in the CRM. Pushing the right story into the opportunity record means reps use it instead of hunting for it.' },
    { id: 'usage', label: 'Story usage data', detail: 'which story was told in which deal, logged by reps', source: 'CRM', correct: 'Analytics',
      why: 'Analytics joins story usage with deal outcomes, which is the only way to learn which stories actually win.' },
    { id: 'performance', label: 'Story performance', detail: 'win rate and cycle time by story', source: 'Analytics', correct: 'Sales Enablement',
      why: 'Sending performance back to the enablement platform lets the team promote winning stories and retire weak ones.' }
];

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    app.innerHTML = `
        <h2>Integration Architect</h2>
        <p class="subtitle">Choose which systems to integrate, then route each story data flow to its destination.</p>
        <div class="two-col">
            <div class="card checklist">
                <h3>Step 1: Select 3&ndash;4 systems</h3>
                ${Object.entries(SYSTEMS).map(([k, s]) => `<label><input type="checkbox" value="${k}"> ${s.full}</label>`).join('')}
                <div id="count" style="font-size:0.85em;color:var(--muted);margin-top:4px;">Selected: 0</div>
            </div>
            <div class="card">
                <h3>Step 2: Where should each data flow go?</h3>
                ${FLOWS.map(f => `
                    <div class="field" style="margin-bottom:8px;">
                        <label for="f-${f.id}">${f.label} <span style="font-weight:normal;color:var(--muted);">(${f.detail}; from ${f.source})</span></label>
                        <select id="f-${f.id}"><option value="">-- choose target --</option>${Object.keys(SYSTEMS).filter(k => k !== f.source).map(k => `<option>${k}</option>`).join('')}</select>
                    </div>`).join('')}
            </div>
        </div>
        <div class="btn-row"><button id="submit" disabled>Submit Architecture</button></div>
        <div id="diagram"></div>
        <div id="feedback"></div>
    `;

    const boxes = [...app.querySelectorAll('.checklist input')];
    const selects = FLOWS.map(f => app.querySelector('#f-' + f.id));
    const submit = app.querySelector('#submit');
    const chosen = () => boxes.filter(b => b.checked).map(b => b.value);
    const update = () => {
        const n = chosen().length;
        app.querySelector('#count').innerHTML = `Selected: ${n}${n > 4 ? ' <span class="mark-bad">(too many: choose 3&ndash;4)</span>' : n > 0 && n < 3 ? ' (choose at least 3)' : ''}`;
        submit.disabled = !(n >= 3 && n <= 4 && selects.every(s => s.value));
    };
    boxes.forEach(b => b.addEventListener('change', update));
    selects.forEach(s => s.addEventListener('change', update));

    submit.addEventListener('click', () => {
        const sys = chosen();
        const routes = FLOWS.map((f, i) => ({ f, target: selects[i].value }));
        drawDiagram(sys, routes);

        const missingCore = Object.keys(SYSTEMS).filter(k => SYSTEMS[k].core && !sys.includes(k));
        const extras = sys.filter(k => !SYSTEMS[k].core);
        const msgs = [];
        routes.forEach(({ f, target }) => {
            const inArch = sys.includes(target) && sys.includes(f.source);
            if (target === f.correct && inArch) msgs.push(`<span class="mark-ok">&#10003;</span> <strong>${f.label}</strong> &rarr; ${target}. ${f.why}`);
            else if (target === f.correct) msgs.push(`<span class="mark-bad">&#10007;</span> <strong>${f.label}</strong> &rarr; ${target} is the right route, but ${[f.source, target].filter(k => !sys.includes(k)).join(' and ')} ${[f.source, target].filter(k => !sys.includes(k)).length > 1 ? 'are' : 'is'} not in your architecture.`);
            else msgs.push(`<span class="mark-bad">&#10007;</span> <strong>${f.label}</strong> &rarr; ${target}: the ${target} is ${SYSTEMS[target].role}. Route it to <strong>${f.correct}</strong>. ${f.why}`);
        });
        const flowsOk = routes.every(({ f, target }) => target === f.correct);
        const valid = flowsOk && missingCore.length === 0;
        let html = `<div class="feedback ${valid ? 'ok' : 'bad'}">`;
        html += valid
            ? `<strong>Valid architecture.</strong> Your integration connects ${sys.join(', ')}. Data flows: ${routes.map(r => `${r.f.label} &rarr; ${r.target}`).join('; ')}.`
            : `<strong>Not a valid architecture yet.</strong>`;
        if (missingCore.length) html += `<br><span class="mark-bad">&#10007;</span> Missing core system${missingCore.length > 1 ? 's' : ''}: <strong>${missingCore.join(', ')}</strong> &mdash; ${missingCore.map(k => SYSTEMS[k].role).join('; ')}.`;
        html += '<br>' + msgs.join('<br>');
        if (extras.length) html += `<br><em>Note:</em> ${extras.map(k => `${k} is ${SYSTEMS[k].role}`).join('; ')}.`;
        if (valid) html += `<br><strong>Notice the loop:</strong> Enablement &rarr; CRM &rarr; Analytics &rarr; Enablement. Because performance data keeps flowing back, integration is never a one-time project; each connection needs ongoing maintenance as stories and systems change.`;
        else html += '<br><em>Change your selections and submit again.</em>';
        html += '</div>';
        app.querySelector('#feedback').innerHTML = html;
        app.scrollTop = app.querySelector('#diagram').offsetTop - 8;
    });

    function drawDiagram(sys, routes) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', '0 0 600 272');
        const el = (tag, attrs) => {
            const e = document.createElementNS(SVG_NS, tag);
            Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
            svg.appendChild(e);
            return e;
        };
        const defs = el('defs', {});
        [['ok', '#2e7d32'], ['bad', '#c62828']].forEach(([id, c]) => {
            const m = document.createElementNS(SVG_NS, 'marker');
            [['id', 'a-' + id], ['viewBox', '0 0 10 10'], ['refX', 10], ['refY', 5], ['markerWidth', 7], ['markerHeight', 7], ['orient', 'auto']].forEach(([k, v]) => m.setAttribute(k, v));
            const p = document.createElementNS(SVG_NS, 'path');
            p.setAttribute('d', 'M0,0 L10,5 L0,10 z');
            p.setAttribute('fill', c);
            m.appendChild(p);
            defs.appendChild(m);
        });
        const W = 72, H = 24;
        const border = (a, b) => {
            const dx = b.x - a.x, dy = b.y - a.y;
            const s = Math.min(W / Math.abs(dx || 1e-6), H / Math.abs(dy || 1e-6));
            return [a.x + dx * s, a.y + dy * s];
        };
        routes.forEach(({ f, target }, i) => {
            const a = SYSTEMS[f.source], b = SYSTEMS[target];
            const ok = target === f.correct && sys.includes(target) && sys.includes(f.source);
            // offset parallel lines slightly so opposite-direction arrows do not overlap
            const off = (i - 1) * 6;
            const [x1, y1] = border(a, b), [x2, y2] = border(b, a);
            el('line', { x1: x1 + off, y1: y1 + off, x2: x2 + off, y2: y2 + off, stroke: ok ? '#2e7d32' : '#c62828', 'stroke-width': 3, 'stroke-dasharray': ok ? '' : '7 4', 'marker-end': `url(#a-${ok ? 'ok' : 'bad'})` });
            const mx = (x1 + x2) / 2 + off, my = (y1 + y2) / 2 + off;
            el('rect', { x: mx - 58, y: my - 11, width: 116, height: 20, rx: 10, fill: 'white', stroke: ok ? '#2e7d32' : '#c62828' });
            const t = el('text', { x: mx, y: my + 4, 'text-anchor': 'middle', 'font-size': 12, fill: '#263238' });
            t.textContent = f.label;
        });
        Object.entries(SYSTEMS).forEach(([k, s]) => {
            const on = sys.includes(k);
            el('rect', { x: s.x - W, y: s.y - H, width: W * 2, height: H * 2, rx: 8, fill: on ? '#1976d2' : '#eceff1', stroke: on ? '#0d47a1' : '#b0bec5', 'stroke-width': 2, 'stroke-dasharray': on ? '' : '5 4' });
            const t = el('text', { x: s.x, y: s.y + 5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 'bold', fill: on ? 'white' : '#90a4ae' });
            t.textContent = k;
        });
        [['#1976d2', '', 'In your architecture'], ['#eceff1', '5 3', 'Not selected'], ['#2e7d32', '', 'Valid flow'], ['#c62828', '5 3', 'Misrouted flow']].forEach(([c, dash, label], i) => {
            const x = 40 + i * 140;
            if (i < 2) el('rect', { x, y: 253, width: 16, height: 12, rx: 3, fill: c, stroke: i ? '#b0bec5' : '#0d47a1', 'stroke-dasharray': dash });
            else el('line', { x1: x, y1: 259, x2: x + 18, y2: 259, stroke: c, 'stroke-width': 3, 'stroke-dasharray': dash });
            const t = el('text', { x: x + 24, y: 264, 'font-size': 12, fill: '#455a64' });
            t.textContent = label;
        });
        const wrap = app.querySelector('#diagram');
        wrap.className = 'graph-wrap';
        wrap.innerHTML = '';
        wrap.appendChild(svg);
    }
});
