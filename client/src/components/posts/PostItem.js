import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deletePost, addLike, removeLike } from "../../actions/post";
import Moment from "react-moment";

const PostItem = ({
  //posts,
  posts: { _id, text, name, avatar, user, likes, comment, date },
  auth,
  deletePost,
  addLike,
  removeLike,
  showActions,
}) => {
  //   console.log("auth", auth.user._id);
  //   console.log("posts1", _id);
  //   console.log("post.user", user);
  return (
    <div style={{ paddingBottom: "5%" }}>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <img className="round-img" src={avatar} alt="" />
            <h4>{name}</h4>
          </Link>
        </div>
      </div>

      <div>
        작성일: <Moment format="YYYY/MM/DD">{date}</Moment>
        <p className="my-1">{text}</p>
      </div>

      {showActions && (
        <>
          <button
            onClick={() => addLike(_id)}
            type="button"
            className="btn btn-light"
          >
            <i className="fas fa-thumbs-up" />{" "}
            <span>
              {likes && likes.length > 0 && <span>{likes.length}</span>}
            </span>
          </button>
          <button
            onClick={() => removeLike(_id)}
            type="button"
            className="btn btn-light"
          >
            <i className="fas fa-thumbs-down" />
          </button>
          <Link to={`/posts/${_id}`} className="btn btn-primary">
            Discussion
            {comment && comment.length > 0 && (
              <span className="comment-count"> ({comment.length})</span>
            )}
          </Link>
        </>
      )}

      {auth.user._id === user && (
        <button
          onClick={() => deletePost(_id)}
          type="button"
          className="btn btn-danger"
        >
          DELETE
        </button>
      )}
    </div>
  );
};
PostItem.defaultProps = {
  showActions: true,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { deletePost, addLike, removeLike })(
  PostItem
);
