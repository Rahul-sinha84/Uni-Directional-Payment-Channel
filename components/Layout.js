import { useEffect, useState } from "react";
import {
  contractAddress,
  checkMetamaskStatus,
  connectMetamask,
  firstFunc,
  listenToEvents,
} from "./configureMetamask";
import ContractInfo from "../pages/ContractInfo";

import { connect } from "react-redux";
import {
  changeContractInstance,
  changeLoad,
  changeCurrentAccount,
  changeMetamaskConnectFunction,
  changeMetamaskStatus,
  changeNetworkId,
  changeIsPayer,
} from "../redux/action";
import Header from "./Header";

const Layout = ({
  children,
  changeContractInstance,
  changeMetamaskConnectFunction,
  changeCurrentAccount,
  changeLoad,
  changeIsPayer,
  changeNetworkId,
  changeMetamaskStatus,
  state,
}) => {
  const {
    contractInstance,
    currentAccount,
    load,
    networkId,
    metamaskStatus,
    metamaskConnectFunction,
  } = state;

  const [isPayerOrReceiver, setIsPayerOrReveiver] = useState(true);

  //default
  useEffect(() => {
    firstFunc(
      changeContractInstance,
      changeCurrentAccount,
      changeNetworkId,
      changeMetamaskStatus
    );
    checkMetamaskStatus(
      changeMetamaskStatus,
      changeCurrentAccount,
      changeNetworkId
    );
    changeMetamaskConnectFunction(connectMetamask);
  }, []);

  // for updating the change when metamask configuration changes !!
  useEffect(() => {
    // function to update the values of state
    getContractData();
    // for listening of events
    //    listenToEvents(contract);
  }, [currentAccount, contractInstance, load]);

  const getContractData = async () => {
    if (!contractInstance || !currentAccount) return;
    const _payer = await contractInstance.payer();
    const _receiver = await contractInstance.receiver();
    const trueOrFalse =
      parseInt(_payer, 16) === parseInt(currentAccount, 16) ||
      parseInt(_receiver, 16) === parseInt(currentAccount, 16);
    setIsPayerOrReveiver(trueOrFalse);
    changeIsPayer(parseInt(_payer, 16) === parseInt(currentAccount, 16));
  };

  return (
    <>
      {!isPayerOrReceiver ? (
        <h1>This App is not meant for the Current Address !!</h1>
      ) : (
        <>
          <Header
            changeMetamaskStatus={changeMetamaskStatus}
            metamaskConnectFunction={metamaskConnectFunction}
            currentAccount={currentAccount}
            metamaskStatus={metamaskStatus}
          />
          {children}
        </>
      )}
    </>
  );
};

const mapStateToState = (state) => ({ state });
export default connect(mapStateToState, {
  changeContractInstance,
  changeMetamaskConnectFunction,
  changeCurrentAccount,
  changeLoad,
  changeNetworkId,
  changeMetamaskStatus,
  changeIsPayer,
})(Layout);
