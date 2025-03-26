import os
import sys
import pandas as pd
import numpy as np
from datetime import datetime

# Configuration des chemins
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT_DIR, '..', 'data')
MODELS_DIR = os.path.join(ROOT_DIR, '..', 'models')

# Vérification des répertoires
for directory in [DATA_DIR, MODELS_DIR]:
    if not os.path.exists(directory):
        os.makedirs(directory)

# Configuration des logs
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(ROOT_DIR, '..', 'ml.log')),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

logger.info("Configuration de l'environnement ML pour EuroGenius initialisée")
