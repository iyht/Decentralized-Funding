import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import _ from "lodash";

import { ProjectList } from "./projects/project-list";
import { ContractContext } from "./utils/contract_context";
import {ProjectContext} from "./utils/project_context";

export const Dashboard = ({}) => {
  const { manager, provider, signer } = useContext(ContractContext);
  const { projects, setProjects} = useContext(ProjectContext);
  const [projectsAddress, setprojectsAddress] = useState([]);


    useEffect(  () => {
      if(!signer){
          return;
      }
      const tmp = []
      signer.getAddress().then(
          (userAddress) => {
              for (let i = 0; i < projects.length; i++) {
                  if(projects[i].owner == userAddress){
                      tmp.push(projects[i].contractAddr);
                  }
              }
              setprojectsAddress(tmp);
          }
      );



  }, [projects, signer])


  return <ProjectList projects={projectsAddress} />;
};
