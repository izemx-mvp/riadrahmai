// Centralized mock data for Riad Rahma AI Desk

export type Priority = "Faible" | "Normale" | "Élevée" | "Urgente";
export type Channel = "WhatsApp" | "Site web" | "Téléphone" | "Facebook" | "Instagram" | "Formulaire" | "Appel";

export const CYCLES = ["Maternelle", "Primaire", "Collège", "Lycée"] as const;
export const CLASSES = [
  "PS", "MS", "GS", "CP", "CE1", "CE2", "CM1", "CM2",
  "6ème", "5ème", "4ème", "3ème", "Tronc commun", "1ère Bac", "2ème Bac",
];

export const RECLAMATION_CATEGORIES = [
  "Transport", "Cantine", "Discipline", "Paiement", "Documents",
  "Absence", "Retard", "Pédagogie", "Santé", "Rendez-vous Direction",
];

// ---------- Réclamations (Agent 1) ----------
export interface Reclamation {
  id: string;
  parent: string;
  eleve: string;
  classe: string;
  cycle: string;
  categorie: string;
  priorite: Priority;
  statut: "Nouveau" | "En cours" | "Escaladé" | "Résolu" | "Clôturé";
  message: string;
  responsable: string;
  canal: Channel;
  maj: string;
  sentiment: "Calme" | "Inquiet" | "Mécontent" | "Urgent";
  reponseIA: string;
}

export const reclamations: Reclamation[] = [
  {
    id: "REC-1024", parent: "Mme Benali", eleve: "Adam Benali", classe: "CE2", cycle: "Primaire",
    categorie: "Transport", priorite: "Urgente", statut: "Escaladé", canal: "WhatsApp", maj: "Il y a 12 min",
    sentiment: "Mécontent",
    message: "Le chauffeur est arrivé très en retard aujourd'hui et mon fils est resté longtemps devant la maison.",
    responsable: "Responsable Transport",
    reponseIA: "Bonjour Mme Benali, nous avons bien reçu votre réclamation concernant le transport scolaire d'Adam. Votre demande a été transmise au responsable transport avec un niveau de priorité urgent. Nous revenons vers vous dès vérification auprès du chauffeur. Merci pour votre compréhension.",
  },
  {
    id: "REC-1025", parent: "M. El Amrani", eleve: "Lina El Amrani", classe: "6ème", cycle: "Collège",
    categorie: "Discipline", priorite: "Élevée", statut: "En cours", canal: "WhatsApp", maj: "Il y a 40 min",
    sentiment: "Inquiet",
    message: "Ma fille m'a dit qu'elle a eu un problème avec une autre élève pendant la récréation.",
    responsable: "Vie scolaire",
    reponseIA: "Bonjour M. El Amrani, nous comprenons votre préoccupation concernant Lina. Le service de vie scolaire a été informé et se penche sur la situation. Un responsable reviendra vers vous après vérification. Merci de votre confiance.",
  },
  {
    id: "REC-1026", parent: "Mme Alaoui", eleve: "Yassine Alaoui", classe: "CP", cycle: "Primaire",
    categorie: "Documents", priorite: "Normale", statut: "Nouveau", canal: "Site web", maj: "Il y a 1 h",
    sentiment: "Calme",
    message: "Je n'ai pas reçu l'attestation de scolarité demandée la semaine dernière.",
    responsable: "Administration",
    reponseIA: "Bonjour Mme Alaoui, votre demande d'attestation de scolarité pour Yassine a bien été prise en compte. Le document sera préparé par l'administration et vous sera transmis rapidement. Merci de votre patience.",
  },
  {
    id: "REC-1027", parent: "M. Berrada", eleve: "Salma Berrada", classe: "GS", cycle: "Maternelle",
    categorie: "Cantine", priorite: "Normale", statut: "Résolu", canal: "Téléphone", maj: "Hier",
    sentiment: "Calme",
    message: "Je veux confirmer que le repas de ma fille respecte son allergie alimentaire.",
    responsable: "Cantine",
    reponseIA: "Bonjour M. Berrada, nous confirmons que le service cantine a bien pris en compte l'allergie alimentaire de Salma. Un menu adapté lui est réservé. N'hésitez pas à nous contacter pour toute précision.",
  },
  {
    id: "REC-1028", parent: "Mme Idrissi", eleve: "Omar Idrissi", classe: "1ère Bac", cycle: "Lycée",
    categorie: "Pédagogie", priorite: "Élevée", statut: "Escaladé", canal: "WhatsApp", maj: "Il y a 2 h",
    sentiment: "Inquiet",
    message: "Je souhaite rencontrer le professeur principal concernant la baisse des notes de mon fils.",
    responsable: "Direction Pédagogique",
    reponseIA: "Bonjour Mme Idrissi, nous comprenons votre préoccupation concernant les résultats d'Omar. Votre demande de rendez-vous a été transmise à la direction pédagogique qui vous contactera pour convenir d'un créneau. Merci de votre implication.",
  },
];

