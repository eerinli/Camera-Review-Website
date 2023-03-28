import cameraDAO from "../dao/cameraDAO.js"

export default class cameraController {
  static async apiGetcamera(req, res, next) {
    const cameraPerPage = req.query.cameraPerPage ? parseInt(req.query.cameraPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode
    } else if (req.query.name) {
      filters.name = req.query.name
    }

    const { cameraList, totalNumcamera } = await cameraDAO.getcamera({
      filters,
      page,
      cameraPerPage,
    })

    let response = {
      camera: cameraList,
      page: page,
      filters: filters,
      entries_per_page: cameraPerPage,
      total_results: totalNumcamera,
    }
    res.json(response)
  }
  static async apiGetcameraById(req, res, next) {
    try {
      let id = req.params.id || {}
      let camera = await cameraDAO.getcameraByID(id)
      if (!camera) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(camera)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetcameraCuisines(req, res, next) {
    try {
      let cuisines = await cameraDAO.getCuisines()
      res.json(cuisines)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}