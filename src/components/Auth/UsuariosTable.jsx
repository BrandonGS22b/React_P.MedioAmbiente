import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const UsuariosTable = ({ usuarios, onEdit, onDelete }) => {
  return (
    <table className="usuarios-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.length > 0 ? (
          usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>{usuario.role}</td>
              <td>
                <button onClick={() => onEdit(usuario)} className="edit-button">
                  <FontAwesomeIcon icon={faEdit} /> Editar
                </button>
                <button onClick={() => onDelete(usuario.id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} /> Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No hay usuarios disponibles.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UsuariosTable;
