const express = require("express")
const router = express.Router();
const controller = require("./controller")

router
   .route("/users")
   .get(controller.getUsers)
   .post(controller.postUsers)

router
   .route("/users/:id")
   .put(controller.putUsers)
   .delete(controller.deleteUsers)


module.exports = router;