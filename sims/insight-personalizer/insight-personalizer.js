// Insight Personalizer - tailor one Challenger insight for three stakeholders
// CANVAS_HEIGHT: 700
// Learners choose an emphasis and a supporting context for each stakeholder.
// The insight is rewritten live from their choices so they can see how the
// same fact lands differently.

const BASE_INSIGHT = 'Organizations that maintain legacy data systems spend 40% of their IT budget on maintenance rather than innovation, blocking their ability to compete effectively.';

const EMPHASIS_TEXT = {
    'Cost savings': 'That 40% is money spent keeping old systems alive, not money returned to the business.',
    'Competitive advantage': 'Every dollar spent maintaining legacy systems is a dollar your competitors are spending on shipping new capabilities faster.',
    'Operational efficiency': 'Legacy systems create manual workarounds, duplicate data entry, and slow processes that drag down day-to-day operations.',
    'Strategic positioning': 'Legacy spending locks in today\'s strategy and makes it harder to reposition the organization for the next market shift.'
};

const CONTEXT_TEXT = {
    'Industry benchmark': 'Peers in your industry that modernized report shifting a large share of that budget back to innovation.',
    'Financial metrics': 'For a $10M IT budget, that is $4M a year in maintenance; cutting it in half frees $2M with a payback period under 18 months.',
    'Case study': 'One fast-growing software company retired its legacy data stack and cut its feature release cycle from quarterly to weekly.',
    'Risk scenario': 'Aging systems are also where compliance gaps and outages hide; one failed audit or a day of downtime can cost more than modernization.'
};

const CONFIG = {
    title: 'Insight Personalizer',
    subtitle: 'Tailor one insight by choosing what to emphasize and what context to provide.',
    height: 700,
    itemLabel: 'Stakeholder',
    contextHtml: `<div class="context"><strong>Base insight:</strong> "${BASE_INSIGHT}"</div>`,
    fields: [
        { id: 'emphasis', label: 'Emphasis', options: Object.keys(EMPHASIS_TEXT) },
        { id: 'context', label: 'Context', options: Object.keys(CONTEXT_TEXT) }
    ],
    optionInfo: {
        emphasis: {
            'Cost savings': 'speaks to leaders measured on cost and ROI, such as a CFO',
            'Competitive advantage': 'speaks to leaders measured on innovation and speed, such as a startup CTO',
            'Operational efficiency': 'speaks to leaders who run daily operations, such as a COO',
            'Strategic positioning': 'speaks to leaders who set long-term direction, such as a CEO'
        },
        context: {
            'Industry benchmark': 'helps when a stakeholder wants to know how they compare to peers',
            'Financial metrics': 'helps a stakeholder who thinks in dollars, payback, and ROI',
            'Case study': 'helps a stakeholder who wants proof that a similar company succeeded',
            'Risk scenario': 'helps a stakeholder in a regulated or high-stakes environment'
        }
    },
    items: [
        {
            short: 'Manufacturing CFO',
            text: 'CFO at a manufacturing company &ndash; focused on cost reduction and ROI.',
            correct: { emphasis: 'Cost savings', context: 'Financial metrics' },
            reason: 'For this CFO, emphasize <strong>Cost savings</strong> with <strong>Financial metrics</strong>. This addresses their priority of cost reduction and ROI in the language they use every day.',
            why: 'Priority: cost reduction and ROI.'
        },
        {
            short: 'Startup CTO',
            text: 'CTO at a technology startup &ndash; focused on innovation capability and speed.',
            correct: { emphasis: 'Competitive advantage', context: 'Case study' },
            reason: 'For this CTO, emphasize <strong>Competitive advantage</strong> with a <strong>Case study</strong>. This addresses their priority of innovation speed with proof that a similar company moved faster.',
            why: 'Priority: innovation capability and speed.'
        },
        {
            short: 'Healthcare COO',
            text: 'COO at a healthcare company &ndash; focused on operational efficiency and compliance.',
            correct: { emphasis: 'Operational efficiency', context: 'Risk scenario' },
            reason: 'For this COO, emphasize <strong>Operational efficiency</strong> with a <strong>Risk scenario</strong>. This addresses their priorities of smooth operations and compliance in a regulated industry.',
            why: 'Priority: efficient, compliant operations.'
        }
    ],
    resultHtml: (it, sel) => `<div class="result"><strong>Your personalized insight for the ${it.short}:</strong><br>"${BASE_INSIGHT.replace(/\.$/, '')}. ${EMPHASIS_TEXT[sel.emphasis]} ${CONTEXT_TEXT[sel.context]}"</div>`,
    summaryNote: 'personalization is more than adding a name. The fact stays the same; the emphasis and supporting context change to match each stakeholder\'s priorities, and that is what makes the insight land.'
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
            C.fields.forEach(f => { ok[f.id] = sel[f.id] === it.correct[f.id]; });
            const allOk = C.fields.every(f => ok[f.id]);
            if (!results[index]) results[index] = { firstTryCorrect: allOk, sel: Object.assign({}, sel) };

            let html;
            if (allOk) {
                html = `<div class="feedback ok"><strong>Correct!</strong> ${it.reason}</div>`;
            } else {
                const parts = C.fields.map(f => {
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
        const head = `<tr><th>#</th><th>${C.itemLabel}</th>${C.fields.map(f => `<th>${f.label}</th>`).join('')}<th>Why</th></tr>`;
        const rows = C.items.map((it, i) => {
            const mark = results[i].firstTryCorrect ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>';
            return `<tr><td>${mark} ${i + 1}</td><td>${it.short}</td>` +
                C.fields.map(f => `<td><strong>${esc(it.correct[f.id])}</strong></td>`).join('') +
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
