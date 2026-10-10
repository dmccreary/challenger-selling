// Brand Alignment Checker - evaluate a story against four brand attributes
// CANVAS_HEIGHT: 760
// Learners rate a draft story as aligned, misaligned, or neutral on each
// brand attribute and explain why. The analysis compares their ratings and
// notes with an expert review and shows a rewritten, on-brand version.

const ATTRS = [
    { id: 'innovation', name: 'Innovation', def: 'forward-thinking, new possibilities', correct: 'Misaligned',
      expert: '"Conservative and risk-averse" is the opposite of forward-thinking.',
      fix: 'Show how long experience lets you adopt new technology safely, instead of avoiding it.' },
    { id: 'reliability', name: 'Reliability', def: 'stability, long-term partnership', correct: 'Aligned',
      expert: '"20 years," "proven," and "customers trust us" all signal stability.',
      fix: 'Keep this, but prove it with a number (uptime, renewal rate) instead of "never fails."' },
    { id: 'customer', name: 'Customer Focus', def: 'customer success, partnership', correct: 'Neutral',
      expert: 'Customers are mentioned, but only as people who trust us, not as people we made successful.',
      fix: 'Make a customer the hero: what did they achieve because of the partnership?' },
    { id: 'technical', name: 'Technical Excellence', def: 'technical depth, expertise', correct: 'Misaligned',
      expert: '"Proven technology" suggests old technology; nothing shows depth or expertise.',
      fix: 'Name one hard technical problem your team solved and how.' }
];

const CONFIG = {
    title: 'Brand Alignment Checker',
    subtitle: 'Rate the draft against each brand attribute and explain your reasoning.',
    height: 760,
    grid: true,
    scoreNoun: 'ratings',
    submitLabel: 'Analyze Alignment',
    contextHtml: `<div class="context"><strong>Brand attributes:</strong> ${ATTRS.map(a => `<strong>${a.name}</strong> (${a.def})`).join(' &middot; ')}
        <br><strong>Story draft:</strong> <em>"We've been in business for 20 years and use proven technology that never fails. Our customers trust us because we're conservative and risk-averse."</em></div>`,
    sections: ATTRS.map(a => ({
        id: a.id, title: `${a.name}: does the story demonstrate it?`, type: 'buttons', options: ['Aligned', 'Neutral', 'Misaligned'], correct: a.correct,
        text: 'Explain: which words support your rating?', explain: a.expert
    })),
    resultHtml: (sel, ok, notes) => `
        <div class="card"><h3>Alignment Analysis</h3>
            <table class="summary">
                <tr><th>Attribute</th><th>You</th><th>Expert</th><th>Your reasoning</th><th>To improve alignment</th></tr>
                ${ATTRS.map(a => `<tr><td>${a.name}</td><td>${ok[a.id] ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>'} ${sel[a.id]}</td><td>${a.correct}</td><td>${notes[a.id].replace(/</g, '&lt;')}</td><td>${a.fix}</td></tr>`).join('')}
            </table>
            <p style="margin:8px 0 0 0;">This story is <strong>aligned</strong> with reliability, <strong>neutral</strong> on customer focus, and <strong>misaligned</strong> with innovation and technical excellence. It describes a different brand than the one in the attribute list.</p>
            <p style="margin:6px 0 0 0;"><strong>On-brand rewrite:</strong> <em>"For 20 years, customers like Northwind Health have trusted us to run systems that can't go down: 99.99% uptime last year. That track record is why, when Northwind needed real-time patient analytics, our engineers could adopt a new streaming architecture in six weeks without a single outage."</em></p>
        </div>`,
    summaryNote: 'brand alignment is about narrative and voice, not logos. A story can be true and well written and still describe the wrong brand. Check every story against all of your brand attributes, not just the one it happens to illustrate.'
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
