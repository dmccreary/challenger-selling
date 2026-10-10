// Architecture Layer Designer - choose a component for each architecture layer
// CANVAS_HEIGHT: 740
// Learners choose an integration, data, security, and scalability approach
// for a storytelling platform, then see the layered architecture drawn with
// their choices.

const CHOICE_LAYERS = [
    { id: 'integration', name: 'Integration', options: ['API-based', 'Event-driven', 'Batch', 'All three'], correct: 'All three',
      info: { 'API-based': 'is right for on-demand requests, such as the CRM fetching a story', 'Event-driven': 'is right for real-time reactions, such as a deal stage change triggering a story recommendation', 'Batch': 'is right for nightly bulk jobs, such as syncing analytics', 'All three': 'lets each use case use the pattern that fits it' },
      explain: 'A storytelling platform has on-demand lookups (API), real-time triggers (events), and bulk syncs (batch). Forcing everything through one pattern makes some use cases slow or fragile.' },
    { id: 'data', name: 'Data', options: ['Centralized database', 'Distributed data lake', 'Hybrid approach', 'Data warehouse'], correct: 'Hybrid approach',
      info: { 'Centralized database': 'keeps structured story records consistent but handles recordings and usage logs poorly', 'Distributed data lake': 'stores anything flexibly but makes consistent story records hard to guarantee', 'Hybrid approach': 'keeps story records in a consistent database and usage data, audio, and video in a flexible lake', 'Data warehouse': 'is built for reporting, not for serving stories to reps in real time' },
      explain: 'Stories need consistency (one approved version), while usage data, call recordings, and video need flexibility and scale. A hybrid design gives each kind of data the store it needs.' },
    { id: 'security', name: 'Security', options: ['Authentication only', 'Encryption only', 'Defense in depth', 'Perimeter security'], correct: 'Defense in depth',
      info: { 'Authentication only': 'stops strangers but not a stolen password or an over-privileged user', 'Encryption only': 'protects stolen data but does not control who can access it', 'Defense in depth': 'layers authentication, role-based access, encryption, and monitoring so no single failure exposes customer data', 'Perimeter security': 'trusts everything inside the network, which fails once one account is compromised' },
      explain: 'Customer stories contain names, results, and sometimes confidential numbers. Security has to work at every layer, not just at the front door.' },
    { id: 'scale', name: 'Scalability', options: ['Vertical scaling', 'Horizontal scaling', 'Auto-scaling', 'Manual scaling'], correct: 'Auto-scaling',
      info: { 'Vertical scaling': 'buys a bigger server, which has a ceiling and a single point of failure', 'Horizontal scaling': 'adds servers, but someone still has to decide when', 'Auto-scaling': 'adds and removes capacity automatically as demand rises and falls', 'Manual scaling': 'depends on someone noticing the slowdown, usually too late' },
      explain: 'Demand spikes at quarter-end and during sales kickoffs. Auto-scaling handles the spike without paying for peak capacity all year.' }
];

