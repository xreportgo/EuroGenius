# Documentation API - EuroGenius

## Introduction

Cette documentation décrit l'API RESTful d'EuroGenius, permettant d'accéder aux données des tirages EuroMillions, aux statistiques et aux prédictions. L'API est conçue pour être utilisée par le frontend de l'application, mais peut également être intégrée dans d'autres applications.

## Base URL

```
https://api.eurogenius.com/v1
```

## Authentification

L'API utilise l'authentification par token JWT (JSON Web Token). Pour accéder aux endpoints protégés, vous devez inclure le token dans l'en-tête HTTP `Authorization` :

```
Authorization: Bearer <votre_token_jwt>
```

Pour obtenir un token, utilisez l'endpoint d'authentification.

## Endpoints

### Authentification

#### Connexion

```
POST /auth/login
```

Authentifie un utilisateur et renvoie un token JWT.

**Corps de la requête :**
```json
{
  "email": "utilisateur@exemple.com",
  "password": "mot_de_passe"
}
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "email": "utilisateur@exemple.com",
    "name": "Nom Utilisateur"
  }
}
```

#### Inscription

```
POST /auth/register
```

Crée un nouveau compte utilisateur.

**Corps de la requête :**
```json
{
  "email": "nouvel.utilisateur@exemple.com",
  "password": "mot_de_passe",
  "name": "Nom Complet"
}
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 124,
    "email": "nouvel.utilisateur@exemple.com",
    "name": "Nom Complet"
  }
}
```

### Tirages

#### Dernier tirage

```
GET /draws/latest
```

Récupère les informations du dernier tirage EuroMillions.

**Réponse :**
```json
{
  "id": 1500,
  "date": "2025-03-23",
  "numbers": [7, 12, 23, 34, 45],
  "stars": [3, 9],
  "jackpot": "130000000",
  "winners": 0,
  "currency": "EUR"
}
```

#### Prochain tirage

```
GET /draws/next
```

Récupère les informations du prochain tirage EuroMillions.

**Réponse :**
```json
{
  "date": "2025-03-26",
  "jackpot": "145000000",
  "currency": "EUR",
  "closing_time": "2025-03-26T19:30:00Z"
}
```

#### Historique des tirages

```
GET /draws/history
```

Récupère l'historique des tirages EuroMillions.

**Paramètres de requête :**
- `limit` (optionnel) : Nombre de tirages à récupérer (défaut: 10, max: 100)
- `offset` (optionnel) : Décalage pour la pagination (défaut: 0)
- `start_date` (optionnel) : Date de début au format YYYY-MM-DD
- `end_date` (optionnel) : Date de fin au format YYYY-MM-DD

**Réponse :**
```json
{
  "total": 1500,
  "draws": [
    {
      "id": 1500,
      "date": "2025-03-23",
      "numbers": [7, 12, 23, 34, 45],
      "stars": [3, 9],
      "jackpot": "130000000",
      "winners": 0,
      "currency": "EUR"
    },
    {
      "id": 1499,
      "date": "2025-03-20",
      "numbers": [3, 17, 28, 33, 49],
      "stars": [4, 8],
      "jackpot": "120000000",
      "winners": 1,
      "currency": "EUR"
    }
    // ...
  ]
}
```

#### Tirage spécifique

```
GET /draws/:id
```

Récupère les informations d'un tirage spécifique par son ID.

**Réponse :**
```json
{
  "id": 1500,
  "date": "2025-03-23",
  "numbers": [7, 12, 23, 34, 45],
  "stars": [3, 9],
  "jackpot": "130000000",
  "winners": 0,
  "currency": "EUR"
}
```

#### Tirage par date

```
GET /draws/date/:date
```

Récupère les informations d'un tirage par sa date (format YYYY-MM-DD).

**Réponse :**
```json
{
  "id": 1500,
  "date": "2025-03-23",
  "numbers": [7, 12, 23, 34, 45],
  "stars": [3, 9],
  "jackpot": "130000000",
  "winners": 0,
  "currency": "EUR"
}
```

### Statistiques

#### Statistiques des numéros

```
GET /stats/numbers
```

Récupère les statistiques des numéros EuroMillions.

**Paramètres de requête :**
- `period` (optionnel) : Période d'analyse ("all", "year", "6months", "3months", "month")
- `sort` (optionnel) : Critère de tri ("frequency", "frequencyAsc", "number", "lastDrawn", "gap")

**Réponse :**
```json
{
  "stats": [
    {
      "number": 23,
      "frequency": 187,
      "percentage": 12.47,
      "last_drawn": 0,
      "average_gap": 8.2,
      "is_hot": true
    },
    {
      "number": 17,
      "frequency": 175,
      "percentage": 11.67,
      "last_drawn": 3,
      "average_gap": 8.7,
      "is_hot": true
    }
    // ...
  ]
}
```

