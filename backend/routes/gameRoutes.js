import express from "express";
import { createGame, placeBet, getGameResult, getGameHistory,withdrawFunds,addFunds} from "../controllers/gameControler.js";
import { protect } from "../middleware/auth.js"; // Ensure auth.js uses named exports

const router = express.Router();

router.post("/create", protect, createGame);
router.post("/bet", protect, placeBet);
router.get("/:gameId/result", protect, getGameResult);
router.get("/history", protect, getGameHistory); // Fixed function name
router.post("/add-funds", protect, addFunds);
router.post("/withdraw", protect, withdrawFunds);
export default router;
