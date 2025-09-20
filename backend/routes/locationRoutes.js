import express from "express";
import { getCountries, getProvinces, getCities } from "../controllers/locationController.js";

const router = express.Router();

router.get("/countries", getCountries);
router.get("/provinces", getProvinces);
router.get("/cities", getCities);

export default router;
