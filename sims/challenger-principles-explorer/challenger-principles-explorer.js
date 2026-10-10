// Challenger Principles Explorer - reveal teach, tailor, and take control, then apply them
// CANVAS_HEIGHT: 700
// Learners click each principle card to reveal its description and example.
// Once all three are open, a diagram shows how they work together and a
// three-question quiz (one attempt each) checks which principle fits when.

const CONFIG = {
    title: 'Challenger Principles Explorer',
    prompt: 'Click each card to learn about the Challenger principles.',
    height: 700,
    cardMin: 190,
    cards: [
        { id: 'teach', title: 'Teach', color: '#1976d2',
          body: 'Deliver insights that teach customers something new about their business. Focus on reframing problems, not just presenting solutions. Use data and research to back your claims.<br><br><strong>Example:</strong> A customer thinks their database is fine. You teach that 40% of their IT budget goes to maintaining brittle systems that block innovation.' },
        { id: 'tailor', title: 'Tailor', color: '#7b1fa2',
          body: 'Adapt your message to resonate with specific stakeholders. CFOs care about ROI. CTOs care about technical fit. CEOs care about strategic advantage. Emphasize different aspects of your insight for different audiences.<br><br><strong>Example:</strong> For the CFO, show the cost savings from faster development. For the CTO, show how the new architecture reduces technical debt.' },
        { id: 'control', title: 'Take Control', color: '#00897b',
          body: 'Guide the customer toward a decision rather than waiting for them to navigate their own path. Propose clear next steps, create timelines, and provide structure. Don\'t ask "what next?"; propose what makes sense.<br><br><strong>Example:</strong> After the insight resonates, propose a 30-day pilot with clear success criteria, not just "let me know if you\'re interested."' }
    ],
    afterHtml: `
        <div class="card" style="text-align:center;">
            <h3>How the principles work together</h3>
            <div style="display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;font-size:0.9em;">
                <span class="tag" style="background:#1976d2;font-size:0.95em;padding:4px 10px;">Teach</span><span>&rarr; creates urgency &rarr;</span>
                <span class="tag" style="background:#7b1fa2;font-size:0.95em;padding:4px 10px;">Tailor</span><span>&rarr; builds relevance &rarr;</span>
                <span class="tag" style="background:#00897b;font-size:0.95em;padding:4px 10px;">Take Control</span><span>&rarr; converts urgency into action</span>
            </div>
            <p style="margin:8px 0 0 0;font-size:0.85em;color:var(--muted);">These are integrated behaviors, not steps: a Challenger tailors while teaching and keeps control throughout the conversation.</p>
        </div>`,
    questions: [
        { q: 'A customer doesn\'t recognize they have a problem. Which principle do you use first?', options: ['Teach', 'Tailor', 'Take Control'], correct: 'Teach',
          ok: 'Right! When customers don\'t see the problem, you must teach them about it first.', bad: 'Not quite. Teaching is about reframing problems customers don\'t recognize.' },
        { q: 'You\'ve delivered an insight that resonates, but the customer says "we need to think about it." Which principle do you apply now?', options: ['Teach', 'Tailor', 'Take Control'], correct: 'Take Control',
          ok: 'Yes! Taking control means proposing the next step rather than waiting.', bad: 'Not quite. Taking control provides structure to move the decision forward.' },
        { q: 'You\'re preparing for a meeting with the CFO. Which principle helps you decide what to emphasize?', options: ['Teach', 'Tailor', 'Take Control'], correct: 'Tailor',
          ok: 'Correct! Tailoring means emphasizing what matters most to the specific stakeholder.', bad: 'Not quite. Tailoring adapts the message to resonate with the stakeholder\'s priorities.' }
    ],
    summaryNote: 'teaching means sharing insights, not lecturing; taking control means providing structure, not being pushy; and the three principles work together rather than as a fixed sequence.'
};

