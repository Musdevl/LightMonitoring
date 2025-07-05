const express = require("express")
const router = express.Router()
const agentController = require("../controllers/agentController")

router.get("/", agentController.getAllAgent)
router.post("/register", agentController.createAgent)
router.delete("/unregister", agentController.deleteAgent)
module.exports = router