import { PlanetaBase } from "./PlanetaBase.js";

class Planeta extends PlanetaBase {
    constructor(id, nombre, tamaño, masa, tipo, distancia, presentaVida, anillo, composicion) {
        super(id, nombre, tamaño, masa, tipo); // Llamada al constructor de la clase padre PlanetaBase
        this.distancia = distancia;
        this.presentaVida = presentaVida;
        this.anillo = anillo;
        this.composicion = composicion;
    }

    verify() {
        // Verificar que el id no sea nulo ni indefinido
        
        // Verificar que el nombre sea una cadena de texto no vacía
        if (typeof this.nombre !== 'string' || this.nombre.trim() === '') {
            Error('El nombre del planeta debe ser una cadena de texto no vacía.');
            return false;
        }

        // Verificar que el tamaño, la masa y la distancia sean números mayores a 0
        if (typeof this.tamaño !== 'number' || this.tamaño <= 0 || typeof this.masa !== 'number' || this.masa <= 0 || typeof this.distancia !== 'number' || this.distancia <= 0) {
            Error('El tamaño, la masa y la distancia del planeta deben ser números mayores a 0.');
            return false;
        }

        // Verificar que el tipo sea uno de los valores permitidos
        const tiposPermitidos = ['rocoso', 'gaseoso', 'helado', 'enano'];
        if (!tiposPermitidos.includes(this.tipo)) {
            Error('El tipo del planeta debe ser "rocoso", "gaseoso", "helado" o "enano".');
            return false;
        }


    return true;

    }
}



export { Planeta };