const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeTexts(texts: string[], imageFile?: File) {
    try {
        const formData = new FormData();

        // Add text inputs (as a JSON string to keep logic simple on backend)
        if (texts.length > 0) {
            formData.append('text', JSON.stringify(texts));
        }

        // Add image if present
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            body: formData, // fetch automatically sets Content-Type to multipart/form-data
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Analysis failed. Please check the backend connection.');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
