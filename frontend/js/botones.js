export function ocultarBotones() {
    document.getElementById('guardado').style.display = 'flex';
    document.getElementById('btn-edit').style.display = 'none';
    document.getElementById('btn-back').style.display = 'none';
    document.getElementById('btn-delete-one').style.display = 'none';
}

export function mostrarBotones() {
    document.getElementById('guardado').style.display = 'none';
    document.getElementById('btn-edit').style.display = 'flex';
    document.getElementById('btn-back').style.display = 'flex';
    document.getElementById('btn-delete-one').style.display = 'flex';
}
