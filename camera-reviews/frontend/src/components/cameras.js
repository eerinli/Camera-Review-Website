import React, { useState, useEffect } from "react";
import cameraDataService from "../services/camera";
import { Link } from "react-router-dom";

const camera = props => {
  const initialcameratate = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
  };
  const [camera, setcamera] = useState(initialcameratate);

  const getcamera = id => {
    cameraDataService.get(id)
      .then(response => {
        setcamera(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getcamera(props.match.params.id);
  }, [props.match.params.id]);

  const deleteReview = (reviewId, index) => {
    cameraDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setcamera((prevState) => {
          prevState.reviews.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {camera ? (
        <div>
          <h5>{camera.name}</h5>
          <p>
            <strong>Cuisine: </strong>{camera.cuisine}<br/>
            <strong>Address: </strong>{camera.address.building} {camera.address.street}, {camera.address.zipcode}
          </p>
          <Link to={"/camera/" + props.match.params.id + "/review"} className="btn btn-primary">
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {camera.reviews.length > 0 ? (
             camera.reviews.map((review, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {review.text}<br/>
                         <strong>User: </strong>{review.name}<br/>
                         <strong>Date: </strong>{review.date}
                       </p>
                       {props.user && props.user.id === review.user_id &&
                          <div className="row">
                            <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                            <Link to={{
                              pathname: "/camera/" + props.match.params.id + "/review",
                              state: {
                                currentReview: review
                              }
                            }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                          </div>                   
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No camera selected.</p>
        </div>
      )}
    </div>
  );
};

export default camera;