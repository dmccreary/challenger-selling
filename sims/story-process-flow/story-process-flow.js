// Story Process Flow - sequence the eight stages of story creation and name the gates
// CANVAS_HEIGHT: 720
// Learners click the eight shuffled stages into order. Once the sequence is
// correct, three gate-criteria questions appear. Answering them draws the
// complete process flow with gates and the test-fails revision loop.

const APP_HEIGHT = 720;
const SVG_NS = 'http://www.w3.org/2000/svg';

const STAGES = ['Story Ideation', 'Story Drafting', 'Story Refinement', 'Story Testing',
    'Story Approval', 'Story Deployment', 'Story Maintenance', 'Story Retirement'];
const SHUFFLED = [4, 0, 6, 2, 7, 1, 5, 3].map(i => STAGES[i]);

const HINTS = {
    'Story Testing': 'Testing must come before approval: approvers need test results to make a decision.',
    'Story Approval': 'Approval is the gate between a tested story and a deployed one.',
    'Story Maintenance': 'Maintenance happens after deployment, while the story is in use.',
    'Story Retirement': 'Retirement is the final stage, once a story is outdated or no longer works.',
    'Story Refinement': 'Refinement polishes the first draft before it is tested.',
    'Story Drafting': 'Drafting turns an approved idea into a first version.',
    'Story Ideation': 'Every story starts as an idea.',
    'Story Deployment': 'Deployment publishes an approved story to the library.'
};

