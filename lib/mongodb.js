// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // coloque no .env.local
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error("Por favor adicione MONGODB_URI no .env.local");
}

if (process.env.NODE_ENV === "development") {
    // Em dev, usar cache para não recriar conexão
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // Em produção, cria uma nova
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
