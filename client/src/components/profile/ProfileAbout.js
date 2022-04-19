import React from "react";

const ProfileAbout = ({ profiles: { bio, skills }, profileUser }) => {
  console.log("bio", bio);
  console.log("skills", skills);

  return (
    <>
      111
      <div className="profile-about bg-light p-2">
        {bio && (
          <>
            <h2 className="text-primary">{profileUser.name}s Bio</h2>
            <p>{bio}</p>
            <div className="line" />
          </>
        )}
        <h2 className="text-primary">Skill Set</h2>
        <div className="skills">
          {skills &&
            skills.map((skill, index) => (
              <div key={index} className="p-1">
                <i className="fas fa-check" /> {skill}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ProfileAbout;
