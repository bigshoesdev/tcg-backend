import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Card from "../models/Card";

dotenv.config();

const seedData = async () => {
  try {
    console.log("process.env.MONGO_URI", process.env.MONGO_URI);
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/cards";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected.");

    const collectionName = Card.collection.name;
    const collections = await mongoose.connection.db
      .listCollections({ name: collectionName })
      .toArray();

    if (collections.length > 0) {
      console.log(`Dropping collection: ${collectionName}`);
      await mongoose.connection.db.dropCollection(collectionName);
    }

    const mtgFilePath = path.join(__dirname, "../../data/mtg-cards.json");
    const mtgCards = JSON.parse(fs.readFileSync(mtgFilePath, "utf-8")).map(
      (card: any) => ({
        ...card,
        game: "MTG",
        rarity: card.rarity.toLowerCase(), // Normalize rarity to lowercase
      })
    );

    const lorcanaFilePath = path.join(
      __dirname,
      "../../data/lorcana-cards.json"
    );
    const lorcanaCards = JSON.parse(
      fs.readFileSync(lorcanaFilePath, "utf-8")
    ).map((card: any) => ({
      ...card,
      game: "Lorcana",
      rarity: card.rarity.toLowerCase(), // Normalize rarity to lowercase
    }));

    const allCards = [...mtgCards, ...lorcanaCards];

    await Card.insertMany(allCards);
    console.log("Cards have been successfully seeded into the database.");

    // Close the database connection
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding data:", err);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
