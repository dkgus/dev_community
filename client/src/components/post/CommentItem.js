import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";

import { deleteComment } from "../../actions/post";

const CommentItem = ({
  postId,
  comment: { _id, user, name, text, avatar, date },
  deleteComment,
  auth,
}) => {
  console.log("_id", _id);
  console.log("text", text);
  console.log("postId", postId);

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          작성일: <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>
        {auth.user._id === user && (
          <button
            onClick={() => deleteComment(postId, _id)}
            type="button"
            className="btn btn-danger"
          >
            DELETE
          </button>
        )}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
