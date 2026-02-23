export const templateData = [
  // SYSTEM
  {
    name: 'welcome',
    type: 'system',
    channel: 'inApp',
    title: 'Bienvenue',
    content: 'Pensez à compléter votre profil pour pouvoir postuler à un event',
    metadata: { variables: {} },
  },
  {
    name: 'welcome-email',
    type: 'system',
    channel: 'email',
    title: 'Bienvenue sur notre plateforme',
    content:
      '<h1>Bienvenue {{userName}} !</h1><p>Pensez à compléter votre profil pour pouvoir postuler à un événement.</p>',
    metadata: {
      variables: {
        userName: { type: 'string', required: true },
      },
    },
  },

  // PARTICIPATION
  {
    name: 'participation-accepted',
    type: 'participation',
    channel: 'inApp',
    title: 'Participation acceptée',
    content: "Votre participation à l'événement {{eventName}} a été acceptée",
    metadata: {
      variables: {
        eventName: { type: 'string', required: true },
      },
    },
  },
  {
    name: 'participation-accepted-sms',
    type: 'participation',
    channel: 'sms',
    content:
      'Votre participation à {{eventName}} le {{eventDate}} est acceptée. À bientôt !',
    metadata: {
      variables: {
        eventName: { type: 'string', required: true },
        eventDate: { type: 'string', required: true },
      },
    },
  },
  {
    name: 'event-reminder',
    type: 'participation',
    channel: 'inApp',
    title: 'Rappel événement',
    content:
      "N'oubliez pas votre événement {{eventName}} demain à {{eventTime}}",
    metadata: {
      variables: {
        eventName: { type: 'string', required: true },
        eventTime: { type: 'string', required: true },
      },
    },
  },
  {
    name: 'event-reminder-push',
    type: 'participation',
    channel: 'push',
    title: 'Rappel : {{eventName}}',
    content: 'Votre événement commence demain à {{eventTime}}. Préparez-vous !',
    metadata: {
      variables: {
        eventName: { type: 'string', required: true },
        eventTime: { type: 'string', required: true },
      },
    },
  },
  {
    name: 'participation-deleted',
    type: 'participation',
    channel: 'inApp',
    title: 'Participation annulée',
    content: "Votre participation à l'événement {{eventName}} a été annulée par l'organisateur",
    metadata: {
      variables: {
        eventName: { type: 'string', required: true },
      },
    },
  },

  // EVENT
  {
    name: 'event-cancelled',
    type: 'event',
    channel: 'inApp',
    title: 'Événement annulé',
    content: "L'événement {{eventName}} prévu le {{eventDate}} a été annulé",
    metadata: {
      variables: {
        eventName: { type: 'string', required: true },
        eventDate: { type: 'string', required: true },
      },
    },
  },
  {
    name: 'event-cancelled-email',
    type: 'event',
    channel: 'email',
    title: 'Annulation : {{eventName}}',
    content:
      "<h2>Événement annulé</h2><p>Nous sommes désolés de vous informer que l'événement <strong>{{eventName}}</strong> prévu le {{eventDate}} a été annulé.</p><p>Raison : {{cancelReason}}</p>",
    metadata: {
      variables: {
        eventName: { type: 'string', required: true },
        eventDate: { type: 'string', required: true },
        cancelReason: { type: 'string', required: true },
      },
    },
  },
  {
    name: 'event-updated',
    type: 'event',
    channel: 'inApp',
    title: 'Événement modifié',
    content:
      "Des détails de l'événement {{eventName}} ont changé : {{changes}}",
    metadata: {
      variables: {
        eventName: { type: 'string', required: true },
        changes: { type: 'string', required: true },
      },
    },
  },
  {
    name: 'event-announcement',
    type: 'event',
    channel: 'inApp',
    title: 'Nouvel événement',
    content:
      'Nouvel événement {{eventName}} disponible le {{eventDate}} dans votre région',
    metadata: {
      variables: {
        eventName: { type: 'string', required: true },
        eventDate: { type: 'string', required: true },
      },
    },
  },

  // ORGANISATEUR
  {
    name: 'rating-received',
    type: 'event',
    channel: 'inApp',
    title: 'Nouvelle évaluation',
    content:
      "Vous avez reçu une note de {{rating}}/5 pour l'événement {{eventName}}",
    metadata: {
      variables: {
        rating: { type: 'number', required: true },
        eventName: { type: 'string', required: true },
      },
    },
  },
  {
    name: 'participation-request',
    type: 'participation',
    channel: 'inApp',
    title: 'Nouvelle demande',
    content: '{{volunteerName}} a demandé à participer à {{eventName}}',
    metadata: {
      variables: {
        volunteerName: { type: 'string', required: true },
        eventName: { type: 'string', required: true },
      },
    },
  },
  {
    name: 'participation-request-webhook',
    type: 'participation',
    channel: 'webhook',
    content:
      '{"event": "participation_request", "volunteer": "{{volunteerName}}", "event_name": "{{eventName}}", "volunteer_id": {{volunteerId}}, "event_id": {{eventId}}}',
    metadata: {
      variables: {
        volunteerName: { type: 'string', required: true },
        eventName: { type: 'string', required: true },
        volunteerId: { type: 'number', required: true },
        eventId: { type: 'number', required: true },
      },
    },
  },
  {
    name: 'participation-cancelled',
    type: 'participation',
    channel: 'inApp',
    title: 'Désinscription',
    content: "{{volunteerName}} s'est désinscrit de {{eventName}}",
    metadata: {
      variables: {
        volunteerName: { type: 'string', required: true },
        eventName: { type: 'string', required: true },
      },
    },
  },
  {
    name: 'participation-updated',
    type: 'participation',
    channel: 'inApp',
    title: "Modification d'inscription",
    content: '{{volunteerName}} a modifié son inscription à {{eventName}}',
    metadata: {
      variables: {
        volunteerName: { type: 'string', required: true },
        eventName: { type: 'string', required: true },
      },
    },
  },
];
