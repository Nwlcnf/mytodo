# Application TodoList

Ce projet est une application TodoList déployée sur Scalingo.

## Installation et exécution locale

1. **Cloner le projet** :
   ```sh
   git clone https://github.com/Nwlcnf/mytodo.git
   cd mytodo
   ```

2. **Installer les dépendances** :
   ```sh
   npm install
   ```

3. **Configurer la base de données** :
   - Créer un fichier `.env`
   - Ajouter la variable `MONGO_URL` avec l'URL de connexion 

4. **Vérification variable** :

- Vérifie que ton fichier de connexion MongoDB (`db.js`) utilise bien :

```js
const connectionString = process.env.SCALINGO_MONGO_URL;
MongoClient.connect(connectionString, options, (err, mongoDb) => {
  if (err) {
    reject(err);
    console.error("Erreur connexion MongoDB:", err);
  } else {
    db = mongoDb.db().collection(`todos`);
    resolve();
  }
});
```
5. **Lancer l'application** :
   ```sh
   npm start
   ```

## Déploiement sur Scalingo

1. **Se connecter à Scalingo** :
   ```sh
   scalingo login
   ```

2. **Ajouter l'application** :
   ```sh
   scalingo create mytodolist
   ```

3. **Ajouter MongoDB** :
   ```sh
   scalingo addons-add mongodb free
   ```

4. **Récupérer l'URL de MongoDB** et la configurer :
   ```sh
   scalingo env-set MONGO_URL="URL_MONGO"
   ```

5. **Déployer l'application** :
   ```sh
   git push scalingo master
   ```

L'application est maintenant accessible en ligne.
https://mytodolist.osc-fr1.scalingo.io/
