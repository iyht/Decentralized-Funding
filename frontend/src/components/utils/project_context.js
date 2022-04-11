import { Contract } from "ethers";
import React from "react";


export class Project {
    constructor(contractAddr, contract, title, owner) {
        this.contractAddr = contractAddr;
        this.contract = contract;
        this.title = title;
        this.owner = owner;
    }
}
export const ProjectContext =  React.createContext({
    projects: [],
    setProjects: undefined,
});