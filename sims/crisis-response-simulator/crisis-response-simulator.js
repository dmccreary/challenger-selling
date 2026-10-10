// Crisis Response Simulator - assemble a data breach response statement
// CANVAS_HEIGHT: 760
// Learners make four response decisions for a data breach. Their choices are
// assembled into the statement a spokesperson would read, so they can hear
// how defensive and accountable responses actually sound.

const LINES = {
    d1: {
        'Deny the breach': 'We have no evidence that any breach occurred.',
        'Acknowledge immediately': 'This morning we confirmed that an unauthorized party accessed records for about 10,000 of our customers.',
        'Delay comment': 'We have no comment at this time.',
        'Blame third party': 'A vendor we work with appears to have been compromised.'
    },
    d2: {
        'Share all details': 'Here are the full technical details of every system involved and every vulnerability that was exploited.',
        'Share what you know': 'What we know so far: names and email addresses were exposed; payment data was not. We will post an update every 24 hours.',
        'Share nothing': 'We cannot discuss an ongoing investigation.',
        'Downplay impact': 'This is a minor incident affecting a small number of people.'
    },
    d3: {
        'Accept responsibility': 'Protecting your data is our responsibility, and we fell short.',
        'Blame hackers': 'We were the victims of a sophisticated criminal attack.',
        'Blame IT team': 'An employee failed to follow our security procedures.',
        'Avoid taking a stance': 'It is too early to say who is responsible.'
    },
    d4: {
        'Emphasize what went wrong': 'The breach happened because a server was not patched on time.',
        'Emphasize what you\'re doing': 'We have closed the vulnerability, notified every affected customer, and are offering two years of free credit monitoring.',
        'Emphasize it\'s resolved': 'The issue is fully resolved and there is nothing further to worry about.',
        'Emphasize competitors have it worse': 'Breaches like this are common across our industry.'
    }
};
const PRINCIPLE = { d1: 'Acknowledgment', d2: 'Transparency', d3: 'Accountability', d4: 'Solution focus' };

const CONFIG = {
    title: 'Crisis Response Simulator',
    subtitle: 'Make four decisions, then hear the statement your choices produce.',
    height: 760,
    grid: true,
    scoreNoun: 'decisions',
    submitLabel: 'Assemble the Statement',
    contextHtml: '<div class="context"><strong>Crisis:</strong> Your company experienced a data breach affecting 10,000 customer records. A reporter is on the phone asking for comment, and the story runs in two hours.</div>',
    sections: [
        { id: 'd1', title: '1. Initial acknowledgment', type: 'buttons', options: Object.keys(LINES.d1), correct: 'Acknowledge immediately',
          info: { 'Deny the breach': 'collapses your credibility the moment the facts come out', 'Delay comment': 'lets someone else tell the story first, and "no comment" sounds like hiding', 'Blame third party': 'sounds like deflection even if a vendor was involved' },
          explain: 'Speed matters: acknowledging quickly, with accurate facts, lets you shape the story instead of reacting to it.' },
        { id: 'd2', title: '2. Information sharing', type: 'buttons', options: Object.keys(LINES.d2), correct: 'Share what you know',
          info: { 'Share all details': 'risks releasing unverified facts and gives attackers a roadmap', 'Share nothing': 'looks like a cover-up', 'Downplay impact': 'backfires when the true scale emerges' },
          explain: 'Transparency means sharing what you have verified, being clear about what you do not know yet, and committing to regular updates.' },
        { id: 'd3', title: '3. Responsibility', type: 'buttons', options: Object.keys(LINES.d3), correct: 'Accept responsibility',
          info: { 'Blame hackers': 'is technically true but sounds like you are the real victim, not your customers', 'Blame IT team': 'throws your own people under the bus and signals a blame culture', 'Avoid taking a stance': 'sounds evasive' },
          explain: 'Accountability demonstrates integrity: customers trusted you, not your vendor or your IT team.' },
        { id: 'd4', title: '4. Action focus', type: 'buttons', options: Object.keys(LINES.d4), correct: 'Emphasize what you\'re doing',
          info: { 'Emphasize what went wrong': 'dwells on the failure without telling customers what happens next', 'Emphasize it\'s resolved': 'is premature and will be disproven if new facts surface', 'Emphasize competitors have it worse': 'is defensive and minimizes customers\' concerns' },
          explain: 'A solution-focused story tells affected customers what you are doing for them right now.' }
    ],
    resultHtml: (sel, ok) => `
        <div class="card"><h3>Your statement to the press</h3>
            <p class="quote" style="background:#f5f7fa;padding:8px 10px;border-radius:6px;">"${['d1', 'd2', 'd3', 'd4'].map(d => LINES[d][sel[d]]).join(' ')}"</p>
            <p style="margin:6px 0 0 0;">${['d1', 'd2', 'd3', 'd4'].map(d => `<span class="tag ${ok[d] ? 'k-practice' : 'k-advanced'}">${ok[d] ? '\u2713' : '\u2717'} ${PRINCIPLE[d]}</span>`).join(' ')}</p>
            ${['d1', 'd2', 'd3', 'd4'].every(d => ok[d]) ? '<p style="margin:6px 0 0 0;">This response demonstrates acknowledgment, transparency, accountability, and solution focus. Read it aloud: it sounds like a company you could trust again.</p>'
              : '<p style="margin:6px 0 0 0;">Read the statement aloud and listen for the defensive lines. Avoid denial, deflection, and minimizing: each one turns a breach story into a cover-up story.</p>'}
        </div>`,
    summaryNote: 'in a crisis, transparency builds trust and blame destroys it. Both speed and accuracy matter: acknowledge fast with verified facts, take responsibility, and keep the story focused on what you are doing for the people affected.'
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
