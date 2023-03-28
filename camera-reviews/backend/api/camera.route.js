import express from "express"
import cameraCtrl from "./camera.controller.js"
import ReviewsCtrl from "./move.controller.js"

const router = express.Router()

router.route("/").get(cameraCtrl.apiGetcamera)
router.route("/id/:id").get(cameraCtrl.apiGetcameraById)
router.route("/cuisines").get(cameraCtrl.apiGetcameraCuisines)

router
  .route("/review")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview)

export default router