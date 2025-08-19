import React from "react";

const AuthLeftPanel = () => {
  return (
    <div
      className="hidden lg:block w-2/3 bg-[#04254d] relative"
      style={{
        clipPath: "polygon(0 0, 100% 0, 70% 100%, 0% 100%)",
        height: "100vh",
      }}
      
    >
      <div className="absolute top-60 ml-48 flex flex-col items-center text-white px-30">
        <img
          src="/PortfolioVue_logo.png"
          alt="PortfolioVue Logo"
          className="mb-6 w-64 lg:w-96"
        />
        <p className="text-center text-lg lg:text-2xl leading-relaxed font-medium">
          Empowering cross-industry enterprises <br />
          to optimize delivery, maximize ROI, <br />
          and surface predictive insights <br />
          through role-based <br />
          AI dashboards.
        </p>
      </div>
    </div>
  );
};

export default AuthLeftPanel;
