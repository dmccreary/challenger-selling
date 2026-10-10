// Story Draft Builder - write a six-part customer story draft
// CANVAS_HEIGHT: 760
// Learners write each component of a predictive-maintenance story following
// drafting tips. On submit the draft is assembled in order with a structural
// checklist (statistic or question in the hook, numbers in the problem, and so
// on). An example draft is available for comparison after submitting.

const APP_HEIGHT = 760;

const PARTS = [
    { id: 'hook', name: 'Hook', len: '1-2 sentences', color: '#6a1b9a',
      tip: 'Start with a startling statistic or provocative question.',
      check: t => /\d|\?/.test(t), pass: 'Opens with a number or a question.', miss: 'Add a startling statistic or a provocative question.',
      example: 'What would your plant earn if the line never stopped unexpectedly? For one auto-parts maker, unplanned downtime was costing $40,000 an hour.' },
    { id: 'problem', name: 'Problem', len: '2-3 sentences', color: '#1565c0',
      tip: 'Be specific and quantify when possible.',
      check: t => /\d/.test(t), pass: 'The problem is quantified.', miss: 'Quantify the problem (hours, dollars, percentages).',
      example: 'Their stamping presses failed without warning about twice a month. Maintenance worked on fixed schedules, so they replaced healthy parts and still missed the ones about to fail.' },
    { id: 'agitation', name: 'Agitation', len: '2-3 sentences', color: '#c62828',
      tip: 'Show ripple effects and costs.',
      check: t => /cost|lost|lose|losing|miss|late|delay|penalt|overtime|risk|angry|\$|\d/i.test(t), pass: 'Shows consequences or costs.', miss: 'Show what the problem costs: missed shipments, overtime, penalties, lost customers.',
      example: 'Every breakdown rippled outward: missed shipments, weekend overtime, and late-delivery penalties from their largest customer, who began quietly qualifying a second supplier.' },
    { id: 'solution', name: 'Solution', len: '2-3 sentences', color: '#2e7d32',
      tip: 'Be concrete about implementation.',
      check: t => t.split(/\s+/).length >= 15 && /sensor|install|deploy|implement|model|monitor|pilot|week|month|phase|data/i.test(t), pass: 'Describes how the solution was implemented.', miss: 'Be concrete: what was installed, how it was rolled out, and how long it took.',
      example: 'They installed vibration and temperature sensors on 40 presses and fed the data into a predictive model that flags failures two to three weeks ahead. The rollout started with one line as a 60-day pilot.' },
    { id: 'proof', name: 'Social Proof', len: '1-2 sentences', color: '#ef6c00',
      tip: 'Include specific numbers or quotes.',
      check: t => /\d|["\u201c]/.test(t), pass: 'Includes a number or a quote.', miss: 'Add a specific number or a direct quote.',
      example: 'Within a year, unplanned downtime fell 60%. "We stopped firefighting and started planning," said the plant manager.' },
    { id: 'cta', name: 'Call to Action', len: '1 sentence', color: '#37474f',
      tip: 'Be specific and actionable.',
      check: t => /schedule|book|set up|review|walk|meet|call|demo|pilot|assess|map|compare|look at|would you|shall we|let\'s/i.test(t) && t.split(/[.!?]+\s/).length <= 2, pass: 'Asks for one specific next step.', miss: 'Ask for one specific, easy next step (for example, a 30-minute review of last year\'s downtime data).',
      example: 'Would a 30-minute review of your last year of downtime data be worth it to see what a pilot line could save?' }
];

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    const draft = {};
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    function render() {
        app.innerHTML = `
            <h2>Story Draft Builder</h2>
            <p class="subtitle">Write a first draft, one component at a time. Aim for structure, not polish.</p>
            <div class="context"><strong>Scenario:</strong> Draft a story about a manufacturing company that reduced downtime by 60% using predictive maintenance.</div>
            <div class="q-grid">${PARTS.map((p, i) => `
                <div class="card" style="border-left:5px solid ${p.color};">
                    <h3 style="color:${p.color};">${i + 1}. ${p.name} <span style="font-weight:normal;color:var(--muted);font-size:0.85em;">(${p.len})</span></h3>
                    <p style="margin:0 0 4px 0;font-size:0.85em;color:var(--muted);">Tip: ${p.tip}</p>
                    <textarea data-p="${p.id}" rows="3">${esc(draft[p.id] || '')}</textarea>
                </div>`).join('')}</div>
            <div class="btn-row"><button id="submit" disabled>Assemble My Draft</button></div>
            <div id="result"></div>
        `;
        const submit = app.querySelector('#submit');
        const update = () => { submit.disabled = !PARTS.every(p => (draft[p.id] || '').trim().length >= 10); };
        app.querySelectorAll('textarea').forEach(t => t.addEventListener('input', () => { draft[t.dataset.p] = t.value; update(); }));
        submit.addEventListener('click', assemble);
        update();
    }

    function assemble() {
        const results = PARTS.map(p => ({ p, ok: p.check(draft[p.id].trim()) }));
        const passed = results.filter(r => r.ok).length;
        const res = app.querySelector('#result');
        res.innerHTML = `
            <div class="feedback ${passed === PARTS.length ? 'ok' : 'warn'}">
                Your draft includes all 6 components in story order. <strong>${passed} of ${PARTS.length}</strong> structural checks pass.
                ${passed === PARTS.length ? 'The hook creates attention, the problem is specific, and the CTA is actionable. Well-structured draft.' : 'Use the suggestions below for your next revision; a first draft only needs the right structure.'}
            </div>
            <div class="card"><h3>Assembled draft</h3>
                ${PARTS.map(p => `<p style="margin:0 0 6px 0;line-height:1.5;"><span class="tag" style="background:${p.color};margin:0 6px 0 0;">${p.name}</span>${esc(draft[p.id].trim())}</p>`).join('')}
            </div>
            <div class="card"><h3>Structural checklist</h3>
                ${results.map(r => `<div style="font-size:0.92em;padding:2px 0;">${r.ok ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#9675;</span>'} <strong>${r.p.name}:</strong> ${r.ok ? r.p.pass : r.p.miss}</div>`).join('')}
                <p style="margin:6px 0 0 0;font-size:0.82em;color:var(--muted);">These checks look for structural signals such as numbers, questions, and concrete verbs. They cannot judge whether your story is persuasive; ask a colleague for that.</p>
            </div>
            <div class="btn-row"><button id="edit" class="secondary">Revise My Draft</button><button id="example" class="secondary">Compare With an Example</button></div>
            <div id="example-box"></div>
            <div class="feedback warn"><strong>Remember:</strong> first drafts focus on structure, not polish. The order matters (hook, problem, agitation, solution, proof, call to action), and specific details are what make a story compelling.</div>
        `;
        res.querySelector('#edit').addEventListener('click', () => { render(); });
        res.querySelector('#example').addEventListener('click', () => {
            res.querySelector('#example-box').innerHTML = `<div class="card"><h3>Example draft</h3>${PARTS.map(p => `<p style="margin:0 0 6px 0;line-height:1.5;"><span class="tag" style="background:${p.color};margin:0 6px 0 0;">${p.name}</span>${p.example}</p>`).join('')}</div>`;
        });
        app.scrollTop = res.offsetTop - 8;
    }

    render();
});
