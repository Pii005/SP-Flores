import { Casa } from "./casa.js";
import { Planeta } from "./Planeta.js";
import { obtenerTodos, crearuno, deleteOne, deleteAll, editOne } from "./api.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";
import { mostrarBotones, ocultarBotones } from "./botones.js";


const KEY_STORAGE = "Planeta";
let items = []; // array vacío
const formulario = document.getElementById("form-item");
let selectedItemIndex = null; // para mantener el índice del elemento seleccionado

document.addEventListener("DOMContentLoaded", onInit); // importante no poner paréntesis, es un callback

function onInit() {
  loadItems();
  escuchandoFormulario();
  ocultarBotones();
  escuchandoBtnDeleteAll();
  escuchandoBtnBack();
  escuchandoBtnDeleteOne(); // Añadir el listener para el botón de eliminar
  escuchandoBtnEdit();
  escuchandoFiltrador();
  imprimirSeleccionados();
}

async function loadItems() {
  mostrarSpinner();
  try {
    let objetos = await obtenerTodos();
    objetos = objetos || [];
    items = objetos.map(obj => new Planeta(obj.id, obj.nombre, obj.tamaño, obj.masa, obj.tipo, 
      obj.distancia, obj.presentaVida, obj.anillo, obj.composicion));

    rellenarTabla(items);
  } catch (error) {
    alert("Error al cargar los elementos: " + error);
  } finally {
    ocultarSpinner();
  }
}


function rellenarTabla(items) { // Con los items pasados carga la tabla
  const tabla = document.getElementById("table-items");
  let tbody = tabla.getElementsByTagName('tbody')[0];

  tbody.innerHTML = ''; // Me aseguro que esté vacío, hago referencia al agregar otro

  const celdas = ["id", "nombre", "tamaño", "masa", "tipo", "distancia", 
    "presentaVida", "anillo", "composicion"];
  
  items.forEach((item, index) => {
    let nuevaFila = document.createElement("tr");
    nuevaFila.classList.add("table-row");

    celdas.forEach((celda) => {
      let nuevaCelda = document.createElement("td");
      nuevaCelda.textContent = item[celda];
      nuevaFila.appendChild(nuevaCelda);
    });

    addRowClickListener(nuevaFila, index); // Asignar el listener a la fila con el índice correcto

    // Agregar la fila al tbody
    tbody.appendChild(nuevaFila);
  });
}

/* cargar nuevos elementos */
function escuchandoFormulario() {
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    var fechaActual = new Date();

    const model = new Planeta(
      fechaActual.getTime(),
      formulario.querySelector("#Nombre").value,
      formulario.querySelector("#Tamaño").value,
      formulario.querySelector("#Masa").value,
      getselect(), // Obtener valor de select
      formulario.querySelector("#Distancia").value,
      obtenerValorRadio('pvida'),
      obtenerValorRadio('panillo'), // Obtener valor de radio
      formulario.querySelector("#composicion").value,
    );

    console.log(model);
    const respuesta = true;

    if (respuesta) {
      try {
        mostrarSpinner();
        await crearuno(model);
        loadItems(); // Volver a cargar los items y actualizar la tabla
      } catch (error) {
        alert(error);
      } finally {
        ocultarSpinner();
      }
    } else {
      alert(respuesta.rta);
    }
    });
}


function obtenerValorRadio(id) {
  const radios = document.getElementsByName(id);
  let seleccionado = "No";

  for (const radio of radios) {
      if (radio.checked) {
          seleccionado = radio.value;
          break;
      }
  }

  return seleccionado; // <- Devuelve el valor seleccionado
}

function getselect()// OPCIONES **********
{
  const selectElement = document.getElementById('tipo'); // Obtener el elemento select por su ID
  const selectedOption = selectElement.querySelector('option:checked').value;

  console.log("TIpo: " + selectedOption); 
  return selectedOption;
}

/* ELIMAR ITEM SELECCIONADO */
async function eliminarItem() {
  // console.log("Borrar uno")
  if (selectedItemIndex === null) return;

  const item = items[selectedItemIndex]; // Obtener el item a eliminar
  items.splice(selectedItemIndex, 1); // Eliminar del array local

  
  mostrarSpinner();
    try {
      console.log("Borrar uno")
      await deleteOne(item.id); // Eliminar del servidor
      loadItems(); // Volver a cargar los items y actualizar la tabla
      selectedItemIndex = null; // Resetear el índice seleccionado
      actualizarFormulario();
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      ocultarSpinner();
    }
  
}

/* RELLENAR FORMULARIO */
function editarElemento(planeta) {
  formulario.querySelector("#Nombre").value = planeta[1];
  formulario.querySelector("#Tamaño").value = planeta[2];
  formulario.querySelector("#Masa").value = planeta[3];
  formulario.querySelector("#tipo").value = planeta[4];
  formulario.querySelector("#Distancia").value = planeta[5];

  if (planeta[6] === "Sí") {
    formulario.querySelector("#pVida[value='Sí']").checked = true;
  } 

  if (planeta[7] === "Sí") {
    formulario.querySelector("#pAnillo[value='Sí']").checked = true;
  } 

  formulario.querySelector("#composicion").value = planeta[8];

  mostrarBotones(); // Mostrar botones al editar
}



function actualizarFormulario() {
  formulario.reset();
  selectedItemIndex = null; // Resetear el índice seleccionado
}

/* EDITAR AL SELECCIONAR LA FILA */
function addRowClickListener(row, index) {
  row.addEventListener('click', () => {
    const cells = row.querySelectorAll('td');
    const rowData = Array.from(cells).map(cell => cell.textContent);
    console.log(rowData);
    editarElemento(rowData); 
  });
}


