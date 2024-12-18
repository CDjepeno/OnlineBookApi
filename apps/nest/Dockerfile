# Étape 1 : Utiliser une image Node.js légère
FROM node:21

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour optimiser le cache Docker
COPY package*.json ./

# Installer les dépendances nécessaires pour le développement
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port utilisé par votre application NestJS (par défaut 3000)
EXPOSE 3000

# Commande pour démarrer l'application en mode développement
# npm run dev
CMD ["npm", "run", "dev"]
