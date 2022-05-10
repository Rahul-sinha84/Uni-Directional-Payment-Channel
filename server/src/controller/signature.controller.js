import Signature from "../schema/ReqSign.js";

const returnFunc = (data, res, message) =>
  res.status(200).json({
    data,
    status: res.statusCode,
    message,
  });

const returnErr = (err, res) => {
  console.log(err);
  return res.status(500).json({
    status: res.statusCode,
    message: err.message,
  });
};

const controllers = {
  getSignatures: async (req, res) => {
    try {
      const { contractAddress } = req.params;
      await Signature.find({ contractAddress })
        .then((response) =>
          returnFunc(response, res, "Successfully retreived !!")
        )
        .catch((err) => returnErr(err, res));
    } catch (err) {
      return returnErr(err, res);
    }
  },
  createSignatures: async (req, res) => {
    try {
      const { contractAddress, amount, description } = req.body;
      await Signature.create({
        contractAddress,
        amount,
        description,
        isComplete: false,
        signature: "",
      })
        .then((response) => returnFunc({}, res, "Successfully Created !!"))
        .catch((err) => returnErr(err, res));
    } catch (err) {
      returnErr(err, res);
    }
  },
  signAmount: async (req, res) => {
    try {
      const { _id, signature } = req.body;
      await Signature.findByIdAndUpdate(
        { _id },
        { signature, isComplete: true }
      )
        .then((response) =>
          returnFunc({}, res, "Successfully signed the amount !!")
        )
        .catch((err) => returnErr(err, res));
    } catch (err) {
      returnErr(err, res);
    }
  },
};

export default controllers;
