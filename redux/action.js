import {
  CONTRACT_INSTANCE,
  CURRENT_ACCOUNT,
  FULL_REFRESH,
  ISPAYER,
  IS_CONTRACT_DEAD,
  LOAD,
  METAMASK_CONNECT_FUNCTION,
  METAMASK_STATUS,
  NETWORK_ID,
} from "./types";

export const changeMetamaskStatus = (payload) => ({
  type: METAMASK_STATUS,
  payload,
});
export const changeContractInstance = (payload) => ({
  type: CONTRACT_INSTANCE,
  payload,
});
export const changeCurrentAccount = (payload) => ({
  type: CURRENT_ACCOUNT,
  payload,
});
export const changeMetamaskConnectFunction = (payload) => ({
  type: METAMASK_CONNECT_FUNCTION,
  payload,
});
export const changeNetworkId = (payload) => ({ type: NETWORK_ID, payload });
export const changeLoad = (payload) => ({ type: LOAD, payload });
export const changeIsPayer = (payload) => ({ type: ISPAYER, payload });
export const changeIsContractDead = (payload) => ({
  type: IS_CONTRACT_DEAD,
  payload,
});
export const changeFullRefresh = (payload) => ({ type: FULL_REFRESH, payload });
