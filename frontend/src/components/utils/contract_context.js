import React from "react";
export const ContractContext =  React.createContext({
    provider: undefined,
    signer: undefined,
    manager: undefined,
    setManager: () => {},
    setProvider: () => {},
    setSigner: () => {}
});