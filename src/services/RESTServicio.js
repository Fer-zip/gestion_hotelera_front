import axios from "axios"
import API_URL from "./api";


const axiosBase = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

/**
 * Servicio REST genérico para interactuar con recursos de la API.
 * @param {string} recurso - El nombre del recurso (ej: 'servicios', 'habitaciones').
 * @returns {{Get: function, GetById: function, Post: function, Update: function, Delete: function}} Un objeto con métodos para operaciones CRUD.
 *
 * @example
 * // Uso del servicio para el recurso 'usuarios' ; ¡REFERENCIAL!
 * const userService = RESTServicio('empleados');
 *
 * // Obtener todos los usuarios
 * userService.Get().then(users => {
 *   console.log(users);
 * });
 *
 * // Obtener un usuario por ID
 * userService.GetById(123).then(user => {
 *   console.log(user);
 * });
 *
 * // Crear un nuevo usuario
 * const newUser = { name: 'Juan', email: 'juan@example.com' };
 * userService.Post(newUser).then(createdUser => {
 *   console.log(createdUser);
 * });
 *
 * // Actualizar un usuario
 * const updatedUser = { name: 'Juan Perez' };
 * userService.Update(123, updatedUser).then(result => {
 *   console.log(result);
 * });
 *
 * // Eliminar un usuario
 * userService.Delete(123).then(result => {
 *   console.log(result);
 * });
 */
function RESTServicio(recurso){
    return {
        /**
         * Obtiene todos los elementos del recurso.
         * @returns {Promise<Array>} Una promesa que resuelve con un array de elementos.
         */
        Get: async () =>{
            try{
                const res = await axiosBase.get('/' + recurso)
                return res.data;
            }catch (err){
                console.error("Hubo un error al consultar: " + err)
                throw err;
            }
        },
        /**
         * Obtiene un elemento del recurso por su ID.
         * @param {string|number} id - El ID del elemento a obtener.
         * @returns {Promise<Object>} Una promesa que resuelve con el elemento encontrado.
         */
        GetById: async (id) =>{
          try{
              const res = await axiosBase.get(`/${recurso}/${id}`)
              return res.data;
          }catch (err){
              console.error("Hubo un error al consultar: " + err)
              throw err;
          }
        },
        /**
         * Crea un nuevo elemento del recurso.
         * @param {Object} userData - Los datos del elemento a crear.
         * @returns {Promise<Object>} Una promesa que resuelve con el elemento creado.
         */
        Post: async (userData) => {
            try {
              const response = await axiosBase.post('/'+recurso, userData);
              return response.data;
            } catch (error) {
              console.error('Error al crear ' + recurso + ' : ', error);
              throw error;
            }
        },
        /**
         * Actualiza un elemento del recurso por su ID.
         * @param {string|number} id - El ID del elemento a actualizar.
         * @param {Object} userData - Los datos actualizados del elemento.
         * @returns {Promise<Object>} Una promesa que resuelve con el elemento actualizado.
         */
        Update: async (id, userData) => {
            try {
              const response = await axiosBase.put(`/${recurso}/${id}`, userData);
              return response.data;
            } catch (error) {
              console.error(`Error al actualizar ${recurso} con ID ${id}:`, error);
              throw error;
            }
        },
        /**
         * Elimina un elemento del recurso por su ID.
         * @param {string|number} id - El ID del elemento a eliminar.
         * @returns {Promise<Object>} Una promesa que resuelve con la respuesta de la eliminación.
         */
        Delete: async (id) => {
            try {
              const response = await axiosBase.delete(`/${recurso}/${id}`);
              return response.data; // O simplemente un status de éxito
            } catch (error) {
              console.error(`Error al eliminar ${recurso} con ID ${id}:`, error);
              throw error;
            }
        }


    }
}

// Funciones de servicios para acceso a recursos de backend
export default RESTServicio;