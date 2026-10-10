// Strategic Alignment Mapper - map storytelling initiatives to business strategies
// CANVAS_HEIGHT: 700
// Learners map four storytelling initiatives to the business strategy each
// supports, then see an alignment matrix that exposes gaps and doubled-up
// strategies.

const STRATEGIES = ['Market Expansion', 'Premium Positioning', 'Customer Retention', 'Operational Efficiency'];
const STRATEGY_INFO = {
    'Market Expansion': 'win customers in new markets or segments',
    'Premium Positioning': 'justify higher prices through clear differentiation',
    'Customer Retention': 'keep and grow existing customers',
    'Operational Efficiency': 'help customers do more with less'
};

const CONFIG = {
    title: 'Strategic Alignment Mapper',
    subtitle: 'Map each storytelling initiative to the business strategy it supports.',
    height: 700,
    scoreNoun: 'mappings',
    submitLabel: 'Show Alignment Matrix',
    contextHtml: `<div class="context"><strong>This year\'s business strategies:</strong> ${STRATEGIES.map(s => `<strong>${s}</strong> (${STRATEGY_INFO[s]})`).join(' &middot; ')}</div>`,
    grid: true,
    sections: [
        { id: 'i1', title: 'Initiative 1', prompt: '"Success stories about entering the healthcare market."', type: 'select', options: STRATEGIES, correct: 'Market Expansion',
          explain: 'New-market success stories give reps proof they can win in a segment where the company has no track record yet.' },
        { id: 'i2', title: 'Initiative 2', prompt: '"Differentiation-focused case studies emphasizing unique value over competitors."', type: 'select', options: STRATEGIES, correct: 'Premium Positioning',
          explain: 'A premium price only holds when buyers can see value competitors cannot match; differentiation stories make that value visible.' },
        { id: 'i3', title: 'Initiative 3', prompt: '"Customer success journey stories about long-term partnerships."', type: 'select', options: STRATEGIES, correct: 'Customer Retention',
          explain: 'Long-term partnership stories reinforce the decision existing customers already made and open the door to expansion.' },
        { id: 'i4', title: 'Initiative 4', prompt: '"Efficiency improvement stories about reducing costs through our solution."', type: 'select', options: STRATEGIES, correct: 'Operational Efficiency',
          explain: 'Cost-reduction stories speak directly to an efficiency strategy and to buyers measured on doing more with less.' }
    ],
    resultHtml: (sel, ok) => {
        const ids = ['i1', 'i2', 'i3', 'i4'];
        const short = ['Healthcare market entry', 'Differentiation case studies', 'Partnership journeys', 'Cost-reduction stories'];
        const rows = ids.map((id, r) => `<tr><td>${short[r]}</td>${STRATEGIES.map(s => {
            const mine = sel[id] === s;
            const right = CONFIG.sections[r].correct === s;
            const bg = mine && right ? '#c8e6c9' : mine ? '#ffcdd2' : right ? '#fff8e1' : 'white';
            return `<td style="text-align:center;background:${bg};">${mine ? (right ? '&#10003;' : '&#10007;') : right ? '&#9675;' : ''}</td>`;
        }).join('')}</tr>`).join('');
        const counts = STRATEGIES.map(s => ids.filter(id => sel[id] === s).length);
        const gaps = STRATEGIES.filter((s, i) => counts[i] === 0);
        return `<div class="card"><h3>Alignment Matrix</h3>
            <table class="summary"><tr><th>Initiative</th>${STRATEGIES.map(s => `<th style="text-align:center;">${s}</th>`).join('')}</tr>${rows}</table>
            <p style="font-size:0.85em;margin:6px 0 0 0;">&#10003; your correct mapping &nbsp; &#10007; your mapping (misaligned) &nbsp; &#9675; recommended mapping</p>
            ${gaps.length ? `<p style="margin:6px 0 0 0;"><strong>Coverage gap:</strong> with your mapping, no initiative supports <strong>${gaps.join(', ')}</strong>. A strategy with no stories gets no help from the sales team.</p>` : '<p style="margin:6px 0 0 0;">Every strategy is supported by at least one initiative.</p>'}
        </div>`;
    },
    summaryNote: 'not every story supports every strategy; strategy decides which stories to invest in. Alignment is also not a one-time exercise: revisit the matrix whenever strategy shifts, and at least every quarter.'
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
