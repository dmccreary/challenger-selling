// Testing Strategy Selector - match testing scenarios to testing types
// CANVAS_HEIGHT: 560
// Learners choose unit, integration, system, or user acceptance testing for
// four story-platform testing scenarios.

const CONFIG = {
    title: 'Testing Strategy Selector',
    subtitle: 'Which type of testing fits each scenario?',
    height: 560,
    itemLabel: 'Scenario',
    contextHtml: '<div class="context"><strong>Testing levels, smallest to largest:</strong> Unit (one piece) &rarr; Integration (pieces working together) &rarr; System (the whole workflow) &rarr; UAT (real users, real tasks)</div>',
    fields: [{ id: 'type', label: 'Testing Type', type: 'buttons', options: ['Unit Test', 'Integration Test', 'System Test', 'UAT'] }],
    optionInfo: {
        type: {
            'Unit Test': 'checks one component by itself, isolated from everything else',
            'Integration Test': 'checks that two or more components or systems exchange data correctly',
            'System Test': 'checks the complete workflow end-to-end in a production-like environment',
            'UAT': 'has real users confirm the system works for their actual tasks before launch'
        }
    },
    items: [
        {
            short: 'New component in isolation',
            text: 'Testing a new story component (the "social proof" block renderer) in isolation.',
            correct: { type: 'Unit Test' },
            reason: 'This scenario calls for <strong>unit</strong> testing because the component is tested alone. Unit tests are fast and pinpoint exactly which piece broke.',
            why: 'One piece, isolated, fast.'
        },
        {
            short: 'Components + CRM',
            text: 'Testing how story components exchange data with the CRM.',
            correct: { type: 'Integration Test' },
            reason: 'This scenario calls for <strong>integration</strong> testing because the risk lives at the boundary: field mappings, authentication, and data formats between the story platform and the CRM. Each side can pass its unit tests and still fail together.',
            why: 'Defects hide at the boundaries.'
        },
        {
            short: 'Whole workflow end-to-end',
            text: 'Testing the complete story creation workflow end-to-end, from draft to approval to publication in the library.',
            correct: { type: 'System Test' },
            reason: 'This scenario calls for <strong>system</strong> testing because it exercises the entire workflow as one system, catching problems no single integration test would reveal.',
            why: 'The whole workflow at once.'
        },
        {
            short: 'Real salespeople before launch',
            text: 'Testing with actual salespeople before deployment.',
            correct: { type: 'UAT' },
            reason: 'This scenario calls for <strong>user acceptance testing (UAT)</strong> because only real reps can confirm the tool fits how they actually sell. A system can pass every technical test and still be unusable in the field.',
            why: 'Real users validate real-world fit.'
        }
    ],
    summaryNote: 'each testing type catches different defects, so unit testing alone is never enough. Build from unit to integration to system tests, and never skip UAT: it is the only test that proves salespeople will actually use the stories.'
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
