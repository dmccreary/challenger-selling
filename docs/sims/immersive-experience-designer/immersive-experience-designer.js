// Immersive Experience Designer - choose VR, AR, or MR and design the experience
// CANVAS_HEIGHT: 720
// Learners choose an immersive technology and three experience elements for
// a production-line showcase, then see the experience specification and a
// consistency check between technology and environment.

const CONFIG = {
    title: 'Immersive Experience Designer',
    subtitle: 'Design an immersive experience: choose the technology, then the experience elements.',
    height: 720,
    grid: true,
    scoreNoun: 'design choices',
    submitLabel: 'Generate Specification',
    contextHtml: '<div class="context"><strong>Scenario:</strong> A manufacturing company wants to showcase its new production line to prospective customers, most of whom will never visit the plant in person.</div>',
    sections: [
        { id: 'tech', title: 'Technology', type: 'buttons', options: ['Virtual Reality', 'Augmented Reality', 'Mixed Reality'], correct: 'Virtual Reality',
          info: { 'Virtual Reality': 'replaces the surroundings with a fully virtual space, so prospects can tour a plant they are not standing in', 'Augmented Reality': 'overlays information on the real world, which only helps if the prospect is standing in the factory', 'Mixed Reality': 'anchors interactive virtual objects in a real room, powerful but costly and best for hands-on design reviews' },
          explain: 'Because prospects are remote, the experience must bring the factory to them. VR does that.' },
        { id: 'env', title: 'Environment', type: 'buttons', options: ['Virtual factory', 'Overlay on real factory', 'Interactive model'], correct: 'Virtual factory',
          info: { 'Overlay on real factory': 'requires the prospect to be on site', 'Interactive model': 'is a tabletop model; it shows the machine but loses the sense of scale and presence' },
          explain: 'A full-scale virtual factory creates presence: the prospect feels the size and flow of the line.' },
        { id: 'interact', title: 'Interaction', type: 'buttons', options: ['Walk-through tour', 'Point-and-learn', 'Manipulate components'], correct: 'Walk-through tour',
          info: { 'Point-and-learn': 'works for detail but breaks the flow of a tour', 'Manipulate components': 'suits engineers in a design review more than buyers evaluating the line' },
          explain: 'Walking the line from raw material to finished product mirrors a real plant tour, the strongest story structure for a facility.' },
        { id: 'focus', title: 'Story Focus', type: 'buttons', options: ['Equipment details', 'Process flow', 'Safety features'], correct: 'Process flow',
          info: { 'Equipment details': 'matter to engineers but bury the business story in specifications', 'Safety features': 'are important but are a supporting point, not the main story of a new line' },
          explain: 'Buyers care how the line turns orders into finished product faster and more reliably. The process flow is the story; equipment and safety support it.' }
    ],
    resultHtml: (sel, ok) => {
        const clash = sel.tech !== 'Augmented Reality' && sel.env === 'Overlay on real factory'
            ? 'An overlay on the real factory requires AR and an on-site visit, which conflicts with your technology choice and with remote prospects.'
            : sel.tech === 'Augmented Reality' && sel.env === 'Virtual factory'
            ? 'A fully virtual factory is a VR environment; AR cannot place a prospect inside it.' : '';
        return `<div class="card"><h3>Immersive Experience Specification</h3>
            <table class="summary">
                <tr><th>Element</th><th>Your choice</th><th>Rationale</th></tr>
                ${CONFIG.sections.map(s => `<tr><td>${s.title}</td><td>${ok[s.id] ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>'} ${sel[s.id]}</td><td>${ok[s.id] ? s.explain : (s.info[sel[s.id]] ? sel[s.id] + ' ' + s.info[sel[s.id]] + '.' : '')}</td></tr>`).join('')}
            </table>
            ${clash ? `<div class="feedback bad" style="margin:8px 0 0 0;"><strong>Consistency check:</strong> ${clash}</div>` : '<p style="margin:6px 0 0 0;"><strong>Consistency check:</strong> technology and environment fit together.</p>'}
            <p style="margin:6px 0 0 0;">Your immersive experience uses <strong>${sel.tech}</strong> with a <strong>${sel.env.toLowerCase()}</strong>, a <strong>${sel.interact.toLowerCase()}</strong>, and a focus on <strong>${sel.focus.toLowerCase()}</strong>.</p></div>`;
    },
    summaryNote: 'VR, AR, and MR serve different situations, and VR is not always best: AR wins when the customer is standing in front of the real equipment. Immersion is more than visuals; interaction and presence are what make the story stick.'
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