// ---------- Admissions (Agent 2) ----------
export interface Prospect {
  id: string;
  parent: string;
  telephone: string;
  email: string;
  eleve: string;
  age: number;
  niveau: string;
  cycle: string;
  transport: boolean;
  cantine: boolean;
  source: Channel;
  statut: string;
  score: number;
  temperature: "Chaud" | "Moyen" | "Froid";
  message: string;
  resumeIA: string;
  prochaineAction: string;
}

export const prospects: Prospect[] = [
  {
    id: "ADM-501", parent: "Mme Sara Lahlou", telephone: "06 12 45 78 90", email: "sara.lahlou@email.ma",
    eleve: "Rayan Lahlou", age: 7, niveau: "CE1", cycle: "Primaire", transport: true, cantine: true,
    source: "WhatsApp", statut: "Rendez-vous demandé", score: 92, temperature: "Chaud",
    message: "Bonjour, je souhaite inscrire mon fils en CE1 pour l'année prochaine. Est-ce possible de visiter l'école ?",
    resumeIA: "Parent très motivé souhaitant une visite de l'école. Besoin transport et cantine confirmés. Prospect prioritaire à contacter rapidement.",
    prochaineAction: "Confirmer un rendez-vous de visite cette semaine.",
  },
  {
    id: "ADM-502", parent: "M. Karim Tazi", telephone: "06 33 22 11 44", email: "k.tazi@email.ma",
    eleve: "Noura Tazi", age: 4, niveau: "MS", cycle: "Maternelle", transport: false, cantine: true,
    source: "Site web", statut: "Nouveau", score: 78, temperature: "Moyen",
    message: "Quels sont les documents nécessaires pour une inscription en maternelle ?",
    resumeIA: "Parent en phase de découverte, demande d'informations sur les documents. Besoin cantine exprimé. À qualifier.",
    prochaineAction: "Envoyer la liste des documents et proposer un rappel.",
  },
  {
    id: "ADM-503", parent: "Mme Amal Chraibi", telephone: "06 70 88 99 10", email: "amal.chraibi@email.ma",
    eleve: "Mehdi Chraibi", age: 14, niveau: "3ème", cycle: "Collège", transport: true, cantine: false,
    source: "Facebook", statut: "À rappeler", score: 84, temperature: "Chaud",
    message: "Je veux savoir si vous avez des places disponibles pour le collège.",
    resumeIA: "Demande de disponibilité de places en 3ème. Besoin transport. Intérêt confirmé, à rappeler pour qualifier.",
    prochaineAction: "Rappeler pour confirmer disponibilité et coordonnées.",
  },
  {
    id: "ADM-504", parent: "M. Nabil Fassi", telephone: "06 61 55 34 12", email: "n.fassi@email.ma",
    eleve: "Inès Fassi", age: 17, niveau: "2ème Bac", cycle: "Lycée", transport: false, cantine: false,
    source: "Instagram", statut: "Information envoyée", score: 65, temperature: "Moyen",
    message: "Est-ce que vous proposez un accompagnement pour les élèves du bac ?",
    resumeIA: "Parent intéressé par l'accompagnement bac. Information envoyée, en attente de retour.",
    prochaineAction: "Relancer sous 3 jours pour proposer un rendez-vous.",
  },
];

