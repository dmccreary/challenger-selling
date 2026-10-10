// Story Customizer - choose what to customize and how deeply for each buyer
// CANVAS_HEIGHT: 700
// Learners choose which customization elements to apply and the level of
// personalization for three buyers. The base story is rewritten from their
// choices so they can compare light, medium, and deep versions.

const BASE = 'A company in [industry] achieved [result] by addressing [challenge]. They used [solution] to overcome [obstacle].';

const BUYERS = [
    { industry: 'a regional healthcare system', result: 'a $3.1M reduction in annual IT operating cost', challenge: 'spending on aging infrastructure', persona: 'with an 11-month payback and lower total cost of ownership', example: 'At Mercy Valley Health, the CFO signed off after a 60-day pilot.', deep: 'For your board\'s 2025 cost-containment target, that is roughly a third of the gap.' },
    { industry: 'a Series B fintech startup', result: 'feature releases that went from monthly to weekly', challenge: 'a slow, manual deployment pipeline', persona: 'with no added headcount and faster iteration', example: 'Ledgerly\'s engineering team moved 40 services in six weeks without a code freeze.', deep: 'That is the release pace your roadmap needs to ship the payments launch before Q3.' },
    { industry: 'a mid-size industrial manufacturer', result: 'a 4-point market share gain in two years', challenge: 'competitors with faster delivery times', persona: 'by turning operations into a competitive advantage', example: 'Hartwell Components\' CEO now uses delivery speed as the lead message in every major bid.', deep: 'Given your plan to enter the Southeast market next year, the same approach would let you compete on speed from day one.' }
];

function customized(i, sel) {
    const b = BUYERS[i];
    const usePers = /Persona|All three/.test(sel.elements);
    const useEx = /Specific examples|All three/.test(sel.elements);
    let s = `A company in ${b.industry} achieved ${b.result}${usePers ? ' ' + b.persona : ''} by addressing ${b.challenge}.`;
    if (sel.level !== 'Light' && useEx) s += ' ' + b.example;
    if (sel.level === 'Deep') s += ' ' + b.deep;
    return s;
}

const CONFIG = {
    title: 'Story Customizer',
    subtitle: 'Decide what to customize, and how deeply, for each buyer.',
    height: 700,
    itemLabel: 'Buyer',
    contextHtml: `<div class="context"><strong>Base story:</strong> "${BASE}"</div>`,
    fields: [
        { id: 'elements', label: 'Customize', options: ['Industry reference only', 'Industry reference + Persona language', 'Industry reference + Specific examples', 'All three'] },
        { id: 'level', label: 'Personalization Level', type: 'buttons', options: ['Light', 'Medium', 'Deep'] }
    ],
    optionInfo: {
        elements: {
            'Industry reference only': 'makes the story relevant but still speaks generically',
            'Industry reference + Persona language': 'puts the story in the buyer\'s world and in the language they use to judge decisions',
            'Industry reference + Specific examples': 'adds a concrete, named proof point that a time-pressed technical buyer can verify',
            'All three': 'is the most powerful but also the most work, so save it for high-stakes relationships'
        },
        level: {
            'Light': 'swaps in labels such as the industry name and little else',
            'Medium': 'adapts the content to the buyer without hours of research',
            'Deep': 'ties the story to this specific buyer\'s strategy and plans, which takes research'
        }
    },
    items: [
        {
            short: 'Healthcare CFO',
            text: 'CFO at a healthcare company &ndash; busy, data-driven, needs financial justification.',
            correct: { elements: 'Industry reference + Persona language', level: 'Medium' },
            reason: 'For this CFO, <strong>industry reference + persona language</strong> at a <strong>medium</strong> level is right: put the story in healthcare and speak in payback and TCO, but keep it tight because the CFO is busy.',
            why: 'Speak finance, keep it short.'
        },
        {
            short: 'Startup CTO',
            text: 'CTO at a technology startup &ndash; innovative, time-constrained, values speed.',
            correct: { elements: 'Industry reference + Specific examples', level: 'Medium' },
            reason: 'For this CTO, <strong>industry reference + specific examples</strong> at a <strong>medium</strong> level works: a named peer company with concrete numbers is more persuasive to a technologist than adjectives, and it stays quick to read.',
            why: 'A concrete peer example beats adjectives.'
        },
        {
            short: 'Manufacturing CEO',
            text: 'CEO at a manufacturing company &ndash; strategic, relationship-focused, wants competitive advantage.',
            correct: { elements: 'All three', level: 'Deep' },
            reason: 'For this CEO, <strong>all three</strong> at a <strong>deep</strong> level is worth the effort: a strategic, relationship-focused executive expects you to connect the story to their own plans, and the deal is large enough to justify the research.',
            why: 'High stakes justify deep personalization.'
        }
    ],
    resultHtml: (it, sel) => {
        const i = CONFIG.items.indexOf(it);
        return `<div class="result"><strong>Your customized story (${sel.level.toLowerCase()}):</strong> "${customized(i, sel)}"</div>`;
    },
    summaryNote: 'customization adapts content, not just labels. Deeper is not always better: match the depth to the buyer\'s time and the size of the opportunity, and save deep personalization for the relationships that justify it.'
};

