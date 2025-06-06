const validatePostCreation = (req, res, next) => {
    try {
        // Validar que existan archivos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: {
                    message: 'Se requiere al menos una imagen para crear el post',
                    status: 400
                }
            });
        }

        // Validar que exista data y sea un JSON válido
        if (!req.body.data) {
            return res.status(400).json({
                error: {
                    message: 'Se requieren los datos del post',
                    status: 400
                }
            });
        }

        // Parsear y validar la data
        const postData = JSON.parse(req.body.data);
        
        if (!postData.description || !postData.author) {
            return res.status(400).json({
                error: {
                    message: 'La descripción y el autor son requeridos',
                    status: 400
                }
            });
        }

        // Si todo está bien, añadir postData parseada al request
        req.postData = postData;
        next();
    } catch (error) {
        return res.status(400).json({
            error: {
                message: 'Error en el formato de los datos del post',
                status: 400
            }
        });
    }
};

module.exports = {
    validatePostCreation
}; 