export const faq = [
  { q: "Quels cycles sont disponibles ?", a: "L'école accueille les élèves en maternelle, primaire, collège et lycée." },
  { q: "Quels documents sont nécessaires pour l'inscription ?", a: "Copie de l'acte de naissance, photos d'identité, copie CIN du parent, certificat de scolarité, relevé de notes ou livret scolaire selon le niveau." },
  { q: "Est-ce que l'école propose le transport ?", a: "Oui, le service transport peut être proposé selon la zone de résidence. La disponibilité doit être confirmée par l'administration." },
  { q: "Est-ce que l'école propose la cantine ?", a: "Oui, un service cantine est disponible selon les modalités de l'établissement." },
  { q: "Comment prendre rendez-vous ?", a: "Le parent peut laisser son nom, téléphone, niveau souhaité et disponibilité. L'administration le contactera pour confirmer le rendez-vous." },
  { q: "Est-ce qu'il y a des places disponibles ?", a: "Les places disponibles dépendent du niveau demandé. L'agent collecte le niveau et les coordonnées puis transmet à l'administration." },
];

// ---------- RH (Agent 3) ----------
export const postesOuverts = [
  "Enseignant(e) Français — Primaire",
  "Enseignant(e) Mathématiques — Collège",
  "Éducatrice Maternelle",
  "Surveillant Vie Scolaire",
  "Assistant(e) Administratif(ve)",
  "Chauffeur Transport Scolaire",
  "Professeur Physique-Chimie — Lycée",
];

export interface Candidat {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  poste: string;
  experience: string;
  diplome: string;
  langues: string;
  disponibilite: string;
  score: number;
  statut: string;
  resumeIA: string;
  pointsForts: string[];
  pointsAVerifier: string[];
}

export const candidats: Candidat[] = [
  {
    id: "RH-301", nom: "Hind Bakkali", telephone: "06 45 12 33 20", email: "hind.bakkali@email.ma",
    poste: "Éducatrice Maternelle", experience: "5 ans", diplome: "Éducation préscolaire",
    langues: "Français, Arabe", disponibilite: "Immédiate", score: 88, statut: "Présélectionné",
    resumeIA: "Profil solide pour la maternelle avec expérience directe et disponibilité immédiate.",
    pointsForts: ["Expérience directe en maternelle", "Disponibilité immédiate", "Diplôme adapté"],
    pointsAVerifier: ["Références professionnelles", "Approche pédagogique"],
  },
  {
    id: "RH-302", nom: "Youssef Amghar", telephone: "06 22 78 90 11", email: "y.amghar@email.ma",
    poste: "Enseignant Mathématiques — Collège", experience: "8 ans", diplome: "Licence Mathématiques",
    langues: "Français, Arabe", disponibilite: "Septembre", score: 91, statut: "Entretien à planifier",
    resumeIA: "Profil prioritaire, expérience adaptée au collège, bon niveau académique.",
    pointsForts: ["8 ans d'expérience", "Bon niveau académique", "Adapté au collège"],
    pointsAVerifier: ["Disponibilité avant septembre", "Prétentions salariales"],
  },
  {
    id: "RH-303", nom: "Salma El Fassi", telephone: "06 90 11 22 45", email: "salma.elfassi@email.ma",
    poste: "Assistant(e) Administratif(ve)", experience: "3 ans", diplome: "Gestion des entreprises",
    langues: "Français, Arabe, Anglais", disponibilite: "15 jours", score: 76, statut: "À revoir",
    resumeIA: "Profil intéressant pour l'administration, expérience correcte, à valider en entretien.",
    pointsForts: ["Trilingue", "Formation en gestion"],
    pointsAVerifier: ["Expérience en milieu scolaire", "Maîtrise outils bureautiques"],
  },
  {
    id: "RH-304", nom: "Anas Mouline", telephone: "06 55 34 12 88", email: "anas.mouline@email.ma",
    poste: "Chauffeur Transport Scolaire", experience: "6 ans", diplome: "Permis D",
    langues: "Arabe, Français basique", disponibilite: "Immédiate", score: 82, statut: "Présélectionné",
    resumeIA: "Expérience adaptée au transport scolaire, disponibilité immédiate.",
    pointsForts: ["Permis D valide", "Expérience transport scolaire", "Disponibilité immédiate"],
    pointsAVerifier: ["Casier judiciaire", "Connaissance des zones"],
  },
];

