const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

// Example protected endpoint
router.get("/me", requireAuth, async (req, res) => {
  res.json({
    ok: true,
    userId: req.auth.userId
  });
});

module.exports = router;