import React from "react";

const ProjectError = () => {
  return (
    <div className="bg-[#FFF9E6] p-4 text-center text-gray-600">
      Warning: There’s no Project Created Please{" "}
      <a
        href="/create"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700"
      >
        Create A Project
      </a>
    </div>
  );
};

export default ProjectError;