export function tempFromScore(score: number): { label: string; variant: "hot" | "warm" | "cold" } {
  if (score >= 80) return { label: "HOT", variant: "hot" };
  if (score >= 50) return { label: "WARM", variant: "warm" };
  return { label: "COLD", variant: "cold" };
}

// ---------- Conversations ----------
export interface Conversation {
  id: string;
  nom: string;
  type: "Parent" | "Prospect" | "Candidat";
  agent: "Réclamations" | "Admissions" | "RH";
  canal: Channel;
  sujet: string;
  statut: "Ouverte" | "Traitée par IA" | "Escaladée" | "Clôturée";
  resumeIA: string;
  actions: string[];
  messages: { from: "user" | "ia"; text: string; time: string }[];
}

export const conversations: Conversation[] = [
  {
    id: "CONV-01", nom: "Mme Benali", type: "Parent", agent: "Réclamations", canal: "WhatsApp",
    sujet: "Réclamation transport", statut: "Escaladée",
    resumeIA: "Parent mécontent d'un retard de transport. Ticket urgent créé et escaladé au responsable transport.",
    actions: ["Escalader au responsable transport", "Rappeler le parent sous 1h"],
    messages: [
      { from: "user", text: "Bonjour, le chauffeur est arrivé très en retard, mon fils est resté devant la maison.", time: "09:12" },
      { from: "ia", text: "Bonjour Mme Benali, nous avons bien reçu votre réclamation concernant le transport scolaire d'Adam. Votre demande a été transmise au responsable transport avec un niveau de priorité urgent.", time: "09:12" },
      { from: "user", text: "Merci, j'attends un retour rapidement.", time: "09:15" },
    ],
  },
  {
    id: "CONV-02", nom: "M. Tazi", type: "Prospect", agent: "Admissions", canal: "Site web",
    sujet: "Inscription maternelle", statut: "Traitée par IA",
    resumeIA: "Prospect demandant les documents pour une inscription en maternelle. Besoin cantine exprimé.",
    actions: ["Envoyer liste documents", "Proposer un rappel"],
    messages: [
      { from: "user", text: "Quels sont les documents nécessaires pour une inscription en maternelle ?", time: "10:02" },
      { from: "ia", text: "Bonjour et bienvenue à G.S Riad Rahma. Les documents généralement demandés sont : acte de naissance, photos d'identité, copie CIN du parent et certificat de scolarité. Souhaitez-vous des informations sur la cantine ?", time: "10:02" },
      { from: "user", text: "Oui, la cantine m'intéresse.", time: "10:05" },
    ],
  },
  {
    id: "CONV-03", nom: "Hind Bakkali", type: "Candidat", agent: "RH", canal: "Formulaire",
    sujet: "Éducatrice maternelle", statut: "Traitée par IA",
    resumeIA: "Candidate expérimentée en maternelle, disponibilité immédiate. Présélectionnée par l'IA.",
    actions: ["Planifier un entretien", "Transmettre à la direction"],
    messages: [
      { from: "user", text: "Bonjour, je souhaite postuler comme éducatrice de maternelle.", time: "11:20" },
      { from: "ia", text: "Bonjour, merci pour votre intérêt pour G.S Riad Rahma. Pouvez-vous préciser votre expérience, diplôme, disponibilité et joindre votre CV ?", time: "11:20" },
      { from: "user", text: "5 ans d'expérience, diplôme en éducation préscolaire, disponible immédiatement.", time: "11:24" },
    ],
  },
  {
    id: "CONV-04", nom: "Mme Alaoui", type: "Parent", agent: "Réclamations", canal: "WhatsApp",
    sujet: "Attestation scolaire", statut: "Traitée par IA",
    resumeIA: "Demande d'attestation de scolarité. Ticket transmis à l'administration.",
    actions: ["Préparer l'attestation", "Notifier le parent"],
    messages: [
      { from: "user", text: "Je n'ai pas reçu l'attestation de scolarité demandée la semaine dernière.", time: "08:45" },
      { from: "ia", text: "Bonjour Mme Alaoui, votre demande d'attestation pour Yassine a bien été prise en compte et transmise à l'administration. Le document vous sera transmis rapidement.", time: "08:45" },
    ],
  },
  {
    id: "CONV-05", nom: "M. Fassi", type: "Prospect", agent: "Admissions", canal: "Facebook",
    sujet: "Inscription lycée", statut: "Ouverte",
    resumeIA: "Prospect intéressé par l'accompagnement bac. Information envoyée, à relancer.",
    actions: ["Relancer sous 3 jours", "Proposer un rendez-vous"],
    messages: [
      { from: "user", text: "Est-ce que vous proposez un accompagnement pour les élèves du bac ?", time: "14:30" },
      { from: "ia", text: "Bonjour, oui G.S Riad Rahma propose un accompagnement pour les élèves du lycée. Souhaitez-vous convenir d'un rendez-vous avec la direction pédagogique ?", time: "14:30" },
    ],
  },
];

