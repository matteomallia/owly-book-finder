/**
 * main.js - Core Controller for Owly Book Finder
 * Coordinates ApiService, BookFactory, and UI logic with i18n support.
 */
import apiService from './ApiService.js';
import { BookFactory } from './bookFactory.js';
import { translations } from './i18n.js';

// 1. STATE MANAGEMENT
// Persistent language selection using Web Storage API
let currentLang = localStorage.getItem('owly_lang') || 'en';

// 2. DOM ELEMENTS SELECTION
const elements = {
    title: document.getElementById('ui-title'),
    subtitle: document.getElementById('ui-subtitle'),
    selectLabel: document.getElementById('ui-select-label'),
    searchText: document.getElementById('ui-search-text'),
    loadingText: document.getElementById('ui-loading'),
    categorySelect: document.getElementById('category-select'),
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
/**
 * Updates all UI strings based on selected language and persists choice.
 */
const updateLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('owly_lang', lang); // Store preference
    
    const t = translations[lang];
    
    // Dynamic text replacement
    elements.title.textContent = t.title;
    elements.subtitle.textContent = t.subtitle;
    elements.selectLabel.textContent = t.selectLabel;
    elements.searchText.textContent = t.searchText;
    elements.loadingText.textContent = t.loading;
    
    // Toggle active state on buttons
    elements.btnEn.classList.toggle('active', lang === 'en');
    elements.btnIt.classList.toggle('active', lang === 'it');
};

const toggleLoading = (show) => elements.loader.classList.toggle('hidden', !show);

const closeModal = () => {
    elements.modal.classList.add('hidden');
    // Accessibility: return focus to the main action button
    elements.searchBtn.focus();
};

/**
 * Renders book cards using Factory Pattern to standardize data.
 */
const renderBooks = (books) => {
    elements.resultsContainer.innerHTML = '';
    const t = translations[currentLang];

    books.forEach(bookData => {
        const book = BookFactory.createBook(bookData);

        // Professional DOM manipulation instead of innerHTML strings
        const card = document.createElement('div');
        card.className = 'book-card';

        const title = document.createElement('h3');
        title.className = 'book-title';
        title.textContent = book.title;
        
        // Accessibility attributes for screen readers and keyboard users
        title.setAttribute('role', 'button');
        title.setAttribute('tabindex', '0');
        title.setAttribute('aria-label', `View details for ${book.title}`);

        // Event Listeners for search and interaction
        title.addEventListener('click', () => showBookDescription(book.key));
        title.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') showBookDescription(book.key);
        });

        const author = document.createElement('p');
        author.className = 'book-authors';
        author.textContent = `${t.by}: ${book.authors}`;

        card.append(title, author);
        elements.resultsContainer.appendChild(card);
    });
};

/**
 * Executes second API call for specific book details.
 */
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

/**
 * Main search handler using async/await for network requests.
 */
const handleSearch = async () => {
    const category = elements.categorySelect.value;
    if (!category) return;

    toggleLoading(true);
    elements.resultsContainer.innerHTML = '';

    try {
        const works = await apiService.getBooksByCategory(category);
        if (works && works.length > 0) {
            renderBooks(works);
        } else {
            elements.resultsContainer.innerHTML = `<p>${translations[currentLang].noResults}</p>`;
        }
    } catch (error) {
        elements.resultsContainer.innerHTML = `<p>${translations[currentLang].error}</p>`;
    } finally {
        toggleLoading(false);
    }
};

// 4. GLOBAL EVENT LISTENERS
elements.searchBtn.addEventListener('click', handleSearch);
elements.btnEn.addEventListener('click', () => updateLanguage('en'));
elements.btnIt.addEventListener('click', () => updateLanguage('it'));
elements.closeModal.addEventListener('click', closeModal);

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeModal();
});

// Accessibility: Close modal with Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.modal.classList.contains('hidden')) {
        closeModal();
    }
});

// 5. INITIALIZATION
// Set initial UI strings based on persistent state or default
updateLanguage(currentLang);
