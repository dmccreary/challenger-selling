// Stakeholder Mapping Tool - classify stakeholders by buyer type and influence type
// CANVAS_HEIGHT: 640
// Learners categorize four university stakeholders by buyer type (Economic,
// Technical, User) and influence type (Coach, Mobilizer, Skeptic, Friend),
// then see a prioritization summary of whom to engage and how.

const CONFIG = {
    title: 'Stakeholder Mapping Tool',
    subtitle: 'You\'re selling an intelligent textbook platform to a university. Categorize each stakeholder.',
    height: 640,
    itemLabel: 'Stakeholder',
    fields: [
        { id: 'buyer', label: 'Buyer Type', options: ['Economic Buyer', 'Technical Buyer', 'User Buyer'] },
        { id: 'influence', label: 'Influence Type', options: ['Coach', 'Mobilizer', 'Skeptic', 'Friend'] }
    ],
    optionInfo: {
        buyer: {
            'Economic Buyer': 'controls the budget and makes the final purchasing decision',
            'Technical Buyer': 'judges technical fit, security, and integration',
            'User Buyer': 'works with the solution day to day and cares about usability and outcomes'
        },
        influence: {
            'Coach': 'guides you through the organization, shares information, and opens doors',
            'Mobilizer': 'actively drives change and builds coalitions',
            'Skeptic': 'questions assumptions and demands evidence',
            'Friend': 'is supportive but does not actively push the decision forward'
        }
    },
    items: [
        {
            heading: 'Dr. Martinez, CFO', short: 'Dr. Martinez, CFO',
            text: 'Controls the budget for all technology purchases. Asks about ROI and cost savings in every conversation.',
            correct: { buyer: 'Economic Buyer', influence: 'Skeptic' },
            reason: 'Dr. Martinez is an <strong>Economic Buyer</strong> because she controls the budget, and a <strong>Skeptic</strong> because she demands financial evidence every time. Skeptics are not opponents: arm her with data and she can become an advocate.',
            why: 'Lead with quantified ROI and risk.'
        },
        {
            heading: 'Professor Chen, CS Department Chair', short: 'Professor Chen',
            text: 'Wants to improve student engagement and outcomes. Actively advocates for modernizing course materials.',
            correct: { buyer: 'User Buyer', influence: 'Mobilizer' },
            reason: 'Professor Chen is a <strong>User Buyer</strong> because his department will use the platform daily, and a <strong>Mobilizer</strong> because he actively advocates for change rather than just liking the idea.',
            why: 'Equip him to build the coalition.'
        },
        {
            heading: 'Director Johnson, CTO', short: 'Director Johnson, CTO',
            text: 'Evaluates technical fit, security, and integration with the existing LMS. "Will your system work with our current infrastructure?"',
            correct: { buyer: 'Technical Buyer', influence: 'Skeptic' },
            reason: 'Director Johnson is a <strong>Technical Buyer</strong> because he judges fit, security, and integration, and a <strong>Skeptic</strong> because he is testing whether your claims hold up.',
            why: 'Answer integration and security concerns with proof.'
        },
        {
            heading: 'Sarah, Instructional Designer', short: 'Sarah, Instructional Designer',
            text: 'Works in the Center for Teaching Excellence. Gave feedback on the demo and introduced you to other department chairs. She\'s been helpful throughout the process.',
            correct: { buyer: 'User Buyer', influence: 'Coach' },
            reason: 'Sarah is a <strong>User Buyer</strong> because she designs courses on the platform, and a <strong>Coach</strong> because she guides you and opens doors. A Friend would be supportive but would not make introductions.',
            why: 'Ask her how decisions really get made.'
        }
    ],
    summaryNote: 'every stakeholder type matters, not just the economic buyer. Prioritize Mobilizers (Professor Chen) and Coaches (Sarah) to build momentum, and win over Skeptics (Dr. Martinez, Director Johnson) with data rather than avoiding them. Mobilizers drive change; Friends only support it.'
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
