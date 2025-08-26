// Array of D&D fun facts
const funFacts = [
  "The first edition of Dungeons & Dragons was published in 1974, created by Gary Gygax and Dave Arneson.",
  "The Beholder is a D&D-original monster — it doesn't exist in any mythology.",
  "The Ampersand (&) in the D&D logo is stylized as a dragon!",
  "The famous 20-sided die (d20) predates D&D — polyhedral dice were imported from Japan in the 1960s.",
  "In early editions, elves had to pick between being a fighter or a magic-user; they couldn't do both.",
  "Critical hits weren't in the original rules — they were added in Advanced Dungeons & Dragons.",
  "The first D&D adventure module was 'Palace of the Vampire Queen' (1976).",
  "The Tarrasque is inspired by a French legend of a dragon-like monster.",
  "The spell 'Magic Missile' has been in every edition since the beginning — and it always hits!",
  "The first D&D campaign world was Greyhawk, created by Gary Gygax.",
  "Many monsters, like Mind Flayers, were inspired by sci-fi rather than fantasy.",
  "The original D&D game assumed you'd be exploring a megadungeon, not an open world.",
  "In early editions, halflings were almost called 'hobbits' until legal issues forced a name change.",
  "Drizzt Do'Urden, the famous drow ranger, first appeared in a novel, not the rulebooks.",
  "The Dungeon Master's Screen was introduced in 1979 to hide dice rolls and notes.",
  "The Deck of Many Things has been ruining campaigns since 1975.",
  "Alignment (Lawful/Chaotic, Good/Evil) was originally inspired by Michael Moorcock's fantasy novels.",
  "The Gelatinous Cube was invented specifically to 'fit perfectly in a 10-foot dungeon corridor.'",
  "The term 'THAC0' (To Hit Armor Class 0) was a hallmark of 2nd edition and confused many new players.",
  "The longest continuous D&D game on record has been running for over 40 years!"
];

// Global alert suppression for fetch errors
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

// Hide console errors and fetch failures
function hideConsoleErrors() {
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ').toLowerCase();
    if (message.includes('fetch') || message.includes('network') || message.includes('failed to load')) {
      return;
    }
    originalError.apply(console, args);
  };
  
  window.addEventListener('unhandledrejection', function(event) {
    const message = event.reason.toString().toLowerCase();
    if (message.includes('fetch') || message.includes('network') || message.includes('failed')) {
      event.preventDefault();
    }
  });
}

// Initialize error hiding
hideConsoleErrors();

// Get a random fun fact
function getRandomFunFact() {
  const randomIndex = Math.floor(Math.random() * funFacts.length);
  return "🧙 Do you know? " + funFacts[randomIndex];
}

// Function to generate character
async function generateCharacter(form) {
  const data = {
    age: form.age.value,
    gender: form.gender.value,
    species: form.species.value,
    class: form.class.value,
    location: form.location.value,
    color: form.color.value
  };

  // Flip card to loading state first
  const card = document.querySelector('.card');
  card.classList.add('is-flipped');
  
  const img = document.getElementById('character-image');
  const loadingContainer = document.querySelector('.loading-container');
  const funFactElement = document.getElementById('fun-fact');
  
  img.style.display = 'none';
  loadingContainer.style.display = 'flex';
  funFactElement.textContent = getRandomFunFact();
  
  // Hide all buttons during loading
  document.getElementById('generate-another').style.display = 'none';
  document.getElementById('save-image').style.display = 'none';
  document.getElementById('build-character-sheet').style.display = 'none';
  
    try {
      const res = await fetch('/api/generate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.imageUrl) {
        // Hide loading animation, show image and button
        loadingContainer.style.display = 'none';
        img.src = result.imageUrl;
        img.style.display = 'block';
        document.getElementById('generate-another').style.display = 'inline-block';
        if (typeof showBuildCharacterSheetButton === 'function') {
          showBuildCharacterSheetButton();
        }
      } else if (result.image) {
        // Hide loading animation, show image and button
        loadingContainer.style.display = 'none';
        img.src = result.image;
        img.style.display = 'block';
        document.getElementById('generate-another').style.display = 'inline-block';
        if (typeof showBuildCharacterSheetButton === 'function') {
          showBuildCharacterSheetButton();
        }
      } else {
        card.classList.remove('is-flipped');
      }
    } catch (error) {
      alert(error.message);
      // If failed, flip back to form side
      card.classList.remove('is-flipped');
    }
} // Closing brace for generateCharacter function
document.getElementById('character-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  await generateCharacter(e.target);
});

document.getElementById('generate-another').addEventListener('click', function() {
  const card = document.querySelector('.card');
  const img = document.getElementById('character-image');
  const loadingContainer = document.querySelector('.loading-container');
  
  // Reset all button states
  document.getElementById('generate-another').style.display = 'none';
  document.getElementById('save-image').style.display = 'none';
  document.getElementById('build-character-sheet').style.display = 'none';
  
  // Reset image and loading states
  img.style.display = 'none';
  loadingContainer.style.display = 'none';
  
  // Flip back to form
  card.classList.remove('is-flipped');
});

// Initialize error hiding
hideConsoleErrors();