// ---------- Tickets ----------
export interface Ticket {
  id: string;
  type: string;
  demandeur: string;
  sujet: string;
  priorite: Priority;
  agent: string;
  responsable: string;
  statut: string;
  creation: string;
  derniereAction: string;
}

export const tickets: Ticket[] = [
  { id: "REC-1024", type: "Réclamation parent", demandeur: "Mme Benali", sujet: "Retard transport scolaire", priorite: "Urgente", agent: "Réclamations", responsable: "Resp. Transport", statut: "Escaladé", creation: "02/07 09:12", derniereAction: "Il y a 12 min" },
  { id: "ADM-501", type: "Demande inscription", demandeur: "Mme Lahlou", sujet: "Inscription CE1", priorite: "Élevée", agent: "Admissions", responsable: "Administration", statut: "En cours", creation: "02/07 08:30", derniereAction: "Il y a 30 min" },
  { id: "RDV-210", type: "Demande rendez-vous", demandeur: "Mme Idrissi", sujet: "RDV direction pédagogique", priorite: "Élevée", agent: "Réclamations", responsable: "Direction", statut: "Escaladé", creation: "02/07 07:50", derniereAction: "Il y a 2 h" },
  { id: "DOC-118", type: "Demande document", demandeur: "Mme Alaoui", sujet: "Attestation scolarité", priorite: "Normale", agent: "Réclamations", responsable: "Administration", statut: "En attente administration", creation: "02/07 08:45", derniereAction: "Il y a 1 h" },
  { id: "RH-302", type: "Demande RH", demandeur: "Youssef Amghar", sujet: "Candidature enseignant maths", priorite: "Normale", agent: "RH", responsable: "Resp. RH", statut: "En cours", creation: "01/07 16:20", derniereAction: "Hier" },
  { id: "REC-1027", type: "Réclamation parent", demandeur: "M. Berrada", sujet: "Allergie cantine", priorite: "Normale", agent: "Réclamations", responsable: "Cantine", statut: "Résolu", creation: "01/07 12:10", derniereAction: "Hier" },
  { id: "INF-090", type: "Information générale", demandeur: "M. Fassi", sujet: "Accompagnement bac", priorite: "Faible", agent: "Admissions", responsable: "Administration", statut: "Clôturé", creation: "30/06 14:30", derniereAction: "Il y a 2 j" },
  { id: "REC-1025", type: "Réclamation parent", demandeur: "M. El Amrani", sujet: "Conflit récréation", priorite: "Élevée", agent: "Réclamations", responsable: "Vie scolaire", statut: "En cours", creation: "02/07 08:20", derniereAction: "Il y a 40 min" },
];

