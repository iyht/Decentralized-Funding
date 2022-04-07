import { ActivateDeactivate } from "./active_deactivate";
import { WalletStatus } from "./WalletState";

function MyWallet(props){

    return <div>
          <ActivateDeactivate/>
          <WalletStatus/>
    </div>
}

export default MyWallet;