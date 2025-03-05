'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import companyRoutes from '../src/companies/company.routes.js'
import Usuario from "../src/users/user.model.js";
import { hash } from "argon2";

const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const configurarRutas = (app) => {
    app.use("/companySystem/v1/auth", authRoutes);
    app.use("/companySystem/v1/companies", companyRoutes);
}

const crearAdmin = async () => {
    try {

        const adminExistente = await Usuario.findOne({ email: "admin@gmail.com" });

        if (!adminExistente) {
            const passwordEncriptada = await hash("Admin123");

            const admin = new Usuario({
                name: "Admin",
                surname: "Principal",
                username: "admin",
                email: "admin@gmail.com",
                phone: "12345678",
                password: passwordEncriptada
            });

            await admin.save();  
            console.log("Administrador creado exitosamente.");
        } else {
            console.log("El administrador ya existe.");
        }
    } catch (error) {
        console.error("Error al crear el administrador:", error);
    }
};

const conectarDB = async () => {
    try {
        await dbConnection(); 
        console.log("Conexion Exitosa Con La Base De Datos");
    } catch (error) {
        console.log("Error Al Conectar Con La Base De Datos", error);
    }
}

export const iniciarServidor = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    await conectarDB();
    await crearAdmin();  
    configurarMiddlewares(app);
    configurarRutas(app);

    app.listen(port, () => {
        console.log(`Server Running On Port ${port}`);
    });
}
