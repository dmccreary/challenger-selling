// Adaptive Learning Path Designer - route students to remedial, standard, or advanced paths
// CANVAS_HEIGHT: 560
// Learners read a student performance scenario and choose the adaptive path.
// Feedback explains which performance signals drove the decision.

const CONFIG = {
    title: 'Adaptive Learning Path Designer',
    subtitle: 'Use the performance data to choose the next step for each student.',
    height: 560,
    itemLabel: 'Student',
    fields: [{
        id: 'path', label: 'Adaptive Path', type: 'buttons',
        options: [
            'Remedial: Re-read fundamentals + practice quiz',
            'Standard: Continue to next concept',
            'Advanced: Advanced storytelling techniques + creative exercises'
        ]
    }],
    optionInfo: {
        path: {
            'Remedial: Re-read fundamentals + practice quiz': 'fits a student whose score and time-on-task show the foundation is not yet in place',
            'Standard: Continue to next concept': 'fits a student who has shown solid mastery and is ready for the next concept in sequence',
            'Advanced: Advanced storytelling techniques + creative exercises': 'fits a student who has shown near-perfect mastery and is asking for more challenge'
        }
    },
    items: [
        {
            short: '40% score, 2 minutes',
            text: 'A student scored 40% on the Storytelling Fundamentals quiz and spent 2 minutes on the section.',
            correct: { path: 'Remedial: Re-read fundamentals + practice quiz' },
            reason: 'This student needs the <strong>Remedial</strong> path. A 40% score plus only 2 minutes on the section signals they skimmed it; moving on would build new concepts on a missing foundation.',
            why: 'Low score + low engagement = foundation missing.'
        },
        {
            short: '85% score, 10 minutes with MicroSim',
            text: 'A student scored 85% on the Storytelling Fundamentals quiz and spent 10 minutes engaging with the MicroSim.',
            correct: { path: 'Standard: Continue to next concept' },
            reason: 'This student needs the <strong>Standard</strong> path. 85% with real engagement shows mastery, but there is no signal they want or need to skip ahead.',
            why: 'Solid mastery, no request for challenge.'
        },
        {
            short: '95%, perfect MicroSim, wants more',
            text: 'A student scored 95% on the Storytelling Fundamentals quiz, completed the MicroSim perfectly, and asked for more challenging content.',
            correct: { path: 'Advanced: Advanced storytelling techniques + creative exercises' },
            reason: 'This student needs the <strong>Advanced</strong> path. Three signals agree: a near-perfect score, flawless MicroSim work, and an explicit request for challenge. Keeping them on the standard path risks boredom.',
            why: 'Excelling and explicitly asking for challenge.'
        }
    ],
    summaryNote: 'adaptive learning personalizes content based on performance so each student stays in their optimal learning zone. Advanced students benefit from adaptation as much as struggling ones, and paths can branch at every checkpoint.'
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
