class Casa {
  constructor(id, titulo, transaccion, precio, tipo) {
    this.id = id;
    this.titulo = titulo;
    this.transaccion = transaccion;
    this.precio = +precio;
    this.tipo = tipo;
  }

  verify() {
    return this.checkTitulo();
  }

  checkTitulo() {
    return { success: true, rta: null };
  }
}

export { Casa };
