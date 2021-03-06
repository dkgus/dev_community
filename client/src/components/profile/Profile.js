import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProfileById } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";

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
    //console.log("test", profiles[1].githubusername);

    let changeUser = "";
    for (let i = 0; i < profiles.length; i++) {
      //console.log("console1", profiles[i].user.name);
      //console.log("console2", profiles[i].user._id);

      if (profiles[i].user._id === id) {
        changeUser = profiles[i].user;
        setPrfilUser(changeUser);
      }
    }

    getProfileById(id);
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
            style={{ marginTop: "10%" }}
          >
            프로필 리스트
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === id && (
              <Link to="/edit-profile" className="btn btn-dark">
                프로필 편집하기
              </Link>
            )}

          <div
            className="profile-grid my-1"
            style={{ maxWidth: "80%", margin: "0 auto" }}
          >
            <ProfileTop profiles={profiles} profileUser={profileUser} />
            <ProfileAbout profiles={profiles} profileUser={profileUser} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profiles.experience && profiles.experience.length > 0 ? (
                <>
                  {profiles &&
                    profiles.experience.map((experience) => (
                      <ProfileExperience
                        key={experience._id}
                        experience={experience}
                      />
                    ))}
                </>
              ) : (
                <h4> 추가된 경험 항목이 없습니다.</h4>
              )}
            </div>
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profiles.education && profiles.education.length > 0 ? (
                <>
                  {profiles &&
                    profiles.education.map((education) => (
                      <ProfileEducation
                        key={education._id}
                        education={education}
                      />
                    ))}
                </>
              ) : (
                <h4> 추가된 교육 항목이 없습니다.</h4>
              )}
            </div>
            {profiles.githubusername && (
              <ProfileGithub username={profiles.githubusername} />
            )}
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
