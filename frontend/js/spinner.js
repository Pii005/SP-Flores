// // Función para mostrar el spinner
// export function mostrarSpinner() {
//     action(true);
// }

// // Función para ocultar el spinner
// export function ocultarSpinner() {
//     action();
// }




// function action(visible = false) {
//     const display = visible ? 'flex' : 'none';
//     document.getElementById('spinner').style.display = display;
// }

// spinner.js
export function mostrarSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
    spinner.style.display = 'block';
}
}

export function ocultarSpinner() {
const spinner = document.getElementById('spinner');
if (spinner) {
    spinner.style.display = 'none';
}
}
