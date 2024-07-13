// models/proveedorModel.js
const pool = require('../config/db');

const obtenerProveedores = async () => {
    const result = await pool.query('SELECT * FROM proveedores');
    return result.rows;
};

const obtenerProveedorPorId = async (id) => {
    const result = await pool.query('SELECT * FROM proveedores WHERE id = $1', [id]);
    return result.rows[0];
};

const crearProveedor = async (proveedor) => {
    const { cedula_ruc, nombre_completo, ciudad, tipo_proveedor, direccion, telefono, email, estado } = proveedor;
    const result = await pool.query(
        'INSERT INTO proveedores (cedula_ruc, nombre_completo, ciudad, tipo_proveedor, direccion, telefono, email, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [cedula_ruc, nombre_completo, ciudad, tipo_proveedor, direccion, telefono, email, estado]
    );
    return result.rows[0];
};

const actualizarProveedor = async (id, proveedor) => {
    const { cedula_ruc, nombre_completo, ciudad, tipo_proveedor, direccion, telefono, email, estado } = proveedor;
    const result = await pool.query(
        'UPDATE proveedores SET cedula_ruc = $1, nombre_completo = $2, ciudad = $3, tipo_proveedor = $4, direccion = $5, telefono = $6, email = $7, estado = $8 WHERE id = $9 RETURNING *',
        [cedula_ruc, nombre_completo, ciudad, tipo_proveedor, direccion, telefono, email, estado, id]
    );
    return result.rows[0];
};

const eliminarProveedor = async (id) => {
    await pool.query('DELETE FROM proveedores WHERE id = $1', [id]);
};

module.exports = {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
};
