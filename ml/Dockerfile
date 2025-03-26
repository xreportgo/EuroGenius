# Dockerfile pour le service ML Python
FROM python:3.9-slim

WORKDIR /app

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copie des fichiers de dépendances
COPY requirements.txt .

# Installation des dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copie du reste des fichiers
COPY . .

# Exposition du port
EXPOSE 5000

# Commande de démarrage
CMD ["python", "src/app.py"]
