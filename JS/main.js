/**
 * main.js - Core Controller for Owly Book Finder
 * - Free search input instead of select
 * - Search button validation (disabled state)
 * - Full clickable cards
 * - Empty results handling
 */
import apiService from './ApiService.js';
import { BookFactory } from './bookFactory.js';
import { translations } from './i18n.js';

// 1. STATE MANAGEMENT
let currentLang = localStorage.getItem('owly_lang') || 'en';

// 2. DOM ELEMENTS SELECTION
const elements = {
    title: document.getElementById('ui-title'),
    subtitle: document.getElementById('ui-subtitle'),
    searchText: document.getElementById('ui-search-text'),
    loadingText: document.getElementById('ui-loading'),
    searchInput: document.getElementById('search-input'), // Updated to Input
    searchBtn: document.getElementById('search-btn'),
    resultsContainer: document.getElementById('results-container'),
    loader: document.getElementById('loader'),
    modal: document.getElementById('book-modal'),
    modalBody: document.getElementById('modal-body'),
    closeModal: document.getElementById('close-modal'),
    btnEn: document.getElementById('lang-en'),
    btnIt: document.getElementById('lang-it')
};

// 3. UI LOGIC FUNCTIONS
const updateLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('owly_lang', lang);
    const t = translations[lang];
    
    elements.title.textContent = t.title;
    elements.subtitle.textContent = t.subtitle;
    elements.searchText.textContent = t.searchText;
    elements.loadingText.textContent = t.loading;
    // Dynamic placeholder for the search input
    elements.searchInput.placeholder = t.selectLabel;
    
    elements.btnEn.classList.toggle('active', lang === 'en');
    elements.btnIt.classList.toggle('active', lang === 'it');
};

const toggleLoading = (show) => elements.loader.classList.toggle('hidden', !show);

const closeModal = () => {
    elements.modal.classList.add('hidden');
    elements.searchBtn.focus();
};

/**
 * Renders book cards - Optimized: cards are fully clickable (Marco's Feedback)
 */
const renderBooks = (books) => {
    elements.resultsContainer.innerHTML = '';
    const t = translations[currentLang];

    books.forEach(bookData => {
        const book = BookFactory.createBook(bookData);

        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.cursor = 'pointer'; 
        
        // Accessibility and Interaction
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `View details for ${book.title}`);

        card.innerHTML = `
            <h3 class="book-title">${book.title}</h3>
            <p class="book-authors">${t.by}: ${book.authors}</p>
        `;

        // Event: Click on the entire card
        card.addEventListener('click', () => showBookDescription(book.key));
        
        // Event: Enter key support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') showBookDescription(book.key);
        });

        elements.resultsContainer.appendChild(card);
    });
};

const showBookDescription = async (bookKey) => {
    toggleLoading(true);
    try {
        const details = await apiService.getBookDetails(bookKey);
        const formattedBook = BookFactory.createBook(details);
        
        elements.modalBody.innerHTML = `
            <h2 style="color: var(--owly-blue)">${formattedBook.title}</h2>
            <hr style="margin: 15px 0; border: 1px solid var(--owly-green)">
            <p style="font-size: 1.1rem; line-height: 1.6">${formattedBook.description}</p>
        `;
        elements.modal.classList.remove('hidden');
    } catch (error) {
        alert(translations[currentLang].error);
    } finally {
        toggleLoading(false);
    }
};

const handleSearch = async () => {
    const query = elements.searchInput.value.trim();
    if (!query) return;

    toggleLoading(true);
    elements.resultsContainer.innerHTML = '';

    try {
        const works = await apiService.getBooksByCategory(query);
        if (works && works.length > 0) {
            renderBooks(works);
        } else {
            // Optimized: Better empty results handling (Marco's Feedback)
            elements.resultsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                    <p style="font-size: 1.3rem; color: #666;">
                        🔍 ${translations[currentLang].noResults}
                    </p>
                </div>`;
        }
    } catch (error) {
        elements.resultsContainer.innerHTML = `<p>${translations[currentLang].error}</p>`;
    } finally {
        toggleLoading(false);
    }
};

// 4. DYNAMIC VALIDATION (Marco's Feedback)
// Disable button if input is empty
const validateSearch = () => {
    const query = elements.searchInput.value.trim();
    const isDisabled = query.length === 0;
    
    elements.searchBtn.disabled = isDisabled;
    elements.searchBtn.style.opacity = isDisabled ? "0.5" : "1";
    elements.searchBtn.style.cursor = isDisabled ? "not-allowed" : "pointer";
};

// 5. GLOBAL EVENT LISTENERS
elements.searchBtn.addEventListener('click', handleSearch);
elements.searchInput.addEventListener('input', validateSearch);

// Allow searching by pressing Enter in the input field
elements.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !elements.searchBtn.disabled) {
        handleSearch();
    }
});

elements.btnEn.addEventListener('click', () => updateLanguage('en'));
elements.btnIt.addEventListener('click', () => updateLanguage('it'));
elements.closeModal.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeModal();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.modal.classList.contains('hidden')) {
        closeModal();
    }
});

// 6. INITIALIZATION
updateLanguage(currentLang);
validateSearch(); // Set initial state of search button
