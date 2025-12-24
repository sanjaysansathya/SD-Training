const express = require("express");
const router = express.Router();
const controller = require("../controllers/booking.controller");

router.post("/seed", controller.seedSeats);
router.get("/seats", controller.getSeats);
router.post("/hold", controller.holdSeat);
router.post("/confirm", controller.confirmSeat);
router.post("/cancel", controller.cancelHold);

module.exports = router;