const GATES = [
    { from: 1, to: 2, label: 'Gate 1: Ideation \u2192 Drafting', options: ['Concept approval', 'Story outline', 'Complete draft'], correct: 'Concept approval',
      explain: 'Before anyone writes, someone confirms the idea is worth a story: it targets a real objection, persona, or insight.' },
    { from: 3, to: 4, label: 'Gate 2: Refinement \u2192 Testing', options: ['Refined draft', 'Customer feedback', 'Performance metrics'], correct: 'Refined draft',
      explain: 'Testing needs a polished candidate. Customer feedback and performance metrics come <em>out of</em> testing, not before it.' },
    { from: 4, to: 5, label: 'Gate 3: Testing \u2192 Approval', options: ['Test results', 'Stakeholder sign-off', 'Deployment plan'], correct: 'Test results',
      explain: 'Approvers decide based on evidence. Sign-off is the output of approval, and the deployment plan comes after it.' }
];

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    let seq = [];
    let seqAttempts = 0;

    function render() {
        const pool = SHUFFLED.filter(s => !seq.includes(s));
        app.innerHTML = `
            <h2>Story Process Flow</h2>
            <p class="subtitle">Click the stages in the order a story moves through them. Click a placed stage to send it back.</p>
            <div class="two-col">
                <div class="card">
                    <h3>Available stages</h3>
                    <div class="choice-row" id="pool">${pool.map(s => `<button type="button" class="choice" data-s="${s}" style="flex:1 1 45%;">${s}</button>`).join('') || '<p style="margin:0;color:var(--muted);font-size:0.9em;">All stages placed.</p>'}</div>
                </div>
                <div class="card">
                    <h3>Your sequence (${seq.length} of 8)</h3>
                    <div id="seq">${STAGES.map((_, i) => seq[i]
                        ? `<div class="seq-item" data-i="${i}" style="cursor:pointer;" title="Click to remove"><span class="seq-num">${i + 1}</span><span class="seq-label">${seq[i]}</span><span class="mark" data-m="${i}"></span></div>`
                        : `<div class="seq-item" style="opacity:0.45;"><span class="seq-num">${i + 1}</span><span class="seq-label">&nbsp;</span></div>`).join('')}</div>
                </div>
            </div>
            <div class="btn-row">
                <button id="check" ${seq.length < 8 ? 'disabled' : ''}>Check Sequence</button>
                <button id="clear" class="secondary">Clear</button>
            </div>
            <div id="feedback"></div>
            <div id="gates"></div>
            <div id="flow"></div>
        `;
        app.querySelectorAll('#pool button').forEach(b => b.addEventListener('click', () => { seq.push(b.dataset.s); render(); }));
        app.querySelectorAll('#seq [data-i]').forEach(d => d.addEventListener('click', () => { seq.splice(+d.dataset.i, 1); render(); }));
        app.querySelector('#clear').addEventListener('click', () => { seq = []; render(); });
        app.querySelector('#check').addEventListener('click', checkSequence);
    }

    function checkSequence() {
        seqAttempts++;
        const right = seq.map((s, i) => s === STAGES[i]);
        right.forEach((ok, i) => {
            const m = app.querySelector(`[data-m="${i}"]`);
            m.innerHTML = ok ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>';
        });
        const n = right.filter(Boolean).length;
        const fb = app.querySelector('#feedback');
        if (n < 8) {
            const firstWrong = seq.find((s, i) => !right[i]);
            fb.innerHTML = `<div class="feedback bad"><strong>${n} of 8</strong> stages are in the right position. Hint: ${HINTS[firstWrong]} Click misplaced stages to send them back, then re-place them.</div>`;
            return;
        }
        fb.innerHTML = `<div class="feedback ok"><strong>Correct sequence${seqAttempts === 1 ? ' on the first try' : ''}!</strong> Every stage matters: skipping testing sends untested stories to reps, and stopping at deployment leaves stale stories in the library forever. Now name the criteria for three key gates.</div>`;
        app.querySelector('#check').disabled = true;
        renderGates();
    }

    function renderGates() {
        const g = app.querySelector('#gates');
        g.innerHTML = `<div class="q-grid">${GATES.map((gate, i) => `
            <div class="card" data-g="${i}">
                <h3>${gate.label}</h3>
                <p style="margin:0 0 6px 0;font-size:0.9em;">What must exist before a story passes this gate?</p>
                <select data-gs="${i}"><option value="">-- choose --</option>${gate.options.map(o => `<option>${o}</option>`).join('')}</select>
                <div class="g-fb"></div>
            </div>`).join('')}</div>
            <div class="btn-row"><button id="gcheck" disabled>Check Gates &amp; Show Flow</button></div>`;
        const sels = [...g.querySelectorAll('select')];
        sels.forEach(s => s.addEventListener('change', () => { g.querySelector('#gcheck').disabled = !sels.every(x => x.value); }));
        g.querySelector('#gcheck').addEventListener('click', () => {
            const answers = sels.map(s => s.value);
            let score = 0;
            GATES.forEach((gate, i) => {
                const ok = answers[i] === gate.correct;
                if (ok) score++;
                g.querySelector(`[data-g="${i}"] .g-fb`).innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}" style="margin:6px 0 0 0;">${ok ? '<strong>Correct.</strong>' : `<strong>Not quite.</strong> The gate criterion is <strong>${gate.correct}</strong>.`} ${gate.explain}</div>`;
            });
            drawFlow(answers, score);
        });
        app.scrollTop = g.offsetTop - 8;
    }

    function drawFlow(answers, score) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', '0 0 640 250');
        const el = (tag, attrs) => {
            const e = document.createElementNS(SVG_NS, tag);
            Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
            svg.appendChild(e);
            return e;
        };
        const text = (x, y, str, attrs) => { const t = el('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': 12, fill: '#263238' }, attrs || {})); t.textContent = str; return t; };
        const defs = el('defs', {});
        defs.innerHTML = '<marker id="fa" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#546e7a"/></marker>' +
            '<marker id="fr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ef6c00"/></marker>';
        const xs = [70, 215, 360, 505];
        const pos = i => i < 4 ? [xs[i], 70] : [xs[7 - i], 200];
        const W = 58, H = 22;
        // flow arrows
        for (let i = 0; i < 7; i++) {
            const [x1, y1] = pos(i), [x2, y2] = pos(i + 1);
            if (y1 === y2) {
                const dir = x2 > x1 ? 1 : -1;
                el('line', { x1: x1 + dir * W, y1, x2: x2 - dir * W, y2, stroke: '#546e7a', 'stroke-width': 2.5, 'marker-end': 'url(#fa)' });
            } else {
                el('line', { x1, y1: y1 + H, x2, y2: y2 - H, stroke: '#546e7a', 'stroke-width': 2.5, 'marker-end': 'url(#fa)' });
            }
        }
        // revision loop: testing fails -> refinement
        el('path', { d: `M ${xs[3] - 20} ${70 + H} Q ${(xs[2] + xs[3]) / 2} ${140} ${xs[2] + 20} ${70 + H + 2}`, fill: 'none', stroke: '#ef6c00', 'stroke-width': 2, 'stroke-dasharray': '5 4', 'marker-end': 'url(#fr)' });
        text((xs[2] + xs[3]) / 2, 128, 'test fails \u2192 revise', { fill: '#ef6c00', 'font-size': 11 });
        // stage boxes
        STAGES.forEach((s, i) => {
            const [x, y] = pos(i);
            el('rect', { x: x - W, y: y - H, width: W * 2, height: H * 2, rx: 8, fill: i < 4 ? '#1976d2' : '#00897b' });
            text(x, y - 2, s.replace('Story ', ''), { fill: 'white', 'font-weight': 'bold', 'font-size': 13 });
            text(x, y + 13, `stage ${i + 1}`, { fill: '#e3f2fd', 'font-size': 10 });
        });
        // gate labels
        const gateBadge = (x, y, str, ok, anchor) => {
            text(x, y, str, { 'font-size': 11, 'font-weight': 'bold', fill: ok ? '#2e7d32' : '#c62828', 'text-anchor': anchor || 'middle' });
        };
        gateBadge((xs[0] + xs[1]) / 2, 34, `Gate 1: ${answers[0]}`, answers[0] === GATES[0].correct);
        gateBadge((xs[2] + xs[3]) / 2, 34, `Gate 2: ${answers[1]}`, answers[1] === GATES[1].correct);
        gateBadge(xs[3] - 16, 158, `Gate 3: ${answers[2]}`, answers[2] === GATES[2].correct, 'end');

        const flow = app.querySelector('#flow');
        flow.innerHTML = `
            <div class="feedback ${score === 3 ? 'ok' : 'warn'}">Gate criteria: <strong>${score} of 3</strong> correct.
                Your process sequence: ${STAGES.map(s => s.replace('Story ', '')).join(' &rarr; ')}.
                ${score === 3 ? 'This is the complete story creation process.' : 'Gates shown in red use the wrong criterion; change them and check again.'}</div>
            <div class="graph-wrap"></div>
            <div class="feedback warn"><strong>Remember:</strong> no stage is optional. Testing validates a story before approval, and deployment is not the end: maintenance keeps stories current, and retirement removes them when they stop working.</div>`;
        flow.querySelector('.graph-wrap').appendChild(svg);
        app.scrollTop = flow.offsetTop - 8;
    }

    render();
});
