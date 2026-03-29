/**
 * BookFactory Module
 * Implements the Factory Pattern to standardize book data from Open Library API.
 */
export const BookFactory = {
    /**
     * Creates a standardized book object.
     * @param {Object} rawData - The raw data from the API response.
     * @returns {Object} A clean book object ready for the UI.
     */
    createBook(rawData) {
        return {
            // Unique identifier from API
            key: rawData.key,
            
            // Title handling
            title: rawData.title || 'Untitled',
            
            // Author handling: API returns an array of objects. 
            // We transform it into a single readable string. [cite: 22, 282]
            authors: rawData.authors 
                ? rawData.authors.map(author => author.name).join(', ') 
                : 'Unknown Author',
            
            // Description handling: Sometimes it's a string, sometimes an object with a .value property.
            // If missing, we use the custom message requested in the brief.
            description: this._formatDescription(rawData.description)
        };
    },

    /**
     * Private-like utility to handle inconsistent description formats from Open Library.
     */
    _formatDescription(desc) {
        if (!desc) return 'Description will be available soon.';
        
        if (typeof desc === 'object' && desc.value) {
            return desc.value;
        }
        
        return desc;
    }
};