#### Statistiques des étoiles

```
GET /stats/stars
```

Récupère les statistiques des étoiles EuroMillions.

**Paramètres de requête :**
- `period` (optionnel) : Période d'analyse ("all", "year", "6months", "3months", "month")
- `sort` (optionnel) : Critère de tri ("frequency", "frequencyAsc", "number", "lastDrawn", "gap")

**Réponse :**
```json
{
  "stats": [
    {
      "star": 3,
      "frequency": 142,
      "percentage": 9.47,
      "last_drawn": 0,
      "average_gap": 10.6,
      "is_hot": true
    },
    {
      "star": 8,
      "frequency": 138,
      "percentage": 9.20,
      "last_drawn": 3,
      "average_gap": 10.9,
      "is_hot": true
    }
    // ...
  ]
}
```

#### Statistiques des paires

```
GET /stats/pairs
```

Récupère les statistiques des paires de numéros fréquentes.

**Paramètres de requête :**
- `limit` (optionnel) : Nombre de paires à récupérer (défaut: 10, max: 50)
- `period` (optionnel) : Période d'analyse ("all", "year", "6months", "3months", "month")

**Réponse :**
```json
{
  "pairs": [
    {
      "numbers": [17, 23],
      "frequency": 12,
      "percentage": 0.8
    },
    {
      "numbers": [7, 34],
      "frequency": 10,
      "percentage": 0.67
    }
    // ...
  ]
}
```

#### Statistiques des triplets

```
GET /stats/triplets
```

Récupère les statistiques des triplets de numéros fréquents.

**Paramètres de requête :**
- `limit` (optionnel) : Nombre de triplets à récupérer (défaut: 10, max: 50)
- `period` (optionnel) : Période d'analyse ("all", "year", "6months", "3months", "month")

**Réponse :**
```json
{
  "triplets": [
    {
      "numbers": [7, 17, 23],
      "frequency": 5,
      "percentage": 0.33
    },
    {
      "numbers": [12, 34, 45],
      "frequency": 4,
      "percentage": 0.27
    }
    // ...
  ]
}
```

#### Analyse des écarts

```
GET /stats/gaps
```

Récupère l'analyse des écarts entre apparitions des numéros.

**Paramètres de requête :**
- `type` (optionnel) : Type de numéros ("numbers", "stars")

**Réponse :**
```json
{
  "current_gaps": [
    {
      "number": 49,
      "gap": 18
    },
    {
      "number": 38,
      "gap": 15
    }
    // ...
  ],
  "average_gaps": [
    {
      "number": 23,
      "average_gap": 8.2
    },
    {
      "number": 17,
      "average_gap": 8.7
    }
    // ...
  ],
  "max_gap": 32,
  "min_gap": 1,
  "average_gap": 10.2
}
```

### Prédictions

#### Générer des prédictions

```
POST /predictions/generate
```

Génère des prédictions de combinaisons EuroMillions.

**Corps de la requête :**
```json
{
  "strategy": "balanced",
  "min_confidence": 3.0,
  "count": 5
}
```

**Réponse :**
```json
{
  "combinations": [
    {
      "numbers": [7, 12, 23, 34, 45],
      "stars": [3, 9],
      "confidence": 4.5,
      "strategy": "balanced"
    },
    {
      "numbers": [3, 17, 23, 34, 42],
      "stars": [2, 9],
      "confidence": 4.2,
      "strategy": "balanced"
    }
    // ...
  ]
}
```

#### Historique des prédictions

```
GET /predictions/history
```

Récupère l'historique des prédictions générées par l'utilisateur.

**Paramètres de requête :**
- `limit` (optionnel) : Nombre de prédictions à récupérer (défaut: 10, max: 50)
- `offset` (optionnel) : Décalage pour la pagination (défaut: 0)

**Réponse :**
```json
{
  "total": 25,
  "predictions": [
    {
      "id": 123,
      "date": "2025-03-25T14:30:00Z",
      "numbers": [7, 12, 23, 34, 45],
      "stars": [3, 9],
      "confidence": 4.5,
      "strategy": "balanced"
    },
    {
      "id": 122,
      "date": "2025-03-24T10:15:00Z",
      "numbers": [3, 17, 23, 34, 42],
      "stars": [2, 9],
      "confidence": 4.2,
      "strategy": "balanced"
    }
    // ...
  ]
}
```

### Utilisateurs

#### Profil utilisateur

```
GET /users/profile
```

Récupère le profil de l'utilisateur connecté.