const CONFIG = {
    title: 'Architecture Layer Designer',
    subtitle: 'Choose an approach for each layer of a storytelling platform.',
    height: 740,
    grid: true,
    scoreNoun: 'layers',
    submitLabel: 'Show Architecture',
    contextHtml: '<div class="context"><strong>Requirement:</strong> A story platform for 2,000 reps that serves stories inside the CRM, recommends stories when deals change stage, stores call recordings, and protects confidential customer results.</div>',
    sections: CHOICE_LAYERS.map(l => ({ id: l.id, title: `Layer: ${l.name}`, type: 'buttons', options: l.options, correct: l.correct, info: l.info, explain: l.explain })),
    resultHtml: (sel, ok) => {
        const ns = 'http://www.w3.org/2000/svg';
        const rows = [['Story consumers', 'CRM \u00b7 sales enablement \u00b7 rep mobile app', null]].concat(
            CHOICE_LAYERS.map(l => [l.name + ' layer', sel[l.id], ok[l.id]])).concat([['Story sources', 'story library \u00b7 call recordings \u00b7 usage events', null]]);
        let svg = `<svg viewBox="0 0 600 ${rows.length * 52 + 6}" xmlns="${ns}"><defs><marker id="ad" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#78909c"/></marker></defs>`;
        rows.forEach(([label, comp, good], i) => {
            const y = 6 + i * 52;
            const fill = good === null ? '#eceff1' : good ? '#e8f5e9' : '#ffebee';
            const stroke = good === null ? '#90a4ae' : good ? '#2e7d32' : '#c62828';
            svg += `<rect x="20" y="${y}" width="560" height="38" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
            svg += `<text x="34" y="${y + 24}" font-size="14" font-weight="bold" fill="#263238">${label}</text>`;
            svg += `<text x="566" y="${y + 24}" font-size="14" text-anchor="end" fill="${good === false ? '#c62828' : '#263238'}">${good === null ? '' : (good ? '\u2713 ' : '\u2717 ')}${comp}</text>`;
            if (i < rows.length - 1) svg += `<line x1="300" y1="${y + 38}" x2="300" y2="${y + 50}" stroke="#78909c" stroke-width="2" marker-end="url(#ad)"/>`;
        });
        svg += '</svg>';
        const quality = ['robust', 'secure', 'scalable'].filter((q, i) => [ok.integration && ok.data, ok.security, ok.scale][i]);
        return `<div class="card"><h3>Your Architecture</h3><div class="graph-wrap" style="margin-bottom:6px;">${svg}</div>
            <p style="margin:0;">Your architecture design: ${CHOICE_LAYERS.map(l => `<strong>${sel[l.id]}</strong> ${l.name.toLowerCase()}`).join(', ')}.
            ${quality.length ? `This creates a <strong>${quality.join(', ')}</strong> storytelling system.` : 'Each flagged layer is a weak point in the system.'}</p></div>`;
    },
    summaryNote: 'each layer serves a different purpose, and security belongs at every layer, not just one. Architecture is not static: revisit these choices as reps, data volume, and integrations grow.'
};

// ---------------------------------------------------------------------------
// Design-and-review engine: every decision is visible at once. The learner
// completes all sections, selects Submit, and gets per-section feedback plus
// a generated result (diagram, assembled story, or analysis). Learners can
// change any answer and resubmit; the first-attempt score is kept.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const C = CONFIG;
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', C.height + 'px');
    main.appendChild(app);

    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const sel = {};
    const notes = {};
    let firstScore = null;

    function inputHtml(s) {
        if (s.type === 'select') {
            return `<select data-s="${s.id}"><option value="">-- choose --</option>${s.options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select>`;
        }
        if (s.type === 'checks') {
            return `<div class="checklist">${s.options.map(o => `<label><input type="checkbox" data-s="${s.id}" value="${esc(o)}"> <span>${esc(o)}</span></label>`).join('')}</div>`;
        }
        return `<div class="choice-row" data-s="${s.id}">${s.options.map(o => `<button type="button" class="choice" data-value="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
    }

    function render() {
        app.innerHTML = `
            <h2>${C.title}</h2>
            <p class="subtitle">${C.subtitle}</p>
            ${C.contextHtml || ''}
            <div class="${C.grid ? 'q-grid' : ''}">
            ${C.sections.map(s => `
                <div class="card" data-card="${s.id}">
                    <h3>${s.title}</h3>
                    ${s.prompt ? `<p style="margin:0 0 6px 0;font-size:0.92em;">${s.prompt}</p>` : ''}
                    ${inputHtml(s)}
                    ${s.text ? `<textarea data-note="${s.id}" rows="2" style="margin-top:6px;" placeholder="${esc(s.text)}"></textarea>` : ''}
                    <div class="s-fb"></div>
                </div>`).join('')}
            </div>
            <div class="btn-row"><button id="submit" disabled>${C.submitLabel || 'Submit'}</button></div>
            <div id="result"></div>
        `;
        const submit = app.querySelector('#submit');
        const update = () => {
            submit.disabled = !C.sections.every(s =>
                (s.type === 'checks' ? (sel[s.id] || []).length > 0 : sel[s.id]) && (!s.text || (notes[s.id] || '').length >= 3));
        };
        app.querySelectorAll('select[data-s]').forEach(x => x.addEventListener('change', () => { sel[x.dataset.s] = x.value; update(); }));
        app.querySelectorAll('input[type=checkbox][data-s]').forEach(x => x.addEventListener('change', () => {
            sel[x.dataset.s] = [...app.querySelectorAll(`input[data-s="${x.dataset.s}"]:checked`)].map(c => c.value);
            update();
        }));
        app.querySelectorAll('.choice-row[data-s]').forEach(row => row.querySelectorAll('button.choice').forEach(b => b.addEventListener('click', () => {
            row.querySelectorAll('button.choice').forEach(x => x.classList.remove('selected'));
            b.classList.add('selected');
            sel[row.dataset.s] = b.dataset.value;
            update();
        })));
        app.querySelectorAll('textarea[data-note]').forEach(t => t.addEventListener('input', () => { notes[t.dataset.note] = t.value.trim(); update(); }));
        submit.addEventListener('click', evaluate);
    }

    function grade(s) {
        const v = sel[s.id];
        if (s.grade) return s.grade(v);
        if (s.type === 'checks') {
            const want = [...s.correct].sort().join('|');
            return [...v].sort().join('|') === want;
        }
        return v === s.correct;
    }

    function wrongDetail(s) {
        const v = sel[s.id];
        const info = o => (s.info && s.info[o]) ? ` (${s.info[o]})` : '';
        if (s.type === 'checks') {
            const missing = s.correct.filter(o => !v.includes(o));
            const extra = v.filter(o => !s.correct.includes(o));
            return (missing.length ? `Missing: ${missing.map(o => `<strong>${esc(o)}</strong>${info(o)}`).join('; ')}. ` : '') +
                (extra.length ? `Remove: ${extra.map(o => `<strong>${esc(o)}</strong>${info(o)}`).join('; ')}. ` : '');
        }
        if (s.correct === undefined) return `You chose <strong>${esc(v)}</strong>${info(v)}. `;
        return `You chose <strong>${esc(v)}</strong>${info(v)}. The better choice is <strong>${esc(s.correct)}</strong>. `;
    }

    function evaluate() {
        const ok = {};
        C.sections.forEach(s => {
            ok[s.id] = grade(s);
            const card = app.querySelector(`[data-card="${s.id}"]`);
            card.querySelector('.s-fb').innerHTML = `<div class="feedback ${ok[s.id] ? 'ok' : 'bad'}" style="margin:8px 0 0 0;">` +
                (ok[s.id] ? `<strong>${s.okLabel || 'Good choice.'}</strong> ${s.showInfo && s.info && s.info[sel[s.id]] ? 'You chose <strong>' + esc(sel[s.id]) + '</strong>: ' + s.info[sel[s.id]] + '. ' : ''}` : `<strong>${s.badLabel || 'Not quite.'}</strong> ${wrongDetail(s)}`) +
                `${s.explain || ''}</div>`;
        });
        const score = C.sections.filter(s => ok[s.id]).length;
        const n = C.sections.length;
        if (firstScore === null) firstScore = score;
        const res = app.querySelector('#result');
        res.innerHTML = `
            <div class="feedback ${score === n ? 'ok' : 'warn'}">
                <strong>${score} of ${n}</strong> ${C.scoreNoun || 'decisions'} match the recommended approach
                (first attempt: ${firstScore} of ${n}).${score < n ? ' Adjust the flagged sections and submit again.' : ''}
            </div>
            ${C.resultHtml ? C.resultHtml(sel, ok, notes) : ''}
            <div class="feedback warn"><strong>Remember:</strong> ${C.summaryNote}</div>`;
        app.scrollTop = res.offsetTop - 8;
    }

    render();
});
