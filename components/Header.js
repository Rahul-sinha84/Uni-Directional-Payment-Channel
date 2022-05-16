import Link from "next/link";
import React from "react";
import utils from "./utils";

const Header = ({
  metamaskConnectFunction,
  changeMetamaskStatus,
  currentAccount,
  metamaskStatus,
}) => {
  const address = utils.shortHash(currentAccount);

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__container--left">
          <div className="header__container--left__item">
            <Link href="/AllHashes">All Hashes</Link>
          </div>
          <div className="header__container--left__item">
            <Link href="/ContractInfo">Contract Info</Link>
          </div>
          <div className="header__container--left__item">
            <Link href="/Settings">Settings</Link>
          </div>
        </div>
        <div className="header__container--right">
          {metamaskStatus ? (
            <>
              <div className="header__container--right__address-display">
                {address}
              </div>
            </>
          ) : (
            <button
              onClick={() => metamaskConnectFunction(changeMetamaskStatus)}
              className="header__container--right__connect-btn"
            >
              Connect Metamask
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
