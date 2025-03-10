import Usuario from '../users/user.model.js';

export const existenteEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});

    if(existeEmail){
        throw new Error(`El Correo ${correo} Ya Existe En La Data Base`);
    }
}

export const existeUsuarioById = async (id = "") => {
    const existeUsuario = await Usuario.findById(id);
    console.log("Id")
    if(!existeUsuario){
        throw new Error(`El Id ${id} no existe`);
    }
}