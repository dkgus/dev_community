import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProfileById } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const Profile = ({ getProfileById, profile: { profiles, loading }, auth }) => {
  const { id } = useParams();
  useEffect(() => {
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
            style={{ paddingTop: "10%" }}
          >
            프로필 리스트
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profiles.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                프로필 편집하기
              </Link>
            )}
        </>
      )}
    </>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, { getProfileById })(Profile);
