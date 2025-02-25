import {hash, verify} from "argon2";
import Usuario from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    
    const {email,password, username} = req.body;

    try {
        const user = await Usuario.findOne({
            $or: [{email},{username}]
        })

        if(!user){
            return res.status(400).json({
                msg: "Credenciales Incorrectas, Correo No Existente En La Data Base"
            });
        }

        if(!user.status){
            return res.status(400).json({
                msg: "El Usuario No Existe En La Base De Datos"
            }); 
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: "La Contraseña Es Incorrecta"
            })
        }

        const token = await generarJWT(user.id);
        
        res.status(200).json({
            msg: "Inicio De Sesion Exitoso!",
            userDetails: {
                username: user.username,
                token: token
            }
        })

        
    } catch (error) {
        console.log(e);
        res.status(500).json({
            msg: 'Server Error',
            error: e.message
        })
    }
}