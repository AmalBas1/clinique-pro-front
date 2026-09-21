import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 400:
                    console.error("Erreur 400: Requête invalide (Bad Request).", error.response.data);
                    break;

                case 401:
                    localStorage.clear();
                    window.location.href = '/login';
                    break;
                
                case 403:
                    console.error("Erreur 403: Accès refusé (Forbidden).");
                    break;

                case 404:
                    console.error("Erreur 404: Ressource non trouvée.");
                    break;

                case 500:
                    console.error("Erreur 500: Erreur interne du serveur (Server Error).");
                    break;

                default:
                    console.error(`Erreur inattendue: ${status}`);
                    break;
            }
        } else {
            console.error("Erreur réseau: Impossible de contacter le serveur.");
        }
        
    }
);

export default api;