/* VOLVER DE EDITAR */
function escuchandoBtnBack() {
  const btn = document.getElementById("btn-back");

  btn.addEventListener("click", async () => {
    const rta = confirm('¿Desea dejar de editar?');

    if (rta) {
      try {
        mostrarSpinner();
        actualizarFormulario();
        ocultarBotones(); // Ocultar botones al dejar de editar
      } catch (error) {
        alert(error);
      } finally {
        ocultarSpinner();
      }
    }
  });
}

/*  ELIMINAR TODO */
function escuchandoBtnDeleteOne() {
  
  const btn = document.getElementById("btn-delete-one");

  btn.addEventListener('click', eliminarItem);
}

function escuchandoBtnDeleteAll() { // Borra todos
  const btn = document.getElementById("btn-delete-all");

  btn.addEventListener("click", async (e) => {
    const rta = confirm('¿Desea eliminar todos los Items?');

    if (rta) {
      try {
        mostrarSpinner();
        await deleteAll();
        items.splice(0, items.length); // Limpiar el array local
        loadItems(); // Volver a cargar los items y actualizar la tabla
      } catch (error) {
        alert(error);
      } finally {
        ocultarSpinner();
      }
    }
  });
}

function escuchandoBtnEdit() {
  const btn = document.getElementById("btn-edit");

  btn.addEventListener('click', editarItem);
}

/* EDITAR ELEMENTO */
async function editarItem() {
  if (selectedItemIndex === null) return;

  const item = items[selectedItemIndex]; // Obtener el item a editar

  const model = new Planeta(
    fechaActual.getTime(),
    formulario.querySelector("#Nombre").value,
    formulario.querySelector("#Tamaño").value,
    formulario.querySelector("#Masa").value,
    getselect(), // Obtener valor de select
    formulario.querySelector("#Distancia").value,
    obtenerValorRadio('pvida'),
    obtenerValorRadio('panillo'), // Obtener valor de radio
    formulario.querySelector("#composicion").value,
  );
  
  const respuesta = true;

  
    mostrarSpinner();
    console.log("EDITANDO");
    try {
      await editOne(model); // Editar en el servidor
      await loadItems(); // Volver a cargar los items y actualizar la tabla
      selectedItemIndex = null; // Resetear el índice seleccionado
      ocultarBotones(); // Ocultar botones de edición
      actualizarFormulario()
    } catch (error) {
      alert(error);
      console.log(error);
    } finally {
      ocultarSpinner();
    }
  // } else {
  //   alert(respuesta.rta);
  // }
}



/* FILTRADOR DE TRANSACCION */
function escuchandoFiltrador() {
  const filtradorBtn = document.getElementById("filtrador");
  const canceladorBtn = document.getElementById("cancelador");

  filtradorBtn.addEventListener("click", function(event) {
    event.preventDefault(); // Evitar envío del formulario por defecto

    const filtroSeleccionado = document.getElementById("filtro-text").value;
    const promedioIngresado = parseFloat(document.getElementById("promedio-text").value); // Convertir a número flotante

    // console.log("Filtro seleccionado:", filtroSeleccionado);
    // console.log("Promedio ingresado:", promedioIngresado);

    // Filtrar elementos según el filtro seleccionado
    let elementosFiltrados = items.filter(item => item.transaccion === filtroSeleccionado);

    // Calcular el promedio de los precios
    const sumModel = elementosFiltrados.reduce((acc, item) => acc + parseFloat(item.precio), 0);
    const promedio = sumModel / elementosFiltrados.length;

    console.log("Promedio de precios:", promedio);

    // Ordenar la tabla en función del promedio
    elementosFiltrados.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));

    // Actualizar la tabla con los elementos ordenados
    rellenarTabla(elementosFiltrados);
  });

  canceladorBtn.addEventListener("click", async function(event) {
    event.preventDefault(); // Evitar envío del formulario por defecto

    // Reiniciar la tabla cargando todos los elementos
    try {
      mostrarSpinner();
      await loadItems(); // Cargar todos los elementos nuevamente
      ocultarSpinner();
    } catch (error) {
      alert("Error al cargar los elementos: " + error);
    }
  });
}




/* FILTRAR TABLA */
function imprimirSeleccionados() {
  const btn = document.getElementById("filtrar-Tabla");

  btn.addEventListener("click", async (e) => {
    // Obtener todos los checkboxes
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Variables para almacenar los campos seleccionados
    let camposSeleccionados = [];

    // Iterar sobre cada checkbox y verificar si está seleccionado
    checkboxes.forEach(function(checkbox) {
      if (checkbox.checked) {
        camposSeleccionados.push(checkbox.value); // Agregar el valor del checkbox seleccionado al array
      }
    });

    // Mostrar solo las columnas seleccionadas en la tabla
    console.log(camposSeleccionados);
    mostrarColumnasSeleccionadas(camposSeleccionados);
  });
}

function mostrarColumnasSeleccionadas(camposSeleccionados) {
  // Obtener la tabla y su cabecera
  let table = document.getElementById("table-items");
  let header = table.querySelector("thead");

  // Obtener todas las filas de datos
  let rows = table.querySelectorAll("tbody tr");

  // Iterar sobre las filas y mostrar solo las columnas seleccionadas
  rows.forEach(function(row) {
    let cells = row.querySelectorAll("td");

    // Iterar sobre las celdas de la fila
    cells.forEach(function(cell) {
      let headerText = header.querySelector(`th:nth-child(${cell.cellIndex + 1})`).textContent.toLowerCase().trim();

      // Ocultar celda si no está en los campos seleccionados
      if (!camposSeleccionados.includes(headerText)) {
        cell.style.display = "none";
      } else {
        cell.style.display = ""; // Mostrar celda si está en los campos seleccionados
      }
    });
  });
}

