// En DateUtils.ts o en el lugar donde manejas las utilidades de fechas
export function toLocaleString(date: Date | null | undefined): string {
    // Verifica si date es nulo o no está definido, y devuelve una cadena vacía en ese caso
    if (date == null) {
        return '';
    }

    return date.toLocaleString(); // Puedes ajustar los parámetros para personalizar el formato de fecha y hora
}
