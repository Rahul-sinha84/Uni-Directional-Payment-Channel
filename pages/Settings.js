import React, { useState } from "react";
import { connect } from "react-redux";
import utils from "../components/utils";

const Settings = ({ state }) => {
  const { isPayer, contractInstance } = state;
  const [days, setDays] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawSignature, setWithdrawSignature] = useState("");
  const [closeAmount, setCloseAmount] = useState("");
  const [closeSignature, setCloseSignature] = useState("");

  const handleExtendDate = async () => {
    if (days <= 0 || !contractInstance) {
      return alert(
        "Either the contract is not connected or there is an invalid input !!"
      );
    }
    try {
      const tx = await contractInstance.setEndTime(days);
      await tx.wait();
      setDays("");
    } catch (err) {
      return utils.handleError(err);
    }
  };

  const handleDeposit = async () => {
    if (depositAmount <= 0 || !contractInstance) {
      return alert(
        "Either the contract is not connected or there is an invalid input !!"
      );
    }
    try {
      const tx = await contractInstance.deposit({ value: depositAmount });
      await tx.wait();
      setDepositAmount("");
    } catch (err) {
      return utils.handleError(err);
    }
  };

  const handleCancel = async () => {
    if (!contractInstance)
      return alert(
        "The Contract is not connected yet, try reloading the page !!"
      );
    try {
      const tx = await contractInstance.cancel();
      await tx.wait();
    } catch (err) {
      return utils.handleError(err);
    }
  };

  const handleWithdrawAmount = async () => {
    if (withdrawAmount <= 0 || !withdrawSignature || !contractInstance)
      return alert(
        "Either the contract is not connected or there is an invalid input !!"
      );
    try {
      const tx = await contractInstance.withdrawAmount(
        withdrawAmount,
        withdrawSignature
      );
      await tx.wait();
      setWithdrawAmount("");
      setWithdrawSignature("");
    } catch (err) {
      return utils.handleError(err);
    }
  };

  const handleClose = async () => {
    if (closeAmount <= 0 || !closeSignature || !contractInstance)
      return alert(
        "Either the contract is not connected or there is an invalid input !!"
      );
    try {
      const tx = await contractInstance.close(closeAmount, closeSignature);
      await tx.wait();
      setCloseAmount("");
      setCloseSignature("");
    } catch (err) {
      return utils.handleError(err);
    }
  };

  return (
    <div className="settings">
      <div className="settings__container">
        {isPayer ? (
          <>
            <div className="settings__container--item">
              <div className="settings__container--item__title">End Time</div>
              <div className="settings__container--item__description">
                Enter number of days from now to extend the end time of the
                contract.
              </div>
              <div className="settings__container--item__value">
                <div className="single-input">
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Enter number of days from now"
                  />
                  <button onClick={handleExtendDate}>Extend Date</button>
                </div>
              </div>
            </div>
            <div className="settings__container--item">
              <div className="settings__container--item__title">
                Cancel the contract
              </div>
              <div className="settings__container--item__description">
                If the Time period of this contract is over, then cancel it from
                here, Do it only if you know what you are doing !!
              </div>
              <div className="settings__container--item__value">
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
            <div className="settings__container--item">
              <div className="settings__container--item__title">
                Deposit Amount
              </div>
              <div className="settings__container--item__description">
                Enter the amount you want to deposit to the contract.
              </div>
              <div className="settings__container--item__value">
                <div className="single-input">
                  <input
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    type="number"
                    placeholder="Enter amount to deposit (in Wei)"
                  />
                  <button onClick={handleDeposit}>Deposit</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="settings__container--item">
              <div className="settings__container--item__title">
                Withdraw Amount
              </div>
              <div className="settings__container--item__description">
                Provide amount to withdraw and signature signed from payer
                associated with it.
              </div>
              <div className="settings__container--item__value">
                <div className="double-inputs">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="number"
                  />
                  <input
                    type="text"
                    value={withdrawSignature}
                    onChange={(e) => setWithdrawSignature(e.target.value)}
                    placeholder="Enter Signature"
                  />
                  <button onClick={handleWithdrawAmount}>Withdraw</button>
                </div>
              </div>
            </div>
            <div className="settings__container--item">
              <div className="settings__container--item__title">
                Close the Contract
              </div>
              <div className="settings__container--item__description">
                Provide amount to withdraw and signature signed from payer
                associated with it, and close the Contract !!
              </div>
              <div className="settings__container--item__value">
                <div className="double-inputs">
                  <input
                    value={closeAmount}
                    onChange={(e) => setCloseAmount(e.target.value)}
                    type="number"
                    placeholder="Enter amount"
                    className="number"
                  />
                  <input
                    value={closeSignature}
                    onChange={(e) => setCloseSignature(e.target.value)}
                    type="text"
                    placeholder="Enter Signature"
                  />
                  <button onClick={handleClose}>Close</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps)(Settings);
