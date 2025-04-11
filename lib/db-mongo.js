/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

function DB() {
  const COLLECTION_NAME = 'todos';
  const self = this;
  let db;

  self.type = function() {
    return 'Databases for MongoDB';
  };

  self.init = () => {
    return new Promise((resolve, reject) => {
      const uri = process.env.SCALINGO_MONGO_URL; // Utilisation de la variable d'environnement
      if (!uri) return reject(new Error("SCALINGO_MONGO_URL not set"));

      MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, client) => {
        if (err) return reject(err);
        db = client.db();  // Connexion à la base de données par défaut
        resolve();
      });
    });
  };

  self.count = () => {
    return db.collection(COLLECTION_NAME).countDocuments();
  };

  self.search = () => {
    return db.collection(COLLECTION_NAME).find().toArray().then(result => {
      return result.map(todo => {
        todo.id = todo._id;
        delete todo._id;
        return todo;
      });
    });
  };

  self.create = (item) => {
    return db.collection(COLLECTION_NAME).insertOne(item).then(result => {
      const inserted = result.ops[0];
      inserted.id = inserted._id;
      delete inserted._id;
      return inserted;
    });
  };

  self.read = (id) => {
    return db.collection(COLLECTION_NAME).findOne({ _id: new mongodb.ObjectID(id) }).then(item => {
      if (!item) return null;
      item.id = item._id;
      delete item._id;
      return item;
    });
  };

  self.update = (id, newValue) => {
    delete newValue.id;
    return db.collection(COLLECTION_NAME).findOneAndUpdate(
      { _id: new mongodb.ObjectID(id) },
      { $set: newValue },
      { returnDocument: 'after', upsert: true }
    ).then(res => {
      const item = res.value;
      item.id = item._id;
      delete item._id;
      return item;
    });
  };

  self.delete = (id) => {
    return db.collection(COLLECTION_NAME).deleteOne({ _id: new mongodb.ObjectID(id) }).then(() => {
      return { id: id };
    });
  };
}

module.exports = function() {
  return new DB();
};
