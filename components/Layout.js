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
  changeIsContractDead,
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
  changeIsContractDead,
}) => {
  const {
    contractInstance,
    currentAccount,
    load,
    networkId,
    metamaskStatus,
    metamaskConnectFunction,
    isContractDead,
    fullRefresh,
  } = state;

  const [isPayerOrReceiver, setIsPayerOrReveiver] = useState(true);

  //default
  useEffect(() => {
    firstFunc(
      changeContractInstance,
      changeCurrentAccount,
      changeNetworkId,
      changeMetamaskStatus,
      changeIsContractDead
    );
    checkMetamaskStatus(
      changeMetamaskStatus,
      changeCurrentAccount,
      changeNetworkId
    );
    changeMetamaskConnectFunction(connectMetamask);
  }, [fullRefresh]);

  // for updating the change when metamask configuration changes !!
  useEffect(() => {
    // function to update the values of state
    getContractData();
    // for listening of events
    //    listenToEvents(contract);
  }, [currentAccount, contractInstance, load]);

  const getContractData = async () => {
    if (!contractInstance.payer || !currentAccount) return;
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
      {isContractDead ? (
        <h1 style={{ textAlign: "center" }}>
          This Application is revoked by someone, {`it's`} no longer exists !!!
        </h1>
      ) : !isPayerOrReceiver ? (
        <h1 style={{ textAlign: "center" }}>
          This App is not meant for the Current Address !!
        </h1>
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
  changeIsContractDead,
})(Layout);
