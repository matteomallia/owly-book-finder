import axios from 'axios';

/**
 * ApiService Module
 * Implements the Singleton Pattern using ES Modules.
 * This service handles all communications with Open Library.
 */
class ApiService {
    constructor() {
        // Base URL for Open Library
        this.baseUrl = 'https://openlibrary.org';
        
        // Create an Axios instance with a timeout for better UX
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000 // 10 seconds timeout
        });
    }

    /**
     * Fetch books by category (subject)
     * @param {string} category 
     */
    async getBooksByCategory(category) {
        try {
            const response = await this.client.get(`/subjects/${category.toLowerCase()}.json`);
            // Open Library returns the list in the 'works' property
            return response.data.works;
        } catch (error) {
            console.error('Error fetching books by category:', error);
            throw error;
        }
    }

    /**
     * Fetch full description for a specific book
     * @param {string} bookKey - e.g., /works/0L8193508W
     */
    async getBookDetails(bookKey) {
        try {
            const response = await this.client.get(`${bookKey}.json`);
            return response.data;
        } catch (error) {
            console.error('Error fetching book details:', error);
            throw error;
        }
    }
}

// Singleton: We export an instance, not the class itself.
const apiServiceInstance = new ApiService();
export default apiServiceInstance;
