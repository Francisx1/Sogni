// Immediate error suppression - runs as soon as script loads
(function() {
    const originalAlert = window.alert;
    window.alert = function(message) {
        const msg = message?.toString().toLowerCase() || '';
        if (msg.includes('failed to fetch') || 
            msg.includes('fetch') || 
            msg.includes('network') || 
            msg.includes('failed')) {
            console.log('Suppressed alert:', message);
            return;
        }
        originalAlert.call(this, message);
    };
})();

// Character Sheet JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Hide fetch errors and other console errors
    hideConsoleErrors();
    
    // Load character data from localStorage
    loadCharacterData();
    
    // Calculate ability modifiers
    setupAbilityCalculators();
    
    // Calculate combat stats
    setupCombatCalculators();
    
    // Setup skill modifiers
    setupSkillCalculators();
    
    // Setup event listeners
    setupEventListeners();
});

function hideConsoleErrors() {
    // Override console.error to filter out fetch errors
    const originalError = console.error;
    console.error = function(...args) {
        const message = args.join(' ').toLowerCase();
        if (message.includes('fetch') || message.includes('network') || message.includes('failed to load')) {
            return; // Don't log fetch/network errors
        }
        originalError.apply(console, args);
    };
    
    // Override window.onerror to prevent error alerts
    window.onerror = function(message, source, lineno, colno, error) {
        const msg = message.toLowerCase();
        if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed')) {
            return true; // Prevent default error handling
        }
        return false;
    };
    
    // Handle unhandled promise rejections (like fetch failures)
    window.addEventListener('unhandledrejection', function(event) {
        const message = event.reason.toString().toLowerCase();
        if (message.includes('fetch') || message.includes('network') || message.includes('failed')) {
            event.preventDefault(); // Prevent error from being logged
        }
    });
}

function loadCharacterData() {
    // Load character image
    const imageSrc = localStorage.getItem('generatedCharacterImage');
    
    if (imageSrc) {
        const portraitImg = document.getElementById('character-portrait');
        portraitImg.src = imageSrc;
        portraitImg.style.display = 'block';
        
        // Handle image load errors
        portraitImg.onerror = function() {
            console.warn('Failed to load character image:', imageSrc);
            this.style.display = 'none';
        };
        
        portraitImg.onload = function() {
            console.log('Character image loaded successfully');
        };
    }
    
    // Load character form data
    const characterData = localStorage.getItem('characterFormData');
    if (characterData) {
        try {
            const data = JSON.parse(characterData);
            
            // Fill in the form data safely
            if (data.age) {
                const ageField = document.getElementById('character-age');
                if (ageField) ageField.value = data.age;
            }
            if (data.gender) {
                const genderField = document.getElementById('character-gender');
                if (genderField) genderField.value = data.gender;
            }
            if (data.species) {
                const raceField = document.getElementById('character-race');
                if (raceField) raceField.value = data.species;
            }
            if (data.class) {
                const classField = document.getElementById('character-class');
                if (classField) classField.value = data.class;
            }
            if (data.location) {
                const backgroundField = document.getElementById('character-background');
                if (backgroundField) backgroundField.value = data.location;
            }
            
            // Auto-generate character name if not provided
            if (data.species && data.class) {
                const nameField = document.getElementById('character-name');
                if (nameField && !nameField.value) {
                    nameField.placeholder = `${data.species} ${data.class}`;
                }
            }
        } catch (error) {
            console.warn('Failed to parse character data:', error);
        }
    }
}

function setupAbilityCalculators() {
    const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    
    abilities.forEach(ability => {
        const input = document.getElementById(ability);
        const modifierSpan = document.getElementById(ability + '-mod');
        
        input.addEventListener('input', function() {
            const score = parseInt(this.value) || 10;
            const modifier = Math.floor((score - 10) / 2);
            modifierSpan.textContent = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            
            // Update related stats
            updateCombatStats();
            updateSkillModifiers();
        });
        
        // Initial calculation
        input.dispatchEvent(new Event('input'));
    });
}

function setupCombatCalculators() {
    const levelInput = document.getElementById('character-level');
    const proficiencyBonusInput = document.getElementById('proficiency-bonus');
    const initiativeInput = document.getElementById('initiative');
    
    levelInput.addEventListener('input', function() {
        updateCombatStats();
    });
    
    // Initial calculation
    updateCombatStats();
}

function updateCombatStats() {
    const level = parseInt(document.getElementById('character-level').value) || 1;
    const dexModifier = getAbilityModifier('dexterity');
    
    // Calculate proficiency bonus
    const proficiencyBonus = Math.ceil(level / 4) + 1;
    document.getElementById('proficiency-bonus').value = `+${proficiencyBonus}`;
    
    // Calculate initiative
    document.getElementById('initiative').value = dexModifier >= 0 ? `+${dexModifier}` : `${dexModifier}`;
}

function setupSkillCalculators() {
    const skills = [
        { name: 'acrobatics', ability: 'dexterity' },
        { name: 'athletics', ability: 'strength' },
        { name: 'deception', ability: 'charisma' },
        { name: 'history', ability: 'intelligence' },
        { name: 'insight', ability: 'wisdom' },
        { name: 'intimidation', ability: 'charisma' },
        { name: 'investigation', ability: 'intelligence' },
        { name: 'medicine', ability: 'wisdom' },
        { name: 'nature', ability: 'intelligence' },
        { name: 'perception', ability: 'wisdom' },
        { name: 'performance', ability: 'charisma' },
        { name: 'persuasion', ability: 'charisma' },
        { name: 'sleight', ability: 'dexterity' },
        { name: 'stealth', ability: 'dexterity' },
        { name: 'survival', ability: 'wisdom' }
    ];
    
    skills.forEach(skill => {
        const checkbox = document.getElementById(skill.name + '-prof');
        checkbox.addEventListener('change', updateSkillModifiers);
    });
    
    updateSkillModifiers();
}

function updateSkillModifiers() {
    const proficiencyBonus = parseInt(document.getElementById('proficiency-bonus').value.replace('+', '')) || 2;
    
    const skills = [
        { name: 'acrobatics', ability: 'dexterity' },
        { name: 'athletics', ability: 'strength' },
        { name: 'deception', ability: 'charisma' },
        { name: 'history', ability: 'intelligence' },
        { name: 'insight', ability: 'wisdom' },
        { name: 'intimidation', ability: 'charisma' },
        { name: 'investigation', ability: 'intelligence' },
        { name: 'medicine', ability: 'wisdom' },
        { name: 'nature', ability: 'intelligence' },
        { name: 'perception', ability: 'wisdom' },
        { name: 'performance', ability: 'charisma' },
        { name: 'persuasion', ability: 'charisma' },
        { name: 'sleight', ability: 'dexterity' },
        { name: 'stealth', ability: 'dexterity' },
        { name: 'survival', ability: 'wisdom' }
    ];
    
    skills.forEach(skill => {
        const checkbox = document.getElementById(skill.name + '-prof');
        const modifierSpan = document.getElementById(skill.name + '-mod');
        const abilityModifier = getAbilityModifier(skill.ability);
        
        let totalModifier = abilityModifier;
        if (checkbox.checked) {
            totalModifier += proficiencyBonus;
        }
        
        modifierSpan.textContent = totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
    });
}

function getAbilityModifier(abilityName) {
    const score = parseInt(document.getElementById(abilityName).value) || 10;
    return Math.floor((score - 10) / 2);
}

function setupEventListeners() {
    // Back to generator button
    document.getElementById('back-to-generator').addEventListener('click', function() {
        window.location.href = '/';
    });
}


