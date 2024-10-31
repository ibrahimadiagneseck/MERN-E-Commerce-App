const Coupon = require("../models/couponModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const asynHandler = require("express-async-handler");



const createCoupon = asynHandler(async (req, res) => {
  try {
    // Vérifie si un coupon avec le même nom existe déjà
    const existingCoupon = await Coupon.findOne({ name: req.body.name });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon name already exists" });
    }

    // Si le coupon n'existe pas encore, le crée
    const newCoupon = await Coupon.create(req.body);
    res.status(201).json(newCoupon);
  } catch (error) {
    // Retourne une erreur plus informative
    res.status(500).json({ message: error.message });
  }
});


const getAllCoupons = asynHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asynHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatecoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asynHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletecoupon = await Coupon.findByIdAndDelete(id);
    res.json(deletecoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getCoupon = asynHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    // Récupère le coupon correspondant à l'ID
    const getAcoupon = await Coupon.findById(id);

    if (!getAcoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json(getAcoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
};
