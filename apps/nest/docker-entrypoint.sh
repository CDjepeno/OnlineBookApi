#!/bin/bash
# apps/nest/docker-entrypoint.sh

set -e

echo "🚀 Démarrage de l'application NestJS..."

# Attendre que la base de données soit prête
echo "⏳ Attente de MySQL..."
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "⏳ En attente de MySQL sur $DB_HOST:$DB_PORT..."
  sleep 2
done

echo "✅ MySQL est prêt !"

# Attendre quelques secondes supplémentaires pour être sûr
sleep 3

# Charger les fixtures si LOAD_FIXTURES=true
if [ "$LOAD_FIXTURES" = "true" ]; then
  echo "🌱 Chargement des fixtures..."
  npm run fixtures:load || echo "⚠️  Erreur lors du chargement des fixtures (peut-être déjà chargées)"
fi

# Démarrer l'application
echo "🎉 Démarrage de NestJS sur le port $PORT..."
exec "$@"