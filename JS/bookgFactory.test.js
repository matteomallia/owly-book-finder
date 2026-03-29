import { describe, it, expect } from 'vitest';
import { BookFactory } from './bookFactory';

describe('BookFactory', () => {
    // Test 1: Verification of a standard book with all data
    it('should create a valid book object from complete raw data', () => {
        const rawData = {
            key: '/works/OL123W',
            title: 'The Hobbit',
            authors: [{ name: 'J.R.R. Tolkien' }],
            description: 'A great adventure'
        };

        const book = BookFactory.createBook(rawData);

        expect(book.title).toBe('The Hobbit');
        expect(book.authors).toBe('J.R.R. Tolkien');
        expect(book.description).toBe('A great adventure');
    });

    // Test 2: Edge case - missing data
    it('should handle missing authors and description gracefully', () => {
        const rawData = {
            key: '/works/OL456W',
            title: 'Mysterious Book'
            // authors and description are missing
        };

        const book = BookFactory.createBook(rawData);

        expect(book.authors).toBe('Unknown Author');
        expect(book.description).toBe('Description will be available soon.');
    });

    // Test 3: Inconsistent description format (Object instead of String)
    it('should extract text from description if it is an object', () => {
        const rawData = {
            key: '/works/OL789W',
            title: 'Complex Data Book',
            description: { value: 'Extraction successful' }
        };

        const book = BookFactory.createBook(rawData);
        expect(book.description).toBe('Extraction successful');
    });
});