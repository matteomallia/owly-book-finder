# Owly Book Finder 🦉📚
**A JavaScript Advanced Project for the Owly Educational Platform**

Developed by: **Matteo Mallia** 

---

## 📖 Project Overview
**Owly Book Finder** is an interactive web application designed for the **Owly** e-learning platform. Its mission is to incentivize reading in primary schools by allowing children and teachers to explore books by category. 

The app integrates with the **Open Library API** to provide real-time book data, featuring a playful, accessible, and multilingual interface.

## 🛠️ Advanced Technical Features
This project implements several advanced JavaScript concepts covered in the course:

* **Design Patterns**: 
    * **Factory Pattern**: Used in `bookFactory.js` to standardize raw API data into clean objects, ensuring the UI remains decoupled from the data source.
    * **Singleton Pattern**: The `ApiService.js` is implemented as a Singleton to manage a unique connection point to Open Library, optimizing resource usage.
* **Asynchronous Programming**: Extensive use of `async/await` and `Axios` to manage network requests without blocking the main thread.
* **State Persistence**: Implements `localStorage` via the Web Storage API to remember the user's language preference even after page refreshes.
* **Internationalization (i18n)**: Full support for English and Italian, managed through a dedicated modular translation system.
* **Accessibility (A11y)**: Fully navigable via keyboard (Enter to select, ESC to close modals) with proper ARIA roles and descriptive alt tags.

## 🏗️ Folder Structure
Following the professional guidelines requested:
```text
owly-book-app/
├── CSS/          # Responsive styles with CSS Variables
├── IMG/          # Optimized assets and logos
├── JS/           # Modular logic (main, ApiService, Factory, i18n)
├── index.html    # SEO optimized with Open Graph tags
├── vite.config.js# Vite configuration
└── package.json  # Dependency management and scripts
