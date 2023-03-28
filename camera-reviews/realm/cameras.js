exports = async function(payload, response) {

  const {cameraPerPage = 20, page = 0} = payload.query;

  let query = {};
  if (payload.query.cuisine) {
    query = { $text: { $search: payload.query.cuisine } }
  } else if (payload.query.zipcode) {
    query = { "address.zipcode": { $eq: payload.query.zipcode } }
  } else if (payload.query.name) {
    query = { $text: { $search: payload.query.name } }
  }
    
  const collection = context.services.get("mongodb-atlas").db("sample_camera").collection("camera");
  let cameraList = await collection.find(query).skip(page*cameraPerPage).limit(cameraPerPage).toArray()

  cameraList.forEach(camera => {
    camera._id = camera._id.toString();
  });

  const responseData = {
    camera: cameraList,
    page: page.toString(),
    filters: {},
    entries_per_page: cameraPerPage.toString(),
    total_results: cameraList.length.toString(),
  };
  
  return responseData;
};