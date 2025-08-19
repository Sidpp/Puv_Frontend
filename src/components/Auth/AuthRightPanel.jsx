import React from "react";

const AuthRightPanel = ({ children }) => {
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center px-20 py-40">
      <div className="w-full max-w-md shadow-2xl p-6 sm:p-8 rounded-lg bg-grey-700">
        {children}
      </div>
    </div>
  );
};

export default AuthRightPanel;