// ---------- Base de connaissances ----------
export interface KnowledgeCard {
  titre: string;
  contenu: string;
  maj: string;
  statut: "Actif" | "Brouillon";
}

export const knowledgeBase: KnowledgeCard[] = [
  { titre: "Informations générales école", contenu: "G.S Riad Rahma est une école privée accueillant les élèves de la maternelle au lycée, avec un encadrement pédagogique de qualité et des services de transport et de cantine.", maj: "Il y a 3 j", statut: "Actif" },
  { titre: "Cycles et niveaux", contenu: "Maternelle (PS, MS, GS), Primaire (CP à CM2), Collège (6ème à 3ème), Lycée (Tronc commun, 1ère Bac, 2ème Bac).", maj: "Il y a 5 j", statut: "Actif" },
  { titre: "Horaires", contenu: "Les cours se déroulent du lundi au vendredi de 8h00 à 16h30. Un service de garderie est disponible selon les modalités de l'établissement.", maj: "Il y a 1 sem.", statut: "Actif" },
  { titre: "Procédure d'inscription", contenu: "Pour toute demande d'inscription, collecter le nom du parent, téléphone, nom de l'élève, âge, niveau souhaité, année scolaire concernée, besoin transport, besoin cantine. Transmettre ensuite à l'administration.", maj: "Il y a 2 j", statut: "Actif" },
  { titre: "Documents demandés", contenu: "Les documents généralement demandés sont : acte de naissance, photos d'identité, copie CIN du parent, certificat de scolarité, relevé de notes ou livret scolaire selon le niveau.", maj: "Il y a 2 j", statut: "Actif" },
  { titre: "Transport scolaire", contenu: "Toute réclamation liée au transport doit être classée au minimum en priorité élevée. Si l'enfant n'a pas été récupéré, est en retard important ou a été déposé au mauvais endroit, escalader immédiatement au responsable transport.", maj: "Il y a 4 j", statut: "Actif" },
  { titre: "Cantine", contenu: "Un service cantine est disponible. Les allergies alimentaires doivent être signalées et un menu adapté est proposé après confirmation.", maj: "Il y a 6 j", statut: "Actif" },
  { titre: "Règlement interne", contenu: "Le règlement interne encadre la vie scolaire, la discipline, les absences et les retards. Il est communiqué aux parents lors de l'inscription.", maj: "Il y a 1 sem.", statut: "Brouillon" },
  { titre: "Réclamations et escalade", contenu: "Les sujets disciplinaires doivent être transmis à la vie scolaire. Si le parent demande la direction ou mentionne violence, harcèlement ou sanction grave, escalader à la direction pédagogique.", maj: "Il y a 3 j", statut: "Actif" },
  { titre: "RH et recrutement", contenu: "Pour toute candidature, collecter nom, téléphone, email, poste souhaité, diplôme, expérience, disponibilité, langues parlées et CV.", maj: "Il y a 5 j", statut: "Actif" },
  { titre: "Réponses validées", contenu: "Bibliothèque de réponses types validées par la direction pour garantir un ton professionnel, rassurant et homogène dans toutes les communications.", maj: "Il y a 2 j", statut: "Actif" },
  { titre: "Questions fréquentes", contenu: "Recueil des questions les plus posées par les parents concernant les cycles, documents, transport, cantine et rendez-vous.", maj: "Il y a 1 j", statut: "Actif" },
];

