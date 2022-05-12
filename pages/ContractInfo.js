import { useState, useEffect } from "react";
import { connect } from "react-redux";
import utils from "../components/utils";

const ContractInfo = ({ state }) => {
  const { contractInstance } = state;

  const [balance, setBalance] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [payer, setPayer] = useState("");
  const [receiver, setReceiver] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  useEffect(() => {
    (async () => await getData())();
    // getData();
  }, [contractInstance]);

  const getData = async () => {
    if (!contractInstance.payer) return;
    const _payer = await contractInstance.payer();
    const _receiver = await contractInstance.receiver();
    const _expiresAt = await contractInstance.endTime();
    const _balance = await contractInstance.getBalance();
    const date = new Date(_expiresAt.toNumber() * 1000);
    const dateVisible = `${date.getDate()} ${utils.getMonthbyNumber(
      date.getMonth() + 1
    )} ${date.getFullYear()}`;
    setPayer(_payer);
    setReceiver(_receiver);
    setBalance(_balance.toNumber() / 10 ** 18);
    setExpiresAt(dateVisible);
    setContractAddress(contractInstance.address);
  };
  return (
    <div className="contract-info">
      <div className="contract-info__container">
        <div className="contract-info__container--inner">
          <div className="contract-info__container--inner__item">
            <div className="contract-info__key">Contract Address: </div>
            <div className="contract-info__value">{contractAddress}</div>
          </div>
          <div className="contract-info__container--inner__item">
            <div className="contract-info__key">Payer:</div>
            <div className="contract-info__value">{payer}</div>
          </div>
          <div className="contract-info__container--inner__item">
            <div className="contract-info__key">Receiver: </div>
            <div className="contract-info__value">{receiver}</div>
          </div>
          <div className="contract-info__container--inner__item">
            <div className="contract-info__key">Current Balance: </div>
            <div className="contract-info__value">{balance} ETH</div>
          </div>
          <div className="contract-info__container--inner__item">
            <div className="contract-info__key">Expiration Date: </div>
            <div className="contract-info__value">{expiresAt}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToState = (state) => ({ state });
export default connect(mapStateToState)(ContractInfo);
