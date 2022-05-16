import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import { connect } from "react-redux";
import utils from "../components/utils";
import BigNumber from "bignumber.js";

const AllHashes = ({ state }) => {
  const { contractInstance, isPayer, currentAccount } = state;

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getDataBackend();
  }, [contractInstance, isPayer]);

  const handleSignBtn = async (_id, amount) => {
    if (!contractInstance.payer) return alert("Contract is not connected !!");
    try {
      console.log(amount.toFixed());
      const msgHash = await contractInstance.getHash(amount.toFixed());
      const { ethereum } = window;
      const signature = await ethereum.request({
        method: "personal_sign",
        params: [currentAccount, msgHash],
      });
      const response = await axios.put("/signatures", {
        _id,
        signature,
      });
      if (response.status === 200) {
        alert("Successfully, signed the amount !!");
        return getDataBackend();
      }
      return alert("Some error occurred !!");
    } catch (err) {
      return utils.handleError(err);
    }
  };

  const getDataBackend = async () => {
    if (!contractInstance.payer) return;
    const response = await axios.get(`/signatures/${contractInstance.address}`);

    const toState = response.data.data.map(
      ({ _id, amount, description, signature, isComplete }) => {
        const amountBN = new BigNumber(amount);
        const displayAmount = amountBN.dividedBy(10 ** 18).toFixed();
        // console.log(amountBN.toFixed());
        return (
          <div key={_id} className="hashes__container--item">
            <div className="hashes__container--item__amount">
              <div className="hashes__container--item__amount--title">
                Amount
              </div>
              <div
                onClick={() =>
                  navigator.clipboard.writeText(amountBN.toFixed())
                }
                className="hashes__container--item__amount--value copy-text"
              >
                {displayAmount} ETH
              </div>
              <div className="copy-text-element">
                Click to Copy Amount in Wei
              </div>
            </div>
            <div className="hashes__container--item__description">
              <div className="hashes__container--item__description--title">
                Description
              </div>
              <div className="hashes__container--item__description--value">
                {description}
              </div>
            </div>
            <div className="hashes__container--item__signature">
              <div className="hashes__container--item__signature--title">
                Signature
              </div>
              <div
                onClick={
                  signature
                    ? () => navigator.clipboard.writeText(signature)
                    : null
                }
                className={`hashes__container--item__signature--value ${
                  signature && "copy-text"
                }`}
              >
                {!signature ? "pending..." : utils.shortHash(signature)}
              </div>
              <div className="copy-text-element">Click to Copy Signature</div>
            </div>
            {isPayer && (
              <div className="hashes__container--item__SignBtn">
                <button
                  onClick={() => handleSignBtn(_id, amountBN)}
                  className={`sign-btn ${isComplete ? "disabled-btn" : ""}`}
                  disabled={isComplete ? true : false}
                >
                  Sign Signature
                </button>
              </div>
            )}
          </div>
        );
      }
    );
    setRequests(toState);
  };

  return (
    <div className="hashes">
      <div className="hashes__title">
        <div className="hashes__title--value">All Hashes so far...</div>
      </div>
      <div className="hashes__container">{requests}</div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps)(AllHashes);
