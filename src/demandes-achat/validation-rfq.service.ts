import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationRfqService {
    
    /**
     * Analyse une demande d'achat et retourne son score de qualité et ses alertes.
     */
    validate(rfq: { titre: string; description: string; filters?: any }) {
        const alerts = [];
        let score = 100;

        const fullText = `${rfq.titre} ${rfq.description}`.toLowerCase();

        // 1. Détection des Emails (Le plus critique pour les jetons)
        const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/g;
        const foundEmails = fullText.match(emailRegex);
        if (foundEmails && foundEmails.length > 0) {
            score -= 60;
            alerts.push({
                type: 'CRITICAL',
                message: 'Coordonnées détectées : Adresse email trouvée dans le texte.',
                detail: foundEmails.join(', ')
            });
        }

        // 2. Détection des Téléphones
        // Regex simplifiée pour les formats mobiles/fixes courants
        const phoneRegex = /(?:(?:\+|00)33|0)[1-9](?:[\s.-]*\d{2}){4}|(?:\+|00)212[67]\d{8}/g;
        const foundPhones = fullText.match(phoneRegex);
        if (foundPhones && foundPhones.length > 0) {
            score -= 50;
            alerts.push({
                type: 'CRITICAL',
                message: 'Coordonnées détectées : Numéro de téléphone trouvé.',
                detail: foundPhones.join(', ')
            });
        }

        // 3. Qualité de la description (Aspect technique)
        const wordCount = rfq.description.split(/\s+/).length;
        if (wordCount < 15) {
            score -= 20;
            alerts.push({
                type: 'WARNING',
                message: 'Description trop courte : Manque probablement de détails techniques.',
                detail: `Seulement ${wordCount} mots fournis.`
            });
        } else if (wordCount > 50) {
            score += 10; // Bonus pour les descriptions riches
        }

        // 4. Mots-clés suspects (tentatives de contournement)
        const suspectKeywords = ['contactez-moi', 'appelez', 'whatsapp', 'notre site', 'www.', 'http'];
        const foundKeywords = suspectKeywords.filter(kw => fullText.includes(kw));
        if (foundKeywords.length > 0) {
            score -= 15;
            alerts.push({
                type: 'WARNING',
                message: 'Mots-clés suspects : L\'acheteur tente peut-être d\'orienter le contact hors-plateforme.',
                detail: foundKeywords.join(', ')
            });
        }

        // 5. Analyse du titre
        if (rfq.titre.split(/\s+/).length < 3) {
            score -= 10;
            alerts.push({
                type: 'INFO',
                message: 'Titre peu explicite.',
                detail: 'Un titre de plus de 3 mots est recommandé pour les fournisseurs.'
            });
        }

        // Capage du score entre 0 et 100
        score = Math.max(0, Math.min(100, score));

        return {
            score,
            status: score >= 90 ? 'AUTO_VALIDATED' : (score > 60 ? 'NEEDS_REVIEW' : 'SUSPECTED_LEAK'),
            alerts,
            timestamp: new Date().toISOString()
        };
    }
}
