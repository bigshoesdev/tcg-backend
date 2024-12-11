import mongoose from "mongoose";
import dotenv from "dotenv";
import Card from "../models/Card";
import esClient from "../config/elasticsearch";
import { CARD_INDEX_NAME } from "../utils/const";

dotenv.config();

const indexCards = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/cards";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected.");

    const indexExists = await esClient.indices.exists({
      index: CARD_INDEX_NAME,
    });
    if (indexExists) {
      console.log(`Index "${CARD_INDEX_NAME}" exists. Deleting...`);
      await esClient.indices.delete({ index: CARD_INDEX_NAME });
      console.log(`Index "${CARD_INDEX_NAME}" deleted.`);
    }

    await esClient.indices.create({
      index: CARD_INDEX_NAME,
      body: {
        mappings: {
          properties: {
            id: { type: "keyword" },
            name: { type: "text" },
            rarity: { type: "keyword" },
            color: { type: "keyword" },
            ink_cost: { type: "integer" },
            game: { type: "keyword" },
          },
        },
      },
    });
    console.log(`Index "${CARD_INDEX_NAME}" created.`);

    const cards = await Card.find();
    console.log(`Indexing ${cards.length} cards...`);

    const bulkData = cards.flatMap((card) => [
      { index: { _index: CARD_INDEX_NAME, _id: card.id } },
      {
        id: card.id,
        name: card.name,
        rarity: card.rarity,
        color: card.color,
        ink_cost: card.ink_cost,
        game: card.game,
      },
    ]);

    const bulkResponse = await esClient.bulk({ refresh: true, body: bulkData });

    if (bulkResponse.errors) {
      console.error(
        "Errors occurred during bulk indexing:",
        bulkResponse.errors
      );
    } else {
      console.log("Cards indexed successfully.");
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("Error indexing cards:", err);
    mongoose.connection.close();
    process.exit(1);
  }
};

indexCards();
