import React from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { deletePost } from "../../actions/post";

const PostItem = ({
  //posts,
  posts: { _id, text, name, avatar, user, likes, comments, date },
  auth,
  deletePost,
}) => {
  //   console.log("auth", auth.user._id);
  //   console.log("posts1", _id);
  //   console.log("post.user", user);
  return (
    <>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <img className="round-img" src={avatar} alt="" />
            <h4>{name}</h4>
          </Link>
        </div>
      </div>

      <div>
        <p className="my-1">{text}</p>
      </div>
      {auth.user._id === user && (
        <button
          onClick={() => deletePost(_id)}
          type="button"
          className="btn btn-danger"
        >
          DELETE
        </button>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { deletePost })(PostItem);
