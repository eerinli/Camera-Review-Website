import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let cameras

export default class camerasDAO {
  static async injectDB(conn) {
    if (cameras) {
      return
    }
    try {
      cameras = await conn.db(process.env.RESTREVIEWS_NS).collection("cameras")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in camerasDAO: ${e}`,
      )
    }
  }

  static async getcameras({
    filters = null,
    page = 0,
    camerasPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } }
      } else if ("cuisine" in filters) {
        query = { "cuisine": { $eq: filters["cuisine"] } }
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } }
      }
    }

    let cursor
    
    try {
      cursor = await cameras
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { camerasList: [], totalNumcameras: 0 }
    }

    const displayCursor = cursor.limit(camerasPerPage).skip(camerasPerPage * page)

    try {
      const camerasList = await displayCursor.toArray()
      const totalNumcameras = await cameras.countDocuments(query)

      return { camerasList, totalNumcameras }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { camerasList: [], totalNumcameras: 0 }
    }
  }
  static async getcameraByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$camera_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await cameras.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getcameraByID: ${e}`)
      throw e
    }
  }

  static async getCuisines() {
    let cuisines = []
    try {
      cuisines = await cameras.distinct("cuisine")
      return cuisines
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`)
      return cuisines
    }
  }
}



