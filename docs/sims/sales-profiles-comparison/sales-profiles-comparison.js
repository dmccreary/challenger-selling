// Sales Profiles Comparison - compare the five CEB sales profiles and their performance
// CANVAS_HEIGHT: 740
// Learners click each profile card to reveal its characteristics. Once all
// five are open, a chart of verified CEB research appears, followed by a
// three-question quiz (one attempt each).
//
// Data source: CEB research reported in Adamson, Dixon & Toman, "The End of
// Solution Sales," Harvard Business Review, July-August 2012, and The Challenger
// Sale (2011): share of star (high) performers in complex sales by profile.

const STAR_SHARE = [['Challenger', 54, '#2e7d32'], ['Lone Wolf', 25, '#5c6bc0'], ['Hard Worker', 10, '#5c6bc0'], ['Reactive Problem Solver', 7, '#5c6bc0'], ['Relationship Builder', 4, '#c62828']];

const CONFIG = {
    title: 'Sales Profiles Comparison',
    prompt: 'Click each card to learn about the sales profiles.',
    height: 740,
    cardMin: 200,
    cards: [
        { id: 'rb', title: 'Relationship Builder', color: '#5c6bc0',
          body: 'Focuses on building personal connections and rapport. High likability and customer satisfaction. Historically considered ideal but underperforms in complex, consultative sales.<br><strong>Strength:</strong> strong customer relationships<br><strong>Weakness:</strong> avoids disruption, misses teaching opportunities' },
        { id: 'hw', title: 'Hard Worker', color: '#5c6bc0',
          body: 'Succeeds through sheer effort and persistence: more calls, more meetings, diligent follow-up. Achieves respectable results but struggles to scale.<br><strong>Strength:</strong> high effort and dedication<br><strong>Weakness:</strong> effort without insight has diminishing returns' },
        { id: 'lw', title: 'Lone Wolf', color: '#5c6bc0',
          body: 'Relies on exceptional individual capability and instinct. Often a strong performer, but the approach is idiosyncratic and hard to replicate across a team.<br><strong>Strength:</strong> individual excellence<br><strong>Weakness:</strong> approach doesn\'t transfer to others' },
        { id: 'ps', title: 'Reactive Problem Solver', color: '#5c6bc0',
          body: 'Excels at addressing customer requests and resolving issues. Responsive and service-oriented but struggles to drive proactive value.<br><strong>Strength:</strong> reliable problem resolution<br><strong>Weakness:</strong> reactive rather than proactive' },
        { id: 'ch', title: 'Challenger', color: '#2e7d32',
          body: 'Combines deep customer knowledge with teaching, tailoring, and taking control. The dominant profile among star performers in complex sales.<br><strong>Strength:</strong> teaches new perspectives, drives change<br><strong>Weakness:</strong> requires skill development' }
    ],
    afterHtml: `
        <div class="card">
            <h3>Share of star performers in complex sales, by profile</h3>
            ${STAR_SHARE.map(([n, v, c]) => `<div style="display:flex;align-items:center;gap:8px;margin:3px 0;font-size:0.88em;"><span style="width:170px;">${n}</span><div style="flex:1;background:#eceff1;border-radius:4px;height:16px;"><div style="width:${v / 54 * 100}%;background:${c};height:100%;border-radius:4px;"></div></div><span style="width:36px;text-align:right;"><strong>${v}%</strong></span></div>`).join('')}
            <p style="margin:6px 0 0 0;font-size:0.78em;color:var(--muted);">Source: CEB research in Adamson, Dixon &amp; Toman, "The End of Solution Sales," <em>Harvard Business Review</em>, July&ndash;August 2012. Profiles are spread fairly evenly across all reps; the difference appears among the top performers.</p>
        </div>`,
    questions: [
        { q: 'Which profile made up more than half of all star performers in complex sales?', options: ['Relationship Builder', 'Hard Worker', 'Lone Wolf', 'Reactive Problem Solver', 'Challenger'], correct: 'Challenger',
          ok: 'Exactly! Challengers were 54% of star performers in complex sales.', bad: 'Not quite. Challengers significantly outperform in complex sales.' },
        { q: 'Which profile focuses on building personal connections but underperforms in complex sales?', options: ['Relationship Builder', 'Hard Worker', 'Lone Wolf', 'Reactive Problem Solver', 'Challenger'], correct: 'Relationship Builder',
          ok: 'Right! Relationship Builders are likable but struggle with the disruption complex sales require: just 4% of star performers.', bad: 'Not quite. Relationship Builders focus on relationships but underperform in complex sales.' },
        { q: 'Which profile\'s approach is idiosyncratic and difficult to replicate across a team?', options: ['Relationship Builder', 'Hard Worker', 'Lone Wolf', 'Reactive Problem Solver', 'Challenger'], correct: 'Lone Wolf',
          ok: 'Correct! Lone Wolves can be brilliant individually, but their approach doesn\'t scale.', bad: 'Not quite. The Lone Wolf approach is idiosyncratic and non-scalable.' }
    ],
    summaryNote: 'relationships still matter, but Relationship Builders were the least likely profile to be star performers in complex sales, and effort alone (the Hard Worker) has diminishing returns. The profiles do not perform equally: Challengers dominate when sales are complex.'
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
