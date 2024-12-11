import { Router, Request, Response } from "express";
import esClient from "../config/elasticsearch";
import { CARD_INDEX_NAME } from "../utils/const";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const query = req.body;

  if (!query) {
    return res.status(400).json({ error: "Elasticsearch query is required" });
  }

  try {
    const response = await esClient.search({
      index: CARD_INDEX_NAME,
      body: { query },
    });

    const results = response.hits.hits.map((hit: any) => hit._source);
    res.json(results);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        error: "Failed to execute Elasticsearch query",
        details: err.message,
      });
    } else {
      res.status(500).json({
        error: "Failed to execute Elasticsearch query",
        details: "An unknown error occurred",
      });
    }
  }
});

export default router;
