// Insight Type Selector
// CANVAS_HEIGHT: 800

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('main');
    
    // Scenarios
    const scenarios = [
        {
            id: 1,
            description: 'A customer is proud of their market leadership position. They believe they\'re ahead of competitors and dismiss the need for change. They\'re confident and resistant to suggestions that they\'re falling behind.',
            correctType: 'Warmer',
            correctReason: 'This customer needs to see they\'re actually behind competitors despite their perception.',
            example: 'Research shows that 70% of competitors have already adopted AI-powered analytics, while this customer is still using manual spreadsheets.'
        },
        {
            id: 2,
            description: 'A customer is overwhelmed by technology options. They\'re evaluating 15 different products, comparing features endlessly, and can\'t make a decision. They\'re drowning in data and stuck in analysis paralysis.',
            correctType: 'Rational Drowning',
            correctReason: 'This customer needs simplification - identifying the few factors that actually matter for their decision.',
            example: 'Of the 15 features you\'re comparing, only 3 actually correlate with the business outcome you care about: implementation time, user adoption, and measurable ROI.'
        },
        {
            id: 3,
            description: 'A customer has achieved good results but wants to be exceptional. They\'re performing above average but have ambitions to be in the top tier of their industry. They\'re motivated by excellence and recognition.',
            correctType: 'Rock Star',
            correctReason: 'This customer sees the problem as an opportunity for breakthrough performance and industry leadership.',
            example: 'By addressing this operational challenge, you could achieve metrics that place you in the top 10% of your industry - becoming the benchmark others follow.'
        }
    ];

    let currentScenarioIndex = 0;
    let score = 0;

    // Create header
    const header = document.createElement('div');
    header.innerHTML = `
        <h2 style="text-align: center; color: #1976d2; margin-bottom: 10px;">Insight Type Selector</h2>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">Select the appropriate insight type for each customer situation.</p>
    `;
    container.appendChild(header);

    // Create main container
    const mainContainer = document.createElement('div');
    mainContainer.id = 'main-container';
    mainContainer.style.cssText = 'max-width: 700px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 12px;';
    container.appendChild(mainContainer);

    function renderScenario(index) {
        if (index >= scenarios.length) {
            showSummary();
            return;
        }

        const scenario = scenarios[index];
        
        mainContainer.innerHTML = `
            <h3 style="color: #1976d2; margin-bottom: 15px;">Scenario ${index + 1} of ${scenarios.length}</h3>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="color: #333; line-height: 1.6;">${scenario.description}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: bold; margin-bottom: 10px; color: #333;">Select Insight Type:</label>
                <div id="insight-buttons" style="display: flex; gap: 10px; flex-wrap: wrap;"></div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: bold; margin-bottom: 10px; color: #333;">Explain your choice:</label>
                <textarea id="explanation" rows="3" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1em; font-family: Arial, sans-serif; resize: vertical;" placeholder="Briefly explain why you chose this insight type..."></textarea>
            </div>
            
            <button id="submit-btn" style="width: 100%; padding: 12px; background: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em;">Submit</button>
            
            <div id="feedback" style="margin-top: 15px; padding: 10px; border-radius: 8px; display: none;"></div>
            
            <div id="example-section" style="display: none; margin-top: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 10px 0; color: #1976d2;">Example of ${scenario.correctType} Insight:</h4>
                <p style="color: #666; line-height: 1.6; margin: 0;">${scenario.example}</p>
            </div>
            
            <button id="next-btn" style="display: none; width: 100%; margin-top: 15px; padding: 12px; background: #4caf50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em;">Next Scenario</button>
        `;

        // Create insight type buttons
        const buttonsContainer = document.getElementById('insight-buttons');
        const insightTypes = ['Warmer', 'Rational Drowning', 'Rock Star'];
        let selectedType = null;

        insightTypes.forEach(type => {
            const btn = document.createElement('button');
            btn.textContent = type;
            btn.dataset.type = type;
            btn.style.cssText = `
                padding: 10px 20px;
                background: white;
                border: 2px solid #ddd;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1em;
                transition: all 0.2s;
            `;
            
            btn.addEventListener('click', () => {
                // Deselect all buttons
                buttonsContainer.querySelectorAll('button').forEach(b => {
                    b.style.background = 'white';
                    b.style.borderColor = '#ddd';
                });
                // Select clicked button
                btn.style.background = '#1976d2';
                btn.style.borderColor = '#1976d2';
                btn.style.color = 'white';
                selectedType = type;
            });
            
            buttonsContainer.appendChild(btn);
        });

        document.getElementById('submit-btn').addEventListener('click', () => {
            const explanation = document.getElementById('explanation').value;
            const feedback = document.getElementById('feedback');
            
            if (!selectedType) {
                feedback.style.display = 'block';
                feedback.style.background = '#fff3cd';
                feedback.textContent = 'Please select an insight type.';
                return;
            }

            if (!explanation.trim()) {
                feedback.style.display = 'block';
                feedback.style.background = '#fff3cd';
                feedback.textContent = 'Please provide an explanation for your choice.';
                return;
            }

            feedback.style.display = 'block';
            
            if (selectedType === scenario.correctType) {
                score++;
                feedback.style.background = '#c8e6c9';
                feedback.innerHTML = `<strong>Correct!</strong> ${scenario.correctReason}`;
            } else {
                feedback.style.background = '#ffcdd2';
                feedback.innerHTML = `<strong>Not quite.</strong> This scenario would be better served by a <strong>${scenario.correctType}</strong> insight because ${scenario.correctReason}`;
            }

            // Show example
            document.getElementById('example-section').style.display = 'block';
            
            document.getElementById('submit-btn').style.display = 'none';
            document.getElementById('next-btn').style.display = 'block';
            
            document.getElementById('next-btn').addEventListener('click', () => {
                currentScenarioIndex++;
                renderScenario(currentScenarioIndex);
            });
        });
    }

    function showSummary() {
        mainContainer.innerHTML = `
            <h3 style="color: #1976d2; margin-bottom: 15px;">Insight Type Selection Complete!</h3>
            <p style="font-size: 1.2em; margin-bottom: 20px;">Your score: ${score} out of ${scenarios.length}</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0; color: #333;">When to Use Each Insight Type</h4>
                
                <div style="margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 6px;">
                    <h5 style="margin: 0 0 8px 0; color: #1976d2;">Warmer Insight</h5>
                    <p style="color: #666; line-height: 1.6; margin: 0;">Use when customers are overconfident or believe they're ahead of peers. Show benchmarking data that reveals they're actually falling behind competitors.</p>
                </div>
                
                <div style="margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 6px;">
                    <h5 style="margin: 0 0 8px 0; color: #1976d2;">Rational Drowning Insight</h5>
                    <p style="color: #666; line-height: 1.6; margin: 0;">Use when customers are overwhelmed by information and stuck in analysis paralysis. Simplify by identifying the few factors that actually drive outcomes.</p>
                </div>
                
                <div style="padding: 15px; background: #f9f9f9; border-radius: 6px;">
                    <h5 style="margin: 0 0 8px 0; color: #1976d2;">Rock Star Insight</h5>
                    <p style="color: #666; line-height: 1.6; margin: 0;">Use when customers are motivated by excellence and want to be industry leaders. Frame problems as opportunities for breakthrough performance and recognition.</p>
                </div>
            </div>
            
            <button id="retry-btn" style="width: 100%; padding: 12px; background: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em;">Try Again</button>
        `;
        
        document.getElementById('retry-btn').addEventListener('click', () => {
            currentScenarioIndex = 0;
            score = 0;
            renderScenario(0);
        });
    }

    // Start with first scenario
    renderScenario(0);
});
