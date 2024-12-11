import mongoose, { Schema, Document } from "mongoose";

export enum GameType {
  MTG = "MTG",
  LORCANA = "Lorcana",
}

interface ICard extends Document {
  id: string;
  name: string;
  rarity: string;
  color?: string;
  ink_cost?: number;
  game: GameType;
}

const CardSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rarity: { type: String, required: true },
  color: { type: String },
  ink_cost: { type: Number },
  game: { type: String, required: true },
});

export default mongoose.model<ICard>("Card", CardSchema);
