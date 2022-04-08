

# Decentralized Crowdfunding Application

We proposed to develop a decentralized crowdfunding application, which can help people who have great ideas to get their funding, and people who want to contribute to a meaningful project. This DApp offers two approaches to collect funding. One is the standard way, which is donation. Another method is people pay some money to participate in a lottery, and the majority of the funding will be used to support the project. Project creators can decide which approach they want to use to collect money.

# Execution
## Install dependencies
```
yarn install && cd frontend && yarn install && cd ..
```
## Test the frontend web application with local node
Start the local Ether network use hardhat
```
yarn hardhat node
```
Start React Application
```
cd frontend
yarn start
```
Test with the local hardhat node. 
- This is optional. You can also test on any test net.
- When connecting to the MetaMask, make sure to use the Private Key that provide by the local node. For example the follwoing private key.
- Import above Private Key into the MetaMask, and then select the local test net to connect.
```
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## Deploy Contract to Live Net
- To deploy a live testnet, we first need to access the testnet node. AlchemyWeb3 is a company provides the ethereum node service.
- Create a `.env` file that contains the API to the ethereum node, and the testnet account's private key. Make sure the account have some ether to deploy the contract.
- To get the API, go to https://www.alchemyapi.io, sign up, create a new App in its dashboard, and replace "KEY" with its key
- Replace this private key with your Ropsten account private key. To export your private key from Metamask, open Metamask and go to Account Details > Export Private Key. Be aware of NEVER putting real Ether into testing accounts
```
ALCHEMY_API_KEY = "KEY"
ROPSTEN_PRIVATE_KEY = "YOUR ROPSTEN PRIVATE KEY"
```
- `./scripts/deploy.js` is the script the deploy the `Manager`. Run following command to invoke the script and deploy the contract to the testnet.
```
yarn hardhat run scripts/deploy.js --network ropsten
```
- You will then get the following output if everything goes well
```
Manager deployed to: 0x...
✨  Done in 29.24s.
```


## Main Features
- Transparent standard crowdfunding for project owners and investors
- Contributor-first project listing
- Lottery-based crowdfunding to attract more funders and raise more funds

## Incentive Designs
To encourage potential investors/funders to contribute to the crowdfunding projects in our DApp, we design the following incentives:

- Project Listing Priority: Contributors will have a higher priority in project listing than non-contributors when creating crowdfunding projects. The more they contribute, the more exposure their crowdfunding projects will gain.
- Lottery: Project owners can opt for a lottery project where a portion of the funds are set aside as the prize pool for the lottery to attract more funders and funds. All funders will have a chance to win the prize and the more they contribute, the more chance they will get.


## Basic Functionalities
### Project Owners
- Choose from standard crowdfunding project or lottery-based crowdfunding project
- Create a crowdfunding project with details: beneficiary, project title, description and image, funding goal, project duration
- Browse own projects
- Extend the duration of the crowdfunding project if funds raised to date are lower than expected
- Cancel the crowdfunding project if funds are no longer needed
- Complete the crowdfunding project and have the beneficiary receives raised funds
### Investors
- Browse details of all active projects and past projects
- Invest in standard crowdfunding projects with all funds going to the projects
- Invest in lottery-based crowdfunding projects with a chance to win back a larger prize

## APIs for Front End
### Create a project
- function createProject(address receiver, string calldata title,  string calldata desc, string calldata imgUrl, uint256 goalAmount, uint256 duration) external;
- event NewProject(address indexed owner, address indexed receiver, string title, string description, string img_url, uint goalAmount, uint duration);
### View projects
- function getAllProjects () external view returns (Project[] memory);
### View project details
- function getCurrentState() public;
- event stateInfo(address indexed, address indexed, string, string, string, uint256, uint256, uint256, uint, uint, address[]);
### Contribute
- function contribute() public payable returns(bool);
- event fundingRecevied(address indexed, uint256, uint256);
### Cancel project
- function cancelProject() public returns(bool);
- event projectCanceled(address indexed, address indexed, uint256);


## Advanced Functionalities (if time permits)
- Project creation fees - a small fee to prevent abuse and can also be used to compensate transaction fees for early investors
- Reward-based crowdfunding projects - a way for project owners to say thank you to their funders
- More types of lottery games for lottery-based crowdfunding projects - more ways to play!
