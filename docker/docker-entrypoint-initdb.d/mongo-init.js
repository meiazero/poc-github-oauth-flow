db = db.getSiblingDB('poc-github-oauth-flow');

const collections = ['users', 'queue'];

collections.map((collection) => {
  db.createCollection(collection);
})