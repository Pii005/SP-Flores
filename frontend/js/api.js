const ENDPOINT = "http://localhost:3000/casas";


export function obtenerTodos() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        }
        else {
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });

    xhr.open("GET", `${ENDPOINT}`);
    xhr.send();
  });
}

export function crearuno(model) { //CREAR ******************************
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
    }
  };

  xhr.open("POST", `${ENDPOINT}`);
  xhr.setRequestHeader("Content-Type", "application/json");

  // const str = JSON.stringify(model); // lo casteo a string JSON
  xhr.send(JSON.stringify(model));
}

export function getOne(id) {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    //agregamos el manejador de eventos
    if (xhr.readyState == 4) {
      // Petición finalizada
      if (xhr.status == 200) {
        // respuesta del servidor si actualiza con exito
        const obj = JSON.parse(xhr.responseText);
        console.log(obj);
      } else {
        // falló algo
        console.log("ERR " + xhr.status + " :" + xhr.statusText);
      }
    }
  });

  xhr.open("GET", `${ENDPOINT}/${id}`);

  xhr.send(); // lo convierto a un json string
}


export function editOne(model) {
  let xhr = new XMLHttpRequest();
  console.log(model);
  xhr.addEventListener("readystatechange", function () {
    //agregamos el manejador de eventos
    if (xhr.readyState == 4) {
      // Petición finalizada
      if (xhr.status == 200) {
        // respuesta del servidor si actualiza con exito
        console.log("Actualizado con exito");
      } else {
        // falló algo
        console.log("ERR " + xhr.status + " :" + xhr.statusText);
      }
    }
  });

  // Ahora los datos lo pasamos via PUT, debido a que estamos por agregar/manipular el contenido del backend
  // debemos aclarar el tipo de dato que va a viajar en el cuerpo de la peticion
  xhr.open("PUT", `${ENDPOINT}/${model.id}`);
  xhr.setRequestHeader("content-type", "application/json");

  xhr.send(JSON.stringify(model)); // lo convierto a un json string
}

export function deleteOne(id) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    
    xhr.addEventListener("readystatechange", function () {
      //agregamos el manejador de eventos
      if (xhr.readyState == 4) {
        // Petición finalizada
        if (xhr.status == 200) {
          // respuesta del servidor si actualiza con exito
          console.log("Eliminado con exito");
          resolve();
        } else {
          // falló algo
          console.log("ERR " + xhr.status + " :" + xhr.statusText);
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });

    xhr.open("DELETE", `${ENDPOINT}/${id}`);
    xhr.send(); // Elimina el argumento incorrecto
  });
}


export function deleteAll() {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          console.log("Todos los elementos han sido eliminados con éxito");
          resolve();
        } else {
          console.log("ERR " + xhr.status + " :" + xhr.statusText);
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });

    xhr.open("DELETE", `${ENDPOINT}`);
    xhr.send();
  });
}

