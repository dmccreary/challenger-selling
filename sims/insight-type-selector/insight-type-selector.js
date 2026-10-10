// Insight Type Selector - choose the insight type for each customer mindset
// CANVAS_HEIGHT: 740
// Learners choose a Warmer, Rational Drowning, or Rock Star insight for three
// customer scenarios, explain their choice, and see an example of the right
// insight applied to the scenario.

const CONFIG = {
    title: 'Insight Type Selector',
    subtitle: 'Select the insight type that fits each customer\'s mindset, and explain why.',
    height: 740,
    itemLabel: 'Scenario',
    fields: [
        { id: 'type', label: 'Insight Type', type: 'buttons', options: ['Warmer', 'Rational Drowning', 'Rock Star'] },
        { id: 'why', label: 'Explain your choice', type: 'text', placeholder: 'Briefly explain why this insight type fits the customer\'s mindset...' }
    ],
    optionInfo: {
        type: {
            'Warmer': 'shows the customer they are behind peers or competitors on something that matters',
            'Rational Drowning': 'cuts through overload by showing the few factors that actually matter',
            'Rock Star': 'frames the problem as a path to breakthrough, top-tier performance'
        }
    },
    items: [
        {
            short: 'Proud market leader',
            text: 'A customer is proud of their market leadership position. They believe they\'re ahead of competitors and dismiss the need for change. They\'re confident and resistant to suggestions that they\'re falling behind.',
            correct: { type: 'Warmer' },
            example: '"Seven of your top ten competitors moved to real-time demand sensing in the last 18 months, and they\'re now shipping to retailers two days faster than you."',
            reason: 'This scenario calls for a <strong>Warmer</strong> insight because a confident leader needs evidence that competitors are quietly moving ahead. Comfort is the obstacle, and peer data breaks it.',
            why: 'Confidence is the obstacle; show they are falling behind.'
        },
        {
            short: 'Analysis paralysis',
            text: 'A customer is overwhelmed by technology options. They\'re evaluating 15 different products, comparing features endlessly, and can\'t make a decision. They\'re drowning in data and stuck in analysis paralysis.',
            correct: { type: 'Rational Drowning' },
            example: '"Of the 200 features you\'re comparing, three predict success in companies like yours: integration with your ERP, time to first value, and admin effort. Here\'s how the 15 options stack up on just those three."',
            reason: 'This scenario calls for a <strong>Rational Drowning</strong> insight because an overwhelmed buyer needs simplification: the few factors that actually matter, not more information.',
            why: 'Overload is the obstacle; simplify to what matters.'
        },
        {
            short: 'Good but ambitious',
            text: 'A customer has achieved good results but wants to be exceptional. They\'re performing above average but have ambitions to be in the top tier of their industry. They\'re motivated by excellence and recognition.',
            correct: { type: 'Rock Star' },
            example: '"The top 10% of manufacturers in your segment share one trait you don\'t have yet: they predict equipment failures instead of reacting to them. Closing that gap is what separates very good from best-in-class."',
            reason: 'This scenario calls for a <strong>Rock Star</strong> insight because an ambitious customer responds to a path to breakthrough performance. Appealing to ambition is not arrogance when it matches what they want.',
            why: 'Ambition is the lever; show the path to the top tier.'
        }
    ],
    resultHtml: (it, sel) => `<div class="result"><strong>Example ${it.correct.type} insight for this customer:</strong> <em>${it.example}</em><br><strong>Your explanation:</strong> ${sel.why.replace(/</g, '&lt;')}</div>`,
    summaryNote: 'different insight types suit different customer mindsets. Use a Warmer when the customer is comfortable and competitive pressure is real, Rational Drowning when they are overwhelmed, and Rock Star when they are ambitious. No single type is always best.'
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
