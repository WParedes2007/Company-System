import { Router } from "express";
import { check } from "express-validator";
import { createCompany, getCompanies, updateCompany, generateReport } from "./company.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("name", "El nombre de la empresa es obligatorio").not().isEmpty(),
        check("impactLevel", "El nivel de impacto es obligatorio").not().isEmpty(),
        check("yearsOfExperience", "Los años de trayectoria son obligatorios").isNumeric(),
        check("category", "La categoría empresarial es obligatoria").not().isEmpty(),
        check("contactEmail", "El correo electrónico de la empresa es obligatorio").isEmail(),
        check("contactPhone", "El teléfono de la empresa es obligatorio").isLength({ min: 8, max: 8 }),
        validarCampos
    ],
    createCompany
);

router.get(
    "/",
    [
        validarJWT,
    ],
    getCompanies
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("name", "El nombre de la empresa es obligatorio").not().isEmpty(),
        check("impactLevel", "El nivel de impacto es obligatorio").not().isEmpty(),
        check("yearsOfExperience", "Los años de trayectoria son obligatorios").isNumeric(),
        check("category", "La categoría empresarial es obligatoria").not().isEmpty(),
        check("contactEmail", "El correo electrónico de la empresa es obligatorio").isEmail(),
        check("contactPhone", "El teléfono de la empresa es obligatorio").isLength({ min: 8, max: 8 }),
        validarCampos
    ],
    updateCompany
);

router.get(
    "/report",
    [
        validarJWT,
    ],
    generateReport
);

export default router;
