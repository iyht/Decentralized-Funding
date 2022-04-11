import { Contract } from "ethers";
import React from "react";


export class Project {
    constructor(contractAddr, contract, title) {
        this.contractAddr = contractAddr;
        this.contract = contract;
        this.title = title;
    }
}
// export const ProjectContext =  React.createContext({
//     projectsAddress: undefined,
//     projectContracts: undefined,
//     setProjectsAddress: undefined,
//     setProjectContracts: undefined
// });

export const ProjectContext =  React.createContext({
    projects: [],
    setProjects: undefined,
});