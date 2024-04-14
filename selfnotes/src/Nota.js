
const Nota = ({ contenido, eliminarNota, editarNota, ampliarNota }) => {
    return(
        <div className="nota">
            <div className="contenedorPartesNota">
                <div className="contenedorParteIzquierdaNota">
                    <p className="tituloTituloNota">Título</p>
                    <p className="tituloNota">{contenido?.titulo}</p>
                    <p className="tituloAnotaciones">Anotaciones</p>
                    <p className="anotaciones">{contenido?.anotaciones}</p>
                </div>
                <div className="contenedorParteDerechaNota">
                    <div className="contenedorFechasbarra">
                        <div className="contenedorFechas">
                            <p className="tituloFechaInicio">Fecha inicio</p>
                            <p className="fechaInicio">{contenido?.fechaInicio}</p>
                            <p className="tituloFechaFinal">Fecha final</p>
                            <p className="fechaFinal">{contenido?.fechaFinal}</p>
                        </div>
                        <div className="contenedorBarraImportancia">
                            <div className="barraImportancia" style={{
                                height: `${contenido.nivelImportancia}%`,
                                backgroundColor: (() => {
                                    switch (contenido.nivelImportancia) {
                                        case 20:
                                            return '#66cc33';
                                        case 40:
                                            return '#99cc33';
                                        case 60:
                                            return '#cc9933';
                                        case 80:
                                            return '#ff7d55';
                                        case 100:
                                            return '#ff3333';
                                        default:
                                            return 'transparent';
                                    }
                                })()
                            }} />
                        </div>
                    </div>
                    <div className="contenedorBotonesNotas">
                        <button className="botonEditar" onClick={() => {editarNota(contenido.ID);
                            console.log(contenido)}}></button>
                        <button className="botonEliminar" onClick={() => eliminarNota(contenido.ID)}></button>
                        <button className="botonAmpliar" onClick={() => ampliarNota(contenido.ID)}></button>
                    </div>
                </div>
            </div>
        </div>)
    }

export default Nota;
