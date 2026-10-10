// AI Capability Selector - match storytelling use cases to AI capabilities
// CANVAS_HEIGHT: 540
// Learners choose NLP, speech recognition, sentiment AI, or emotion AI for
// four sales-storytelling use cases.

const CONFIG = {
    title: 'AI Capability Selector',
    subtitle: 'Which AI capability fits each storytelling use case?',
    height: 540,
    itemLabel: 'Use Case',
    fields: [{ id: 'ai', label: 'AI Capability', type: 'buttons', options: ['NLP', 'Speech Recognition', 'Sentiment AI', 'Emotion AI'] }],
    optionInfo: {
        ai: {
            'NLP': 'understands and generates written language (including natural language generation)',
            'Speech Recognition': 'converts spoken audio into text',
            'Sentiment AI': 'classifies the opinion in text as positive, negative, or neutral',
            'Emotion AI': 'detects emotional states such as frustration or excitement from voice or facial cues'
        }
    },
    items: [
        {
            short: 'Feedback sentiment from calls',
            text: 'Automatically analyzing customer feedback sentiment from sales calls.',
            correct: { ai: 'Sentiment AI' },
            reason: 'This use case calls for <strong>Sentiment AI</strong> because the goal is to classify the opinion in what customers said: positive, negative, or neutral, and how it shifts across the call.',
            why: 'Opinion polarity in what was said.'
        },
        {
            short: 'Transcribe conversations',
            text: 'Transcribing spoken sales conversations into text for analysis.',
            correct: { ai: 'Speech Recognition' },
            reason: 'This use case calls for <strong>Speech Recognition</strong> because the first step is turning audio into text. Sentiment and NLP tools usually work on the transcript it produces.',
            why: 'Audio in, text out.'
        },
        {
            short: 'Emotional cues in voice',
            text: 'Detecting emotional cues in the customer\'s voice during story delivery.',
            correct: { ai: 'Emotion AI' },
            reason: 'This use case calls for <strong>Emotion AI</strong> because it reads emotional state from <em>how</em> something is said (pitch, pace, hesitation), not just from the words.',
            why: 'How it was said, not just what.'
        },
        {
            short: 'Generate story drafts',
            text: 'Generating story drafts from Challenger insights.',
            correct: { ai: 'NLP' },
            reason: 'This use case calls for <strong>NLP</strong>, specifically natural language generation (NLG): turning structured insights into fluent written drafts that a rep then reviews and personalizes.',
            why: 'Natural language generation.'
        }
    ],
    summaryNote: 'different AI capabilities do different jobs, and they often chain together: speech recognition produces a transcript, sentiment and emotion AI read it, and NLP drafts the follow-up. AI augments the rep; it does not replace their judgment.'
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
