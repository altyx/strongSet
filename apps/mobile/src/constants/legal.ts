/**
 * Textes légaux affichés dans l'app (CGU et politique de confidentialité).
 *
 * À COMPLÉTER AVANT PUBLICATION : l'identité de l'éditeur et son contact (mentions obligatoires).
 * Tant que ces valeurs sont vides, les textes affichent « [à compléter] ».
 *
 * Changer le fond des CGU : incrémenter TERMS_VERSION. Les utilisateurs ayant accepté une version antérieure
 * le voient dans leurs préférences (termsVersion).
 */
export const LEGAL_EDITOR = {
  // Nom et prénom, ou raison sociale
  name: '',
  // Adresse e-mail de contact
  email: '',
};

export const TERMS_VERSION = 1;
export const LEGAL_UPDATED_AT = '21 octobre 2026';

const editorName = LEGAL_EDITOR.name || "[nom de l'éditeur à compléter]";
const editorEmail = LEGAL_EDITOR.email || '[adresse e-mail à compléter]';

export type LegalSection = { title: string; paragraphs: string[] };
export type LegalDocument = { title: string; sections: LegalSection[] };

export const TERMS: LegalDocument = {
  title: "Conditions générales d'utilisation",
  sections: [
    {
      title: '1. Objet',
      paragraphs: [
        `Les présentes conditions encadrent l'utilisation de l'application StrongSet, éditée par ${editorName} (contact : ${editorEmail}).`,
        "StrongSet permet de créer des programmes de musculation, d'enregistrer ses séances et de suivre sa progression. En utilisant l'application, vous acceptez ces conditions.",
      ],
    },
    {
      title: '2. Accès et fonctionnement',
      paragraphs: [
        "L'application est gratuite et ne nécessite pas de compte. Elle fonctionne sans connexion internet : toutes vos données sont enregistrées uniquement sur votre téléphone.",
        "L'éditeur peut faire évoluer, suspendre ou arrêter l'application à tout moment, sans que cela ouvre droit à une indemnité.",
      ],
    },
    {
      title: '3. Santé et sécurité',
      paragraphs: [
        "StrongSet est un outil de suivi. Il ne fournit aucun conseil médical et ne remplace pas l'avis d'un médecin ou d'un professionnel du sport.",
        "Avant de commencer ou d'intensifier un entraînement, assurez-vous que votre état de santé le permet. Les descriptions d'exercices, charges suggérées et estimations (comme le 1RM) sont indicatives : vous restez seul juge de votre pratique et de votre sécurité, en particulier lors de charges lourdes ou de séries à l'échec.",
      ],
    },
    {
      title: '4. Vos données',
      paragraphs: [
        "Vos données restent sur votre téléphone et vous appartiennent. Elles sont perdues si l'application est supprimée ou si le téléphone est perdu, sauf si vous les avez exportées (Réglages, « Mes données »). Il vous appartient d'en faire des sauvegardes régulières.",
        'Le traitement de vos données est détaillé dans la politique de confidentialité.',
      ],
    },
    {
      title: '5. Responsabilité',
      paragraphs: [
        "L'application est fournie « en l'état ». L'éditeur s'efforce d'en assurer le bon fonctionnement mais ne garantit pas l'absence d'erreurs ou d'interruptions.",
        "Dans les limites permises par la loi, l'éditeur ne peut être tenu responsable d'une blessure liée à la pratique sportive, ni d'une perte de données.",
      ],
    },
    {
      title: '6. Propriété intellectuelle',
      paragraphs: [
        "L'application, son code, son design et ses contenus (notamment les descriptions d'exercices) sont protégés. Toute reproduction ou réutilisation sans autorisation est interdite.",
      ],
    },
    {
      title: '7. Modification des conditions',
      paragraphs: [
        "Ces conditions peuvent évoluer. En cas de changement important, l'application vous demandera de les accepter à nouveau.",
      ],
    },
    {
      title: '8. Droit applicable',
      paragraphs: [
        `Ces conditions sont soumises au droit français. Pour toute question ou réclamation, écrivez à ${editorEmail}. À défaut d'accord amiable, les tribunaux français sont compétents.`,
      ],
    },
  ],
};

export const PRIVACY: LegalDocument = {
  title: 'Politique de confidentialité',
  sections: [
    {
      title: 'Responsable',
      paragraphs: [`L'application StrongSet est éditée par ${editorName}, joignable à ${editorEmail}.`],
    },
    {
      title: 'Aucune collecte',
      paragraphs: [
        "StrongSet ne collecte aucune donnée personnelle. L'application n'a ni compte, ni serveur, ni publicité, ni outil de mesure d'audience : rien n'est envoyé à l'éditeur ni à un tiers.",
      ],
    },
    {
      title: 'Données enregistrées sur votre téléphone',
      paragraphs: [
        "Pour fonctionner, l'application enregistre localement : votre prénom (facultatif), vos réglages, vos programmes, vos exercices, vos séances et vos notes. Les réglages sont chiffrés ; la clé de chiffrement est conservée dans le trousseau sécurisé du téléphone.",
        "Ces données ne quittent votre téléphone que si vous les exportez vous-même (fichier CSV ou sauvegarde JSON) : vous choisissez alors où les envoyer.",
      ],
    },
    {
      title: 'Notifications',
      paragraphs: [
        "Avec votre accord, l'application programme sur votre téléphone une notification locale à la fin du temps de repos. Aucune notification ne passe par un serveur. Vous pouvez retirer cette autorisation dans les réglages du téléphone.",
      ],
    },
    {
      title: 'Vos droits',
      paragraphs: [
        "Vous gardez le contrôle complet de vos données : vous pouvez les modifier, les exporter ou les effacer à tout moment, en supprimant des séances ou en désinstallant l'application.",
        `Pour toute question sur cette politique, écrivez à ${editorEmail}. Vous pouvez aussi saisir la CNIL (cnil.fr).`,
      ],
    },
  ],
};
