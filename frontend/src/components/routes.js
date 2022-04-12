import { BrowserRouter, BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { CreateProject } from "./create-project";
import { Dashboard } from "./dashboard";
import { ProjectsBoard } from "./projects-board";
import { SearchProject } from "./search-project";

export const NavRoutes = () => {
  return (
      <Routes >
        <Route exact path="/" element={<SearchProject />} />
        <Route  path="/projects" element={<ProjectsBoard />} />
        <Route  path="/create-project" element={<CreateProject />} />
        <Route  path="/dashboard" element={<Dashboard />} />
      </Routes>
  );
};
