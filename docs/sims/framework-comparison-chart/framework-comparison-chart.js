// Framework Comparison Chart - compare TensorFlow, PyTorch, and Scikit-learn
// CANVAS_HEIGHT: 640
// Learners review a comparison chart, then apply it to three selection
// scenarios. Feedback ties each answer back to a row of the chart.

const CONFIG = {
    title: 'Framework Comparison Chart',
    subtitle: 'Review the chart, then pick the best framework for each scenario.',
    height: 640,
    itemLabel: 'Question',
    contextHtml: `
        <table class="compare">
            <tr><th>Framework</th><th>Strengths</th><th>Best For</th><th>Skill Level</th></tr>
            <tr><td><strong>TensorFlow</strong></td><td>Production deployment, scalability</td><td>Large-scale ML, production systems</td><td>Intermediate&ndash;Advanced</td></tr>
            <tr><td><strong>PyTorch</strong></td><td>Research flexibility, ease of use</td><td>Research, experimentation, rapid prototyping</td><td>Beginner&ndash;Intermediate</td></tr>
            <tr><td><strong>Scikit-learn</strong></td><td>Simplicity, broad algorithm coverage</td><td>Traditional ML, quick prototyping</td><td>Beginner</td></tr>
        </table>`,
    fields: [{ id: 'fw', label: 'Framework', type: 'buttons', options: ['TensorFlow', 'PyTorch', 'Scikit-learn'] }],
    optionInfo: {
        fw: {
            'TensorFlow': 'shines when a model must be deployed and scaled in production',
            'PyTorch': 'shines when researchers need to experiment with new neural network designs',
            'Scikit-learn': 'shines for traditional ML (regression, trees, clustering) with minimal setup'
        }
    },
    items: [
        {
            short: 'Quick traditional ML proof-of-concept',
            text: 'A team wants to quickly prototype a traditional ML model for a proof-of-concept. Which framework is best?',
            correct: { fw: 'Scikit-learn' },
            reason: '<strong>Scikit-learn</strong> is best for a quick traditional-ML prototype because it offers dozens of ready-made algorithms behind one simple API, and it does not require deep learning expertise.',
            why: 'Simplicity and broad classic-algorithm coverage.'
        },
        {
            short: 'New neural network research',
            text: 'A research team is experimenting with new neural network architectures. Which framework is best?',
            correct: { fw: 'PyTorch' },
            reason: '<strong>PyTorch</strong> is best for architecture research because its define-by-run style lets researchers change the network on the fly and debug it like ordinary Python code.',
            why: 'Research flexibility and ease of experimentation.'
        },
        {
            short: 'Large-scale production system',
            text: 'A company needs to deploy a large-scale ML system in production. Which framework is best?',
            correct: { fw: 'TensorFlow' },
            reason: '<strong>TensorFlow</strong> is best for large-scale production because of its mature serving, mobile, and distributed-training tooling built for scale.',
            why: 'Production deployment and scalability.'
        }
    ],
    summaryNote: 'no framework is best for everything. Choose based on the use case, the team\'s skill level, and the deployment requirements. When a prospect\'s data team names a framework, it tells you what stage of ML maturity they are in.'
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
