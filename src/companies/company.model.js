import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El Nombre de la Empresa Es Obligatorio"]
    },
    impactLevel: {
        type: String,
        required: [true, "El Nivel de Impacto Es Obligatorio"]
    },
    yearsOfExperience: {
        type: Number,
        required: [true, "Los Años de Trayectoria Son Obligatorios"],
        min: [0, "Los Años de Trayectoria no pueden ser negativos"]
    },
    category: {
        type: String,
        required: [true, "La Categoría Empresarial Es Obligatoria"]
    },
    description: {
        type: String,
        required: false,
        maxlength: 500
    },
    contactEmail: {
        type: String,
        required: [true, "El Correo Electrónico de la Empresa Es Obligatorio"],
        unique: true
    },
    contactPhone: {
        type: String,
        required: [true, "El Número de Teléfono de la Empresa Es Obligatorio"],
        minlength: 8,
        maxlength: 8
    },
    status: {
        type: Boolean,
        default: true // true: empresa activa, false: empresa desactivada
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

CompanySchema.methods.toJSON = function() {
    const {__v, _id, ...empresa} = this.toObject();
    empresa.id = _id;
    return empresa;
}

export default mongoose.model("Company", CompanySchema);

