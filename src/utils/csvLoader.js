import Papa from 'papaparse';

/**
 * Fetches and parses the product CSV data.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 */
export const fetchProductData = () => {
    return new Promise((resolve, reject) => {
        Papa.parse('/raychanproducts/data/瑞全公司產品履歷.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Filter out any rows that don't have a valid '品番' (Part Number)
                const validData = results.data.filter(item => item['品番']);
                resolve(validData);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};
