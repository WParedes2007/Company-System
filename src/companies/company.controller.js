import Company from "../companies/company.model.js";
import ExcelJS from "exceljs";

export const createCompany = async (req, res) => {
    try {
        const { name, impactLevel, yearsOfExperience, category, description, contactEmail, contactPhone } = req.body;

        const existingCompany = await Company.findOne({ contactEmail });
        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: "Ya existe una empresa registrada con este correo electrónico."
            });
        }

        const company = new Company({
            name,
            impactLevel,
            yearsOfExperience,
            category,
            description,
            contactEmail,
            contactPhone
        });

        await company.save();

        res.status(201).json({
            success: true,
            message: "Empresa registrada correctamente",
            company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al registrar la empresa",
            error: error.message
        });
    }
};

export const getCompanies = async (req, res) => {
    try {
        const { filter, sort } = req.query;  // Filtros y ordenación (opcional)

        // Construir consulta dinámica para el filtrado
        const filterQuery = {};
        if (filter) {
            const filterCriteria = JSON.parse(filter); // Parsear los filtros JSON
            if (filterCriteria.category) filterQuery.category = filterCriteria.category;
            if (filterCriteria.yearsOfExperience) filterQuery.yearsOfExperience = { $gte: filterCriteria.yearsOfExperience };
            if (filterCriteria.impactLevel) filterQuery.impactLevel = filterCriteria.impactLevel;
        }

        // Ordenar la información, si se solicita
        const sortQuery = sort ? JSON.parse(sort) : { name: 1 };  // Por defecto, por nombre

        // Obtener empresas filtradas y ordenadas
        const companies = await Company.find(filterQuery).sort(sortQuery);

        res.status(200).json({
            success: true,
            companies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las empresas",
            error: error.message
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, impactLevel, yearsOfExperience, category, description, contactEmail, contactPhone } = req.body;

        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Empresa no encontrada"
            });
        }

        const updatedCompany = await Company.findByIdAndUpdate(id, {
            name,
            impactLevel,
            yearsOfExperience,
            category,
            description,
            contactEmail,
            contactPhone
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Empresa actualizada correctamente",
            updatedCompany
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la empresa",
            error: error.message
        });
    }
};

// Generación de reporte Excel de todas las empresas
export const generateReport = async (req, res) => {
    try {
        const companies = await Company.find({});

        // Crear un libro de trabajo y hoja de trabajo
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Empresas');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 36 },
            { header: 'Nombre', key: 'name', width: 30 },
            { header: 'Nivel de Impacto', key: 'impactLevel', width: 20 },
            { header: 'Años de Trayectoria', key: 'yearsOfExperience', width: 20 },
            { header: 'Categoría', key: 'category', width: 20 },
            { header: 'Descripción', key: 'description', width: 50 },
            { header: 'Correo Electrónico', key: 'contactEmail', width: 30 },
            { header: 'Teléfono', key: 'contactPhone', width: 20 },
            { header: 'Fecha de Registro', key: 'registrationDate', width: 30 },
            { header: 'Estado', key: 'status', width: 15 }
        ];

        companies.forEach(company => {
            worksheet.addRow({
                id: company.id,
                name: company.name,
                impactLevel: company.impactLevel,
                yearsOfExperience: company.yearsOfExperience,
                category: company.category,
                description: company.description || 'N/A',
                contactEmail: company.contactEmail,
                contactPhone: company.contactPhone,
                registrationDate: company.registrationDate.toISOString().slice(0, 10),
                status: company.status ? 'Activa' : 'Inactiva'
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Empresas.xlsx');
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al generar el reporte",
            error: error.message
        });
    }
};