**Réponse :**
```json
{
  "id": 123,
  "email": "utilisateur@exemple.com",
  "name": "Nom Utilisateur",
  "created_at": "2025-01-15T10:30:00Z",
  "preferences": {
    "theme": "dark",
    "default_strategy": "balanced",
    "notifications_enabled": true
  }
}
```

#### Mettre à jour le profil

```
PUT /users/profile
```

Met à jour le profil de l'utilisateur connecté.

**Corps de la requête :**
```json
{
  "name": "Nouveau Nom",
  "preferences": {
    "theme": "light",
    "default_strategy": "conservative",
    "notifications_enabled": false
  }
}
```

**Réponse :**
```json
{
  "id": 123,
  "email": "utilisateur@exemple.com",
  "name": "Nouveau Nom",
  "created_at": "2025-01-15T10:30:00Z",
  "preferences": {
    "theme": "light",
    "default_strategy": "conservative",
    "notifications_enabled": false
  }
}
```

#### Grilles sauvegardées

```
GET /users/grids
```

Récupère les grilles sauvegardées par l'utilisateur.

**Paramètres de requête :**
- `limit` (optionnel) : Nombre de grilles à récupérer (défaut: 10, max: 50)
- `offset` (optionnel) : Décalage pour la pagination (défaut: 0)

**Réponse :**
```json
{
  "total": 15,
  "grids": [
    {
      "id": 45,
      "name": "Ma combinaison préférée",
      "numbers": [7, 12, 23, 34, 45],
      "stars": [3, 9],
      "created_at": "2025-03-20T15:45:00Z"
    },
    {
      "id": 44,
      "name": "Combinaison porte-bonheur",
      "numbers": [3, 17, 23, 34, 42],
      "stars": [2, 9],
      "created_at": "2025-03-18T09:30:00Z"
    }
    // ...
  ]
}
```

#### Sauvegarder une grille

```
POST /users/grids
```

Sauvegarde une nouvelle grille pour l'utilisateur.

**Corps de la requête :**
```json
{
  "name": "Nouvelle combinaison",
  "numbers": [5, 14, 27, 36, 41],
  "stars": [5, 10]
}
```

**Réponse :**
```json
{
  "id": 46,
  "name": "Nouvelle combinaison",
  "numbers": [5, 14, 27, 36, 41],
  "stars": [5, 10],
  "created_at": "2025-03-26T11:20:00Z"
}
```

#### Supprimer une grille

```
DELETE /users/grids/:id
```

Supprime une grille sauvegardée.

**Réponse :**
```json
{
  "success": true,
  "message": "Grille supprimée avec succès"
}
```

## Codes d'erreur

L'API utilise les codes d'état HTTP standard pour indiquer le succès ou l'échec d'une requête :

- `200 OK` : La requête a réussi
- `201 Created` : La ressource a été créée avec succès
- `400 Bad Request` : La requête est invalide ou mal formée
- `401 Unauthorized` : Authentification requise ou échouée
- `403 Forbidden` : Accès refusé à la ressource
- `404 Not Found` : Ressource non trouvée
- `422 Unprocessable Entity` : Validation échouée
- `429 Too Many Requests` : Limite de taux dépassée
- `500 Internal Server Error` : Erreur serveur

## Format des erreurs

En cas d'erreur, l'API renvoie un objet JSON avec les informations suivantes :

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Les données fournies sont invalides",
    "details": {
      "numbers": "Doit contenir exactement 5 numéros uniques entre 1 et 50",
      "stars": "Doit contenir exactement 2 étoiles uniques entre 1 et 12"
    }
  }
}
```

## Limites de taux

Pour éviter les abus, l'API impose des limites de taux :

- Endpoints publics : 60 requêtes par minute
- Endpoints authentifiés : 120 requêtes par minute
- Génération de prédictions : 10 requêtes par minute

Les en-têtes suivants sont inclus dans chaque réponse pour vous aider à gérer ces limites :

- `X-RateLimit-Limit` : Nombre maximal de requêtes autorisées
- `X-RateLimit-Remaining` : Nombre de requêtes restantes dans la fenêtre actuelle
- `X-RateLimit-Reset` : Temps (en secondes) avant la réinitialisation de la limite

## Versionnement

L'API est versionnée via le préfixe d'URL (par exemple, `/v1/`). Les modifications majeures seront introduites dans de nouvelles versions, tandis que les modifications mineures et les corrections de bugs seront appliquées aux versions existantes.

## Support

Pour toute question ou problème concernant l'API, contactez notre équipe de support :

- Email : api-support@eurogenius.com
- Documentation complète : https://api.eurogenius.com/docs

---

© 2025 EuroGenius. Tous droits réservés.
