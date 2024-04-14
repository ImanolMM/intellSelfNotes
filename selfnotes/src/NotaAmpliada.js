import DatePicker from "react-datepicker";
import { parse, format } from 'date-fns';
import {useState} from "react";
const NotaAmpliada = ({ contenido, eliminarNota, editarNota, ampliarNota, setContenido, indice}) => {
    const [noEditando, setNoEditando] = useState(true);
    const [nivelBarraImportancia, setNivelBarraImportancia] = useState(contenido.nivelImportancia);
    const [colorBarraImportancia, setColorBarraImportancia] = useState((() => {
        switch (contenido.nivelImportancia) {
            case 20:
                return '66cc33';
            case 40:
                return '99cc33';
            case 60:
                return 'cc9933';
            case 80:
                return 'ff6633';
            case 100:
                return 'ff3333';
            default:
                return 'transparent';
        }
    })())
    return (
        <div className="notaAmpliada">
            <div className="contenedorPartesNotaAmpliada">
                <div className="contenedorParteIzquierdaNotaAmpliada">
                    <p className="tituloTituloNotaAmpliada">Título</p>
                    <textarea
                        disabled={noEditando}
                        className="tituloNotaAmpliada"
                        value={contenido?.titulo}
                        onChange={(e) => {
                            // Actualizar el contenido del título cuando se realice un cambio
                            const nuevoContenido = { ...contenido, titulo: e.target.value };
                            setContenido([nuevoContenido, indice]);
                        }}
                    />
                    <p className="tituloAnotacionesAmpliada">Anotaciones</p>
                    <textarea
                        disabled={noEditando}
                        className="anotacionesAmpliada"
                        value={contenido?.anotaciones}
                        onChange={(e) => {
                            // Actualizar el contenido de las anotaciones cuando se realice un cambio
                            const nuevoContenido = {...contenido, anotaciones: e.target.value};
                            setContenido([nuevoContenido, indice]);
                        }}
                    />
                </div>
                <div className="contenedorParteDerechaNotaAmpliada">
                    <div className="contenedorFechasBarraAmpliada">
                        <div className="contenedorFechasAmpliada">
                            <p className="tituloFechaInicioAmpliada">Fecha inicio</p>
                            <DatePicker
                                disabled={noEditando}
                                className="fechaInicioAmpliada"
                                dateFormat="dd/MM/yyyy"
                                selected={parse(contenido?.fechaInicio, 'dd/MM/yyyy', new Date())}
                                onChange={(date) => {
                                    const nuevoContenido = {...contenido, fechaInicio: format(date, 'dd/MM/yyyy')};
                                    setContenido([nuevoContenido, indice]);
                                }}
                            />
                            <p className="tituloFechaFinalAmpliada">Fecha final</p>
                            <DatePicker
                                disabled={noEditando}
                                className="fechaFinalAmpliada"
                                dateFormat="dd/MM/yyyy"
                                selected={parse(contenido?.fechaFinal, 'dd/MM/yyyy', new Date())}
                                onChange={(date) => {
                                    const nuevoContenido = {...contenido, fechaFinal: format(date, 'dd/MM/yyyy')};
                                    setContenido([nuevoContenido, indice]);
                                }}
                            />
                        </div>
                        <div className="contenedorBarraImportanciaAmpliadaFuera">
                            <div className="contenedorBarraImportanciaAmpliadaTrozos">
                                <div className="contenedorTrozosAmpliada">
                                    <div className="trozoBarraAmpliada" style={{ borderTop: '0px solid black' }} onClick={()=> {
                                        if (!noEditando) {
                                            setNivelBarraImportancia(100)
                                            setColorBarraImportancia('ff3333')
                                            const nuevoContenido = {...contenido, nivelImportancia: 100};
                                            setContenido([nuevoContenido, indice]);
                                        }
                                    }}></div>
                                    <div className="trozoBarraAmpliada" onClick={() => {
                                        if (!noEditando) {
                                            setNivelBarraImportancia(80)
                                            setColorBarraImportancia('ff6633')
                                            const nuevoContenido = {...contenido, nivelImportancia: 80};
                                            setContenido([nuevoContenido, indice]);
                                        }
                                    }}></div>
                                    <div className="trozoBarraAmpliada" onClick={() => {
                                        if (!noEditando) {
                                            setNivelBarraImportancia(60)
                                            setColorBarraImportancia('cc9933')
                                            const nuevoContenido = {...contenido, nivelImportancia: 60};
                                            setContenido([nuevoContenido, indice]);
                                        }
                                    }}></div>
                                    <div className="trozoBarraAmpliada" onClick={() => {
                                        if (!noEditando) {
                                            setNivelBarraImportancia(40)
                                            setColorBarraImportancia('99cc33')
                                            const nuevoContenido = {...contenido, nivelImportancia: 40};
                                            setContenido([nuevoContenido, indice]);
                                        }
                                    }}></div>
                                    <div className="trozoBarraAmpliada" onClick={() => {
                                        if (!noEditando) {
                                            setNivelBarraImportancia(20)
                                            setColorBarraImportancia('66cc33')
                                            const nuevoContenido = {...contenido, nivelImportancia: 20};
                                            setContenido([nuevoContenido, indice]);
                                        }
                                    }}></div>
                                </div>
                                <div className="contenedorBarraImportanciaAmpliada">
                                    <div className="barraImportanciaAmpliada" style={{
                                        height: `${nivelBarraImportancia}%`,
                                        backgroundColor: `#${colorBarraImportancia}`
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contenedorBotonesNotaAmpliada">
                        <button className={noEditando ? "botonEditarNotaAmpliada": "botonEditarNotaAmpliada activo"} onClick={() => setNoEditando(!noEditando)}></button>
                        <button className="botonEliminarNotaAmpliada" onClick={() => eliminarNota()}></button>
                        <button className="botonAmpliarNotaAmpliada" onClick={() => ampliarNota()}></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default NotaAmpliada;
