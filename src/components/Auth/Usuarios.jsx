import React, { useEffect, useState, useContext } from 'react';
import useAuth from "../../context/useAuth";

function Usuarios() {
    const { user, logout } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
/*
    const listar = () => {
        getListUsers()
          .then((data) => { setUsuarios(data) })
          .catch((err) => { console.log(err) });
      };
    
      if (usuarios.length === 0) {
        listar();
      }
    
      const verLista = (e) => {
        setMostrarLista(!mostrarLista);
        console.log("Mostrar lista:", mostrarLista);
        if (mostrarLista) {
          setMostrarLista(false);
        } else {
          setMostrarLista(true);
          setUsuario({
            _id: "",
            nombres: "",
            apellidos: "",  
            telefono: "",
            correo: "",
            documento: "",
            rol: "",
            
          });
        }
      };
    */
  return (
    <div>
      <h1>Bienvenido a la pagina para la gestion de usuarios</h1>
    </div>
  )
}

export default Usuarios
