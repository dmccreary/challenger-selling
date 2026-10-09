// Stakeholder Mapping Tool
// CANVAS_HEIGHT: 750

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('main');
    
    // Stakeholder data
    const stakeholders = [
        {
            id: 1,
            name: 'Dr. Martinez, CFO',
            description: 'Controls the budget for all technology purchases. Asks about ROI and cost savings every conversation.',
            correctBuyer: 'Economic Buyer',
            correctInfluence: 'Skeptic',
            reason: 'This stakeholder controls the budget (Economic Buyer) and demands evidence before committing (Skeptic).'
        },
        {
            id: 2,
            name: 'Professor Chen, Chair of CS',
            description: 'Wants to improve student engagement and outcomes. Actively advocates for modernizing course materials.',
            correctBuyer: 'User Buyer',
            correctInfluence: 'Mobilizer',
            reason: 'This stakeholder will use the solution daily (User Buyer) and actively drives change (Mobilizer).'
        },
        {
            id: 3,
            name: 'Director Johnson, CTO',
            description: 'Evaluates technical fit, security, and integration with existing LMS. Will your system work with our current infrastructure?',
            correctBuyer: 'Technical Buyer',
            correctInfluence: 'Skeptic',
            reason: 'This stakeholder evaluates technical requirements (Technical Buyer) and questions assumptions (Skeptic).'
        },
        {
            id: 4,
            name: 'Sarah, Instructional Designer',
            description: 'Provides feedback on the demo and introduces you to other department chairs. She\'s been helpful throughout the process.',
            correctBuyer: 'User Buyer',
            correctInfluence: 'Coach',
            reason: 'This stakeholder will work with the solution (User Buyer) and provides guidance and access (Coach).'
        }
    ];

    let currentStakeholderIndex = 0;
    let allCorrect = true;

    // Create header
    const header = document.createElement('div');
    header.innerHTML = `
        <h2 style="text-align: center; color: #1976d2; margin-bottom: 10px;">Stakeholder Mapping Tool</h2>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">You're selling an intelligent textbook platform to a university. Categorize each stakeholder.</p>
    `;
    container.appendChild(header);

    // Create main container
    const mainContainer = document.createElement('div');
    mainContainer.id = 'main-container';
    mainContainer.style.cssText = 'max-width: 700px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 12px;';
    container.appendChild(mainContainer);

    function renderStakeholder(index) {
        if (index >= stakeholders.length) {
            showSummary();
            return;
        }

        const stakeholder = stakeholders[index];
        mainContainer.innerHTML = `
            <h3 style="color: #1976d2; margin-bottom: 15px;">Stakeholder ${index + 1} of ${stakeholders.length}</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 10px 0; color: #333;">${stakeholder.name}</h4>
                <p style="color: #666; line-height: 1.5;">${stakeholder.description}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Buyer Type:</label>
                <select id="buyer-type" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1em;">
                    <option value="">Select buyer type...</option>
                    <option value="Economic Buyer">Economic Buyer</option>
                    <option value="Technical Buyer">Technical Buyer</option>
                    <option value="User Buyer">User Buyer</option>
                </select>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Influence Type:</label>
                <select id="influence-type" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1em;">
                    <option value="">Select influence type...</option>
                    <option value="Coach">Coach</option>
                    <option value="Mobilizer">Mobilizer</option>
                    <option value="Skeptic">Skeptic</option>
                    <option value="Friend">Friend</option>
                </select>
            </div>
            
            <button id="submit-btn" style="width: 100%; padding: 12px; background: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em;">Submit</button>
            
            <div id="feedback" style="margin-top: 15px; padding: 10px; border-radius: 8px; display: none;"></div>
            
            <button id="next-btn" style="display: none; width: 100%; margin-top: 15px; padding: 12px; background: #4caf50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em;">Next Stakeholder</button>
        `;

        document.getElementById('submit-btn').addEventListener('click', () => {
            const buyerType = document.getElementById('buyer-type').value;
            const influenceType = document.getElementById('influence-type').value;
            const feedback = document.getElementById('feedback');
            
            if (!buyerType || !influenceType) {
                feedback.style.display = 'block';
                feedback.style.background = '#fff3cd';
                feedback.textContent = 'Please select both buyer type and influence type.';
                return;
            }

            const buyerCorrect = buyerType === stakeholder.correctBuyer;
            const influenceCorrect = influenceType === stakeholder.correctInfluence;
            
            feedback.style.display = 'block';
            
            if (buyerCorrect && influenceCorrect) {
                feedback.style.background = '#c8e6c9';
                feedback.textContent = `Correct! ${stakeholder.reason}`;
            } else {
                allCorrect = false;
                feedback.style.background = '#ffcdd2';
                let errorMsg = 'Not quite. ';
                if (!buyerCorrect) {
                    errorMsg += `The correct buyer type is ${stakeholder.correctBuyer}. `;
                }
                if (!influenceCorrect) {
                    errorMsg += `The correct influence type is ${stakeholder.correctInfluence}. `;
                }
                errorMsg += stakeholder.reason;
                feedback.textContent = errorMsg;
            }

            document.getElementById('submit-btn').style.display = 'none';
            document.getElementById('next-btn').style.display = 'block';
            
            document.getElementById('next-btn').addEventListener('click', () => {
                currentStakeholderIndex++;
                renderStakeholder(currentStakeholderIndex);
            });
        });
    }

    function showSummary() {
        mainContainer.innerHTML = `
            <h3 style="color: #1976d2; margin-bottom: 15px;">Stakeholder Mapping Complete!</h3>
            ${allCorrect ? 
                '<p style="font-size: 1.1em; color: #4caf50; margin-bottom: 20px;">Perfect! You correctly categorized all stakeholders.</p>' :
                '<p style="font-size: 1.1em; color: #f44336; margin-bottom: 20px;">Some categorizations were incorrect. Review the feedback above and try again.</p>'
            }
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0; color: #333;">Prioritization Summary</h4>
                <p style="color: #666; line-height: 1.6; margin-bottom: 10px;"><strong>Priority Stakeholders:</strong> Mobilizers and Coaches</p>
                <p style="color: #666; line-height: 1.6; margin-bottom: 10px;"><strong>Engagement Strategy:</strong></p>
                <ul style="color: #666; line-height: 1.6; padding-left: 20px;">
                    <li><strong>Mobilizers (Professor Chen):</strong> Provide data and tools they can use to drive change internally</li>
                    <li><strong>Coaches (Sarah):</strong> Share information, seek their guidance, and leverage their access to other stakeholders</li>
                    <li><strong>Skeptics (Dr. Martinez, Director Johnson):</strong> Arm them with evidence and research so they can advocate for your solution to others</li>
                </ul>
            </div>
            
            <button id="retry-btn" style="width: 100%; padding: 12px; background: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em;">Try Again</button>
        `;
        
        document.getElementById('retry-btn').addEventListener('click', () => {
            currentStakeholderIndex = 0;
            allCorrect = true;
            renderStakeholder(0);
        });
    }

    // Start with first stakeholder
    renderStakeholder(0);
});