// ---------------------------------------------------------------------------
// Step-through scenario engine: one scenario at a time, learner selections,
// Submit -> feedback, Next -> following scenario, then a summary table.
// Only the first submission for each scenario counts toward the score.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const C = CONFIG;
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', C.height + 'px');
    main.appendChild(app);

    let index = 0;
    const results = [];
    const n = C.items.length;
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const optsFor = (it, f) => (it.options && it.options[f.id]) || f.options;
    const graded = C.fields.filter(f => f.type !== 'text');
    const info = (f, v) => (C.optionInfo && C.optionInfo[f.id] && C.optionInfo[f.id][v]) || '';

    function progressDots() {
        return '<div class="progress">' + C.items.map((s, i) => {
            let cls = 'dot';
            if (results[i]) cls += results[i].firstTryCorrect ? ' right' : ' wrong';
            else if (i === index) cls += ' current';
            return `<div class="${cls}">${i + 1}</div>`;
        }).join('') + '</div>';
    }

    function fieldHtml(f, opts) {
        if (f.type === 'text') {
            return `<div class="field full"><label for="f-${f.id}">${f.label}</label>` +
                `<textarea id="f-${f.id}" data-field="${f.id}" rows="2" placeholder="${esc(f.placeholder || '')}"></textarea></div>`;
        }
        if (f.type === 'buttons') {
            return `<div class="field full"><label>${f.label}</label><div class="choice-row" data-field="${f.id}">` +
                opts.map(o => `<button type="button" class="choice" data-value="${esc(o)}">${esc(o)}</button>`).join('') +
                '</div></div>';
        }
        return `<div class="field"><label for="f-${f.id}">${f.label}</label><select id="f-${f.id}" data-field="${f.id}">` +
            '<option value="">-- choose --</option>' +
            opts.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('') + '</select></div>';
    }

    function renderItem() {
        const it = C.items[index];
        const sel = {};
        app.innerHTML = `
            <h2>${C.title}</h2>
            <p class="subtitle">${C.subtitle}</p>
            ${C.contextHtml || ''}
            ${progressDots()}
            <div class="card">
                <h3>${C.itemLabel} ${index + 1} of ${n}${it.heading ? ': ' + it.heading : ''}</h3>
                <p class="quote">${it.text}</p>
            </div>
            <div class="field-row">${C.fields.map(f => fieldHtml(f, optsFor(it, f))).join('')}</div>
            <div class="btn-row">
                <button id="submit" disabled>Submit</button>
                <button id="next" class="secondary hidden">${index < n - 1 ? 'Next ' + C.itemLabel : 'See Summary'}</button>
            </div>
            <div id="feedback"></div>
        `;
        const submit = app.querySelector('#submit');
        const next = app.querySelector('#next');
        const fb = app.querySelector('#feedback');
        const updateSubmit = () => { submit.disabled = !C.fields.every(f => sel[f.id]); };

        app.querySelectorAll('select[data-field]').forEach(s => s.addEventListener('change', () => {
            sel[s.dataset.field] = s.value;
            updateSubmit();
        }));
        app.querySelectorAll('textarea[data-field]').forEach(t => t.addEventListener('input', () => {
            sel[t.dataset.field] = t.value.trim().length >= 3 ? t.value.trim() : '';
            updateSubmit();
        }));
        app.querySelectorAll('.choice-row').forEach(row => row.querySelectorAll('button.choice').forEach(b => {
            b.addEventListener('click', () => {
                row.querySelectorAll('button.choice').forEach(x => x.classList.remove('selected'));
                b.classList.add('selected');
                sel[row.dataset.field] = b.dataset.value;
                updateSubmit();
            });
        }));

        submit.addEventListener('click', () => {
            const ok = {};
            graded.forEach(f => { ok[f.id] = sel[f.id] === it.correct[f.id]; });
            const allOk = graded.every(f => ok[f.id]);
            if (!results[index]) results[index] = { firstTryCorrect: allOk, sel: Object.assign({}, sel) };

            let html;
            if (allOk) {
                html = `<div class="feedback ok"><strong>Correct!</strong> ${it.reason}</div>`;
            } else {
                const parts = graded.map(f => {
                    if (ok[f.id]) return `<strong>${f.label}:</strong> ${esc(sel[f.id])} is right.`;
                    const why = info(f, sel[f.id]);
                    return `<strong>${f.label}:</strong> you chose ${esc(sel[f.id])}${why ? ', which ' + why : ''}. The better choice is <strong>${esc(it.correct[f.id])}</strong>.`;
                });
                html = `<div class="feedback bad"><strong>Not quite.</strong> ${parts.join(' ')}<br>${it.reason}` +
                    '<br><em>Change your selections and submit again to compare, or move on.</em></div>';
            }
            if (C.resultHtml) {
                const res = C.resultHtml(it, sel, allOk);
                html = C.resultBeside ? `<div class="two-col">${res}${html}</div>` : res + html;
            }
            fb.innerHTML = html;
            next.classList.remove('hidden');
            const old = app.querySelector('.progress');
            if (old) old.outerHTML = progressDots();
        });

        next.addEventListener('click', () => {
            index++;
            if (index < n) renderItem(); else renderSummary();
        });
    }

    function renderSummary() {
        const score = results.filter(r => r.firstTryCorrect).length;
        const head = `<tr><th>#</th><th>${C.itemLabel}</th>${graded.map(f => `<th>${f.label}</th>`).join('')}<th>Why</th></tr>`;
        const rows = C.items.map((it, i) => {
            const mark = results[i].firstTryCorrect ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>';
            return `<tr><td>${mark} ${i + 1}</td><td>${it.short}</td>` +
                graded.map(f => `<td><strong>${esc(it.correct[f.id])}</strong></td>`).join('') +
                `<td>${it.why}</td></tr>`;
        }).join('');
        app.innerHTML = `
            <h2>${C.title}: Summary</h2>
            <p class="subtitle">First-try score: <strong>${score} of ${n}</strong>${score === n ? ' (mastery)' : ''}</p>
            <table class="summary">${head}${rows}</table>
            <div class="feedback warn" style="margin-top:10px;"><strong>Remember:</strong> ${C.summaryNote}</div>
            <div class="btn-row"><button id="restart">Start Over</button></div>
        `;
        app.querySelector('#restart').addEventListener('click', () => {
            index = 0;
            results.length = 0;
            renderItem();
        });
    }

    renderItem();
});
