import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProfileById } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";

const Profile = ({ getProfileById, profile: { profiles, loading }, auth }) => {
  const [profileUser, setPrfilUser] = useState("");
  const { id } = useParams();
  useEffect(() => {
    // console.log("user", auth);
    // console.log("auth.user", auth.user);
    // console.log("auth.user.name", auth.user.name);
    // console.log("auth.user._id", auth.user._id);
    // console.log("profiles121221", profiles);
    // console.log("profiles45454", profiles[0].user);
    let changeUser = "";
    for (let i = 0; i < profiles.length; i++) {
      console.log("console1", profiles[i].user.name);
      console.log("console2", profiles[i].user._id);

      if (profiles[i].user._id === id) {
        changeUser = profiles[i].user;
        setPrfilUser(changeUser);
      }
      console.log("changeUser", changeUser);
      console.log("1", profiles[i].user);
    }

    getProfileById(id);
    console.log("profileUser333", profileUser);
  }, [getProfileById, id]);

  return (
    <>
      {profiles === null || loading ? (
        <Spinner />
      ) : (
        <>
          <Link
            to="/profiles"
            className="btn btn-light"
            style={{ paddingTop: "10%" }}
          >
            프로필 리스트
          </Link>
          {auth.isAuthenticated && auth.loading === false && (
            //auth.user.id === profiles.user.id &&
            <Link to="/edit-profile" className="btn btn-dark">
              프로필 편집하기
            </Link>
          )}

          <div className="profile-grid my-1">
            <ProfileTop profiles={profiles} profileUser={profileUser} />
            <ProfileAbout profiles={profiles} profileUser={profileUser} />
          </div>
        </>
      )}
    </>
  );
};

// Profile.propTypes = {
//   getProfileById: PropTypes.func.isRequired,
//   profile: PropTypes.array.isRequired,
//   auth: PropTypes.object.isRequired,
// };
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, { getProfileById })(Profile);