// ---------- Utilisateurs ----------
export interface AppUser {
  nom: string;
  role: string;
  acces: string;
  email: string;
  statut: "Actif" | "Inactif";
}

export const users: AppUser[] = [
  { nom: "Directeur Général", role: "Direction", acces: "Accès complet à tout", email: "direction@riadrahma.ma", statut: "Actif" },
  { nom: "Mme Najat", role: "Administration", acces: "Réclamations, admissions, conversations, tickets", email: "najat@riadrahma.ma", statut: "Actif" },
  { nom: "M. Karim", role: "Vie scolaire", acces: "Tickets discipline, absence, retard, comportement", email: "karim@riadrahma.ma", statut: "Actif" },
  { nom: "Mme Salma", role: "Responsable RH", acces: "Module RH + statistiques RH", email: "salma.rh@riadrahma.ma", statut: "Actif" },
  { nom: "M. Hassan", role: "Responsable Transport", acces: "Tickets transport uniquement", email: "hassan.transport@riadrahma.ma", statut: "Actif" },
];

export const roles = [
  { nom: "Direction", desc: "Accès complet à tout." },
  { nom: "Administration", desc: "Accès aux réclamations, admissions, conversations, tickets." },
  { nom: "Responsable RH", desc: "Accès au module RH uniquement + statistiques RH." },
  { nom: "Responsable Transport", desc: "Accès uniquement aux tickets transport." },
  { nom: "Vie scolaire", desc: "Accès aux tickets discipline, absence, retard, comportement." },
  { nom: "Lecture seule", desc: "Accès consultation sans modification." },
];

// ---------- Activité & alertes (Dashboard) ----------
export const activityFeed = [
  { time: "09:15", text: "Parent de Youssef A. a signalé un problème de transport" },
  { time: "09:22", text: "Nouvelle demande d'inscription pour CP" },
  { time: "09:30", text: "Candidature reçue pour poste Enseignant Français" },
  { time: "09:41", text: "Réclamation cantine clôturée" },
  { time: "10:05", text: "Parent demande rendez-vous avec direction" },
  { time: "10:12", text: "IA a répondu à une question sur les documents d'inscription" },
];

export const alerts = [
  { title: "Réclamation transport urgente", desc: "Élève non récupéré à l'heure", level: "Urgente" },
  { title: "Parent demande rendez-vous direction", desc: "Sujet disciplinaire", level: "Élevée" },
  { title: "Candidat HOT", desc: "Enseignant Mathématiques avec 8 ans d'expérience", level: "RH" },
  { title: "Prospect admission chaud", desc: "Parent souhaite visiter l'école demain", level: "Admission" },
];

// ---------- Chart data ----------
export const demandesParCategorie = [
  { name: "Réclamation", value: 42 },
  { name: "Inscription", value: 28 },
  { name: "RH", value: 15 },
  { name: "Information", value: 35 },
];

export const demandesParCycle = [
  { name: "Maternelle", value: 22 },
  { name: "Primaire", value: 38 },
  { name: "Collège", value: 26 },
  { name: "Lycée", value: 14 },
];

export const statutTickets = [
  { name: "Nouveau", value: 12 },
  { name: "En cours", value: 21 },
  { name: "Escaladé", value: 8 },
  { name: "Clôturé", value: 34 },
];

export const volumeConversations = [
  { jour: "Lun", value: 84 },
  { jour: "Mar", value: 96 },
  { jour: "Mer", value: 78 },
  { jour: "Jeu", value: 112 },
  { jour: "Ven", value: 128 },
  { jour: "Sam", value: 64 },
  { jour: "Dim", value: 32 },
];

export const reclamationsParSemaine = [
  { jour: "S-3", value: 22 },
  { jour: "S-2", value: 28 },
  { jour: "S-1", value: 19 },
  { jour: "S", value: 24 },
];
