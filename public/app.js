
document.addEventListener('DOMContentLoaded', () => {
    fetchInitialWords(); 
});

async function fetchInitialWords() {
    try {
        const response = await fetch('http://localhost:3000/api/words?limit=10');
        const words = await response.json();

        displayWords(words);
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

async function fetchWords(searchTerm = '') {
    let url = 'http://localhost:3000/api/words';

    if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
    }

    try {
        const response = await fetch(url);
        const words = await response.json();

        displayWords(words);
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

function displayWords(words) {
    const wordListContainer = document.getElementById('wordList');
    wordListContainer.innerHTML = '';

    if (words.length === 0) {
        wordListContainer.innerHTML = '<p>No words found</p>';
        return;
    }

    const ul = document.createElement('ul');
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = `${word.name}: ${word.definition}`;
        ul.appendChild(li);
    });

    wordListContainer.appendChild(ul);
}

function searchWords() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    fetchWords(searchTerm);
}
