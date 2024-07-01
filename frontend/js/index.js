import { Casa } from "./casa.js";
import { obtenerTodos, crearuno, deleteOne, deleteAll, editOne } from "./api.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";
import { mostrarBotones, ocultarBotones } from "./botones.js";

const KEY_STORAGE = "casas";
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
    items = objetos.map(obj => new Casa(obj.id, obj.titulo, obj.transaccion, obj.precio, obj.tipo));
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

  const celdas = ["id", "titulo", "transaccion", "precio", "tipo"];
  
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

    const model = new Casa(
      fechaActual.getTime(),
      formulario.querySelector("#titulo").value,
      getSelectedRadioValue(), // Obtener valor de radio
      formulario.querySelector("#precio").value,
      getselect() // Obtener valor de select
    );

    console.log(model);
    const respuesta = model.verify();

    if (respuesta.success) {
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

function getSelectedRadioValue() {// Obtener todos los elementos radio con el name "transaccion"
  const radios = document.getElementsByName('transaccion'); 

  // Iterar sobre los radios para encontrar el seleccionado
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      const selectedValue = radios[i].value; // Obtener el valor del radio seleccionado
      console.log("transaccion: " + selectedValue);
      return selectedValue;
    }
  }

  // Si ningún radio está seleccionado
  alert('No option selected');
  return null;
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
  if (selectedItemIndex === null) return;

  const item = items[selectedItemIndex]; // Obtener el item a eliminar
  items.splice(selectedItemIndex, 1); // Eliminar del array local

  if (confirm('¿Desea eliminar el Item?')) {
    try {
      mostrarSpinner();
      await deleteOne(item.id); // Eliminar del servidor
      loadItems(); // Volver a cargar los items y actualizar la tabla
      selectedItemIndex = null; // Resetear el índice seleccionado
      actualizarFormulario();
    } catch (error) {
      alert(error);
    } finally {
      ocultarSpinner();
    }
  }
}

/* RELLENAR FORMULARIO */
function editarElemento(data, index) {
  selectedItemIndex = index; // Guardar el índice del item seleccionado
  const tituloInput = formulario.querySelector("#titulo");
  const transaccionRadio = formulario.querySelector(`input[name="transaccion"][value="${data[2]}"]`);
  const precioInput = formulario.querySelector("#precio");
  const tipoSelect = formulario.querySelector("#tipo");

  if (tituloInput) {
    tituloInput.value = data[1];
  }
  if (transaccionRadio) {
    transaccionRadio.checked = true; // Marcar el radio seleccionado
  }
  if (precioInput) {
    precioInput.value = data[3];
  }
  if (tipoSelect) {
    tipoSelect.value = data[4];
  }
  
  mostrarBotones(); // Mostrar botones al editar
}


function actualizarFormulario() {
  formulario.reset();
  selectedItemIndex = null; // Resetear el índice seleccionado
}

/* EDITAR AL SELECCIONAR LA FILA */
function addRowClickListener(row, index) { // Se encarga de poner la característica de click y manda los datos a consola
  row.addEventListener('click', () => {
    const cells = row.querySelectorAll('td');
    const rowData = Array.from(cells).map(cell => cell.textContent);
    console.log(rowData);
    editarElemento(rowData, index);
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

  const model = new Casa( //MODIFICAR ACA
    item.id,
    formulario.querySelector("#titulo").value,
    getSelectedRadioValue(),
    formulario.querySelector("#precio").value,
    getselect()
  );
  // getSelectedRadioValue() = data[2];
  // formulario.querySelector("#precio").value = data[3];
  // getselect().value = data[4];
  const respuesta = model.verify();

  if (respuesta.success) {
    try {
      mostrarSpinner();
      await editOne(model); // Editar en el servidor
      await loadItems(); // Volver a cargar los items y actualizar la tabla
      selectedItemIndex = null; // Resetear el índice seleccionado
      ocultarBotones(); // Ocultar botones de edición
      actualizarFormulario()
    } catch (error) {
      alert(error);
    } finally {
      ocultarSpinner();
    }
  } else {
    alert(respuesta.rta);
  }
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

