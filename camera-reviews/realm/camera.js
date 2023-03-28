// This function is the webhook's request handler.
exports = async function(payload, response) {
  
  const id = payload.query.id || ""

  const camera = context.services.get("mongodb-atlas").db("sample_camera").collection("camera");

  const pipeline = [
    {
        $match: {
            _id: BSON.ObjectId(id),
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
      
      camera = await camera.aggregate(pipeline).next()
      camera._id = camera._id.toString()
      
      camera.reviews.forEach(review => {
        review.date = new Date(review.date).toString()
        review._id = review._id.toString();
      });
  return camera
};