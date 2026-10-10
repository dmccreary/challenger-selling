// Story Library Organizer - tag customer stories on five retrieval dimensions
// CANVAS_HEIGHT: 700
// Learners tag six stories by industry, persona, objection, deal stage, and
// product. Each tagged story is shown as a library card so learners see how
// multiple tags make one story findable from many different searches.

const CONFIG = {
    title: 'Story Library Organizer',
    subtitle: 'Tag each story on all five dimensions so reps can find it from any search.',
    height: 700,
    itemLabel: 'Story',
    fields: [
        { id: 'industry', label: 'Industry', options: ['Healthcare', 'Manufacturing', 'Retail', 'Financial Services', 'Technology'] },
        { id: 'persona', label: 'Persona', options: ['CIO', 'CFO', 'CTO', 'COO', 'VP of Sales'] },
        { id: 'objection', label: 'Objection', options: ['Timing', 'Price', 'Competitor', 'Risk', 'Status quo'] },
        { id: 'stage', label: 'Deal Stage', options: ['Early', 'Mid', 'Late'] },
        { id: 'product', label: 'Product', options: ['Analytics', 'IoT', 'AI', 'Security', 'Cloud'] }
    ],
    optionInfo: {
        objection: {
            'Timing': 'answers "this is not the right time"',
            'Price': 'answers "it costs too much"',
            'Competitor': 'answers "we are also looking at another vendor"',
            'Risk': 'answers "changing is too risky"',
            'Status quo': 'answers "what we have works well enough"'
        },
        stage: {
            'Early': 'fits first meetings and prospecting',
            'Mid': 'fits discovery and evaluation',
            'Late': 'fits negotiation and final approval'
        }
    },
    items: [
        {
            short: 'Healthcare wait times',
            text: '"A healthcare CIO reduced patient wait times by 30% using predictive analytics." <br><span style="font-style:normal;">Reps use it in discovery calls when a hospital IT leader says the project can wait until next year.</span>',
            correct: { industry: 'Healthcare', persona: 'CIO', objection: 'Timing', stage: 'Mid', product: 'Analytics' },
            reason: 'The protagonist sets the <strong>industry</strong> and <strong>persona</strong>; the moment reps reach for it ("can wait until next year" during discovery) sets the <strong>objection</strong> and <strong>stage</strong>; the solution sets the <strong>product</strong>.',
            why: 'Shows the cost of waiting, mid-funnel.'
        },
        {
            short: 'Predictive maintenance savings',
            text: '"A manufacturing CFO saved $2M annually through IoT-based predictive maintenance." <br><span style="font-style:normal;">Reps use it in contract negotiation when finance pushes back on the price.</span>',
            correct: { industry: 'Manufacturing', persona: 'CFO', objection: 'Price', stage: 'Late', product: 'IoT' },
            reason: 'A hard-dollar result told by a CFO is the classic answer to a <strong>Price</strong> objection, and negotiation is the <strong>Late</strong> stage.',
            why: 'Hard-dollar proof for a late price objection.'
        },
        {
            short: 'Retail conversion lift',
            text: '"A retail VP of Sales increased conversion by 25% with AI-powered personalized recommendations." <br><span style="font-style:normal;">Reps use it in first meetings when the buyer mentions they are already talking to a competitor.</span>',
            correct: { industry: 'Retail', persona: 'VP of Sales', objection: 'Competitor', stage: 'Early', product: 'AI' },
            reason: 'First meetings are the <strong>Early</strong> stage, and the story differentiates against a <strong>Competitor</strong> by leading with a result the other vendor cannot claim.',
            why: 'Differentiation in the first meeting.'
        },
        {
            short: 'Zero breaches after cloud move',
            text: '"A financial services CTO moved fraud monitoring to a modern security platform and has had zero breaches in two years." <br><span style="font-style:normal;">Reps use it during technical evaluation when the buyer worries that switching platforms is too risky.</span>',
            correct: { industry: 'Financial Services', persona: 'CTO', objection: 'Risk', stage: 'Mid', product: 'Security' },
            reason: 'Technical evaluation is the <strong>Mid</strong> stage, and two breach-free years answers the <strong>Risk</strong> objection directly.',
            why: 'Proof that change was safe.'
        },
        {
            short: 'Data center consolidation',
            text: '"A technology company COO consolidated 14 data centers into the cloud and cut operating costs by 35%." <br><span style="font-style:normal;">Reps use it when prospecting operations leaders who say their current setup works fine.</span>',
            correct: { industry: 'Technology', persona: 'COO', objection: 'Status quo', stage: 'Early', product: 'Cloud' },
            reason: '"Our current setup works fine" is the <strong>Status quo</strong> objection, and prospecting is the <strong>Early</strong> stage, where Challenger insights disrupt that comfort.',
            why: 'Disrupts status-quo thinking early.'
        },
        {
            short: 'Inventory write-offs',
            text: '"A retail CFO cut inventory write-offs by 18% in one season using demand-forecasting analytics." <br><span style="font-style:normal;">Reps use it at final approval when the CFO asks to delay signing until next quarter.</span>',
            correct: { industry: 'Retail', persona: 'CFO', objection: 'Timing', stage: 'Late', product: 'Analytics' },
            reason: 'Final approval is the <strong>Late</strong> stage, and "delay until next quarter" is a <strong>Timing</strong> objection. Notice that this story shares tags with Stories 1 and 3: tags are not exclusive categories.',
            why: 'Shows what one more quarter of delay costs.'
        }
    ],
    resultHtml: (it, sel) => `<div class="result"><strong>Library card:</strong> ${it.short}<br>` +
        CONFIG.fields.map(f => `<span class="tag k-practice" style="margin:2px 4px 2px 0;">${f.label}: ${sel[f.id]}</span>`).join('') +
        `<br><em>Retrievable when a rep searches for any of: ${CONFIG.fields.map(f => sel[f.id]).join(', ')}.</em></div>`,
    summaryNote: 'one story usually belongs under several tags at once. Tagging every story on the same dimensions lets a rep find "a late-stage price story for a manufacturing CFO" in seconds. Industry and persona usually matter most for relevance; objection and stage matter most for timing.'
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
