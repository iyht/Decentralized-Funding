import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ContributeProject } from "./contribute/contribute-project";
import { CreateProject } from "./create-project";
import { Dashboard } from "./dashboard";
import { ProjectsBoard } from "./projects-board";
import { SearchProject } from "./search-project";
import MyWallet from "./wallet/MyWallet";

export const NavRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<SearchProject />} />
      <Route exact path="/projects" element={<ProjectsBoard />} />
      <Route exact path="/create-project" element={<CreateProject />} />
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route exact path="/contribute" element={<ContributeProject />} />
      {/* <Route exact path="/wallet" element={<MyWallet />} /> */}
    </Routes>
  );
};