// ---------------------------------------------------------------------------
// Reveal-then-quiz engine: learners click every card to reveal it; once all
// are revealed, a short quiz appears one question at a time in random order.
// One attempt per question; the score is shown at the end with a retry.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const C = CONFIG;
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', C.height + 'px');
    main.appendChild(app);

    const revealed = new Set();
    let order = [], qi = 0, score = 0;

    app.innerHTML = `
        <h2>${C.title}</h2>
        <p class="subtitle" id="prompt">${C.prompt}</p>
        <div id="cards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(${C.cardMin || 190}px,1fr));gap:10px;margin-bottom:10px;"></div>
        <div id="after"></div>
        <div id="quiz"></div>
    `;
    const cardsBox = app.querySelector('#cards');
    C.cards.forEach(c => {
        const d = document.createElement('div');
        d.className = 'card reveal-card';
        d.style.cssText = `cursor:pointer;margin:0;border-top:5px solid ${c.color};`;
        d.setAttribute('role', 'button');
        d.tabIndex = 0;
        d.innerHTML = `<h3 style="color:${c.color};display:flex;justify-content:space-between;align-items:center;">${c.title}<span class="rv-icon" style="font-size:1.1em;">&#10067;</span></h3><div class="rv-body hidden" style="font-size:0.9em;line-height:1.45;">${c.body}</div>`;
        const open = () => {
            d.querySelector('.rv-body').classList.remove('hidden');
            d.querySelector('.rv-icon').innerHTML = '<span class="mark-ok">&#10003;</span>';
            revealed.add(c.id);
            app.querySelector('#prompt').innerHTML = revealed.size < C.cards.length
                ? `${C.prompt} <strong>(${revealed.size} of ${C.cards.length} revealed)</strong>`
                : 'All revealed. Now check your understanding below.';
            if (revealed.size === C.cards.length && !order.length) startQuiz();
        };
        d.addEventListener('click', open);
        d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        cardsBox.appendChild(d);
    });

    function startQuiz() {
        if (C.afterHtml) app.querySelector('#after').innerHTML = C.afterHtml;
        order = C.questions.map((_, i) => i).sort(() => Math.random() - 0.5);
        qi = 0; score = 0;
        renderQuestion();
        app.scrollTop = app.querySelector('#after').offsetTop - 8;
    }

    function renderQuestion() {
        const q = C.questions[order[qi]];
        const quiz = app.querySelector('#quiz');
        quiz.innerHTML = `
            <div class="card">
                <h3>Question ${qi + 1} of ${order.length}</h3>
                <p style="margin:0 0 8px 0;">${q.q}</p>
                <div class="choice-row">${q.options.map(o => `<button type="button" class="choice" data-o="${o}">${o}</button>`).join('')}</div>
                <div id="qfb"></div>
            </div>`;
        quiz.querySelectorAll('button.choice').forEach(b => b.addEventListener('click', () => {
            quiz.querySelectorAll('button.choice').forEach(x => { x.disabled = true; });
            b.classList.add('selected');
            const ok = b.dataset.o === q.correct;
            if (ok) score++;
            const last = qi === order.length - 1;
            quiz.querySelector('#qfb').innerHTML = `
                <div class="feedback ${ok ? 'ok' : 'bad'}" style="margin:8px 0 0 0;">${ok ? q.ok : q.bad + ` The answer is <strong>${q.correct}</strong>.`}</div>
                <div class="btn-row" style="margin:8px 0 0 0;"><button id="qnext">${last ? 'See Score' : 'Next Question'}</button></div>`;
            quiz.querySelector('#qnext').addEventListener('click', () => {
                if (last) renderScore(); else { qi++; renderQuestion(); }
            });
        }));
    }

    function renderScore() {
        const n = order.length;
        app.querySelector('#quiz').innerHTML = `
            <div class="feedback ${score === n ? 'ok' : 'warn'}">
                <strong>Score: ${score} of ${n}</strong>${score === n ? ' (mastery)' : ' &mdash; review the cards above, then retry the quiz.'}
                <br><strong>Remember:</strong> ${C.summaryNote}
            </div>
            <div class="btn-row"><button id="retry">Retry Quiz</button></div>`;
        app.querySelector('#retry').addEventListener('click', startQuiz);
    }
});
