export const existeEmail = async (correo = '', modelo) => {
    const existeEmail = await modelo.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El email ${correo} ya fue registrado`);
    }
};
