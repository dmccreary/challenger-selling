// CI/CD Pipeline Builder - choose automated actions for build, test, and deploy
// CANVAS_HEIGHT: 760
// Learners check the automated actions for each stage of a pipeline that
// publishes story library updates. Distractors include manual steps and
// skipped tests. The resulting pipeline is drawn as a flow.

const CONFIG = {
    title: 'CI/CD Pipeline Builder',
    subtitle: 'Choose the automated actions for each stage of a story library pipeline.',
    height: 760,
    scoreNoun: 'stages',
    submitLabel: 'Build Pipeline',
    contextHtml: '<div class="context"><strong>Scenario:</strong> Design a CI/CD pipeline for story library updates. Writers commit new and edited stories (text, slides, video links, metadata) several times a day, and reps must never see a broken or unapproved story.</div>',
    grid: true,
    sections: [
        { id: 'build', title: 'Stage 1: Build', type: 'checks',
          options: ['Code compilation', 'Asset validation', 'Dependency check', 'Manual review of every file'],
          correct: ['Code compilation', 'Asset validation', 'Dependency check'],
          info: { 'Code compilation': 'compiles the library site and templates', 'Asset validation': 'checks that slides, images, and video links exist and are valid', 'Dependency check': 'verifies that libraries and linked stories are present and current', 'Manual review of every file': 'is a manual step that slows every release; reviews belong in the approval workflow, not the build' },
          explain: 'Build catches broken assets and dependencies before anything is tested. CI/CD applies to content assets, not just code.' },
        { id: 'test', title: 'Stage 2: Test', type: 'checks',
          options: ['Unit tests', 'Integration tests', 'Story validation', 'Skip tests for content-only changes'],
          correct: ['Unit tests', 'Integration tests', 'Story validation'],
          info: { 'Unit tests': 'check each template and component', 'Integration tests': 'check that stories still load in the CRM and enablement platform', 'Story validation': 'checks required metadata, approval status, and broken links in each story', 'Skip tests for content-only changes': 'is how a story with a broken link or missing approval reaches reps' },
          explain: 'Testing is required at the CI stage; content changes break things too.' },
        { id: 'deploy', title: 'Stage 3: Deploy', type: 'checks',
          options: ['Staging deployment', 'Production deployment', 'Rollback capability', 'Manual file copy to production'],
          correct: ['Staging deployment', 'Production deployment', 'Rollback capability'],
          info: { 'Staging deployment': 'lets reviewers see the update in a production-like environment first', 'Production deployment': 'publishes automatically once staging checks pass', 'Rollback capability': 'restores the previous version in one step if something slips through', 'Manual file copy to production': 'is error-prone, unrepeatable, and impossible to roll back cleanly' },
          explain: 'Deploy to staging, promote to production automatically, and always keep a one-step rollback.' }
    ],
    resultHtml: (sel, ok) => {
        const box = (title, items, good) => `<div style="flex:1 1 120px;background:${good === undefined ? '#eceff1' : good ? '#e8f5e9' : '#ffebee'};border:2px solid ${good === undefined ? '#90a4ae' : good ? '#2e7d32' : '#c62828'};border-radius:8px;padding:6px 8px;font-size:0.85em;"><strong>${title}</strong><br>${items.join('<br>')}</div>`;
        const arrow = '<div style="align-self:center;font-size:1.4em;color:#78909c;">&rarr;</div>';
        const deploy = sel.deploy;
        const prodItems = deploy.filter(x => x !== 'Staging deployment' && x !== 'Rollback capability');
        return `<div class="card"><h3>Your pipeline</h3>
            <div style="display:flex;gap:6px;flex-wrap:nowrap;">
                ${box('Commit', ['Writer pushes a story update'])}${arrow}
                ${box('Build', sel.build, ok.build)}${arrow}
                ${box('Test', sel.test, ok.test)}${arrow}
                ${box('Staging', deploy.includes('Staging deployment') ? ['Preview & sign-off'] : ['<em>skipped</em>'], deploy.includes('Staging deployment'))}${arrow}
                ${box('Production', prodItems.length ? prodItems : ['<em>none</em>'], ok.deploy)}
            </div>
            <p style="margin:6px 0 0 0;font-size:0.9em;">${deploy.includes('Rollback capability') ? '&#8634; <strong>Rollback:</strong> one step back to the previous library version if a bad story slips through.' : '<span class="mark-bad">No rollback:</span> a bad release stays live until someone fixes it by hand.'}</p>
            ${['build', 'test', 'deploy'].every(k => ok[k]) ? '<p style="margin:6px 0 0 0;">This pipeline automates validation, testing, and safe release of every story update, several times a day, with no manual steps.</p>' : ''}
        </div>`;
    },
    summaryNote: 'CI/CD is for every storytelling asset, not just code. Manual steps break automation, and tests are not optional at the CI stage. Staging plus rollback makes frequent releases safe.'
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
