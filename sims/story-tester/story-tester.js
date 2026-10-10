// Story Tester - evaluate a weak draft on four testing criteria
// CANVAS_HEIGHT: 760
// Learners rate a vague story draft on clarity, relevance, effectiveness, and
// authenticity and write feedback for each. The summary compares their
// ratings with an expert review and shows an improved draft.

const CRITERIA = [
    { id: 'clarity', name: 'Clarity', q: 'Is the message clear?', options: ['Clear', 'Somewhat clear', 'Unclear'], correct: 'Unclear',
      expert: 'What challenges? What solution? What results? Every key noun is vague.',
      fix: 'Name the problem, the solution, and the result with a number.' },
    { id: 'relevance', name: 'Relevance', q: 'Does it resonate with the target audience?', options: ['Relevant', 'Somewhat relevant', 'Not relevant'], correct: 'Not relevant',
      expert: 'No industry, no persona, no situation a specific buyer would recognize as their own.',
      fix: 'Put the story in the buyer\'s industry and speak to their role\'s priorities.' },
    { id: 'effectiveness', name: 'Effectiveness', q: 'Does it achieve the intended outcome?', options: ['Effective', 'Somewhat effective', 'Not effective'], correct: 'Not effective',
      expert: 'No hook, no agitation of the cost of inaction, and a pushy CTA ("you should try it too").',
      fix: 'Open with a hook, show what the problem cost, and end with a specific, low-friction next step.' },
    { id: 'authenticity', name: 'Authenticity', q: 'Does it feel genuine?', options: ['Authentic', 'Somewhat authentic', 'Not authentic'], correct: 'Not authentic',
      expert: 'No names, numbers, or real details, so it sounds like generic marketing copy.',
      fix: 'Use a real (or permission-cleared) customer, a real number, and one human detail.' }
];

const CONFIG = {
    title: 'Story Tester',
    subtitle: 'Test the draft on four criteria and write feedback the author can act on.',
    height: 760,
    grid: true,
    scoreNoun: 'ratings',
    submitLabel: 'See Test Summary',
    contextHtml: '<div class="context"><strong>Story draft:</strong> <em>"A company faced challenges with legacy systems. They used our solution and achieved results. You should try it too."</em></div>',
    sections: CRITERIA.map(c => ({
        id: c.id, title: `${c.name}: ${c.q}`, type: 'buttons', options: c.options, correct: c.correct,
        text: 'Feedback for the author: what specifically should change?', explain: c.expert
    })),
    resultHtml: (sel, ok, notes) => {
        const weak = CRITERIA.filter(c => sel[c.id] !== c.options[0]).map(c => c.name.toLowerCase());
        return `<div class="card"><h3>Test Summary</h3>
            <table class="summary">
                <tr><th>Criterion</th><th>Your rating</th><th>Expert</th><th>Your feedback</th><th>Improvement suggestion</th></tr>
                ${CRITERIA.map(c => `<tr><td>${c.name}</td><td>${ok[c.id] ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>'} ${sel[c.id]}</td><td>${c.correct}</td><td>${notes[c.id].replace(/</g, '&lt;')}</td><td>${c.fix}</td></tr>`).join('')}
            </table>
            <p style="margin:8px 0 0 0;">Your evaluation says this story needs improvement in <strong>${weak.length ? weak.join(', ') : 'nothing (but the expert review disagrees on all four)'}</strong>.
            Good feedback is guidance, not criticism: compare your notes with the suggestions and check that each one tells the author exactly what to change.</p>
            <p style="margin:6px 0 0 0;"><strong>Improved draft:</strong> <em>"Every month, Halvorsen Manufacturing's CIO watched 40% of her IT budget disappear into keeping a 1998 ERP alive, while two competitors launched online ordering. After moving to our platform, Halvorsen cut maintenance spend in half and launched its own portal in five months. Would a 30-minute look at your maintenance spend be useful?"</em></p>
        </div>`;
    },
    summaryNote: 'testing is not optional, and one criterion is never enough: a story can be clear but irrelevant, or relevant but inauthentic. Test every story on all four criteria before it reaches the library.'
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
