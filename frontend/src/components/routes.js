import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { CreateProject } from "./create-project";
import { Dashboard } from "./dashboard";
import { ProjectsBoard } from "./projects-board";
import { SearchProject } from "./search-project";

export const NavRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<SearchProject />} />
      <Route exact path="/projects" element={<ProjectsBoard />} />
      <Route exact path="/create-project" element={<CreateProject />} />
      <Route exact path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};
