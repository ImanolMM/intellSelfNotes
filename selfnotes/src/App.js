import './App.css';
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import {useEffect, useState} from "react";
import Nota from "./Nota";
import NotaAmpliada from "./NotaAmpliada";
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format } from 'date-fns';


firebase.initializeApp({
    apiKey: "AIzaSyCxXVadEJP_2wkck1P8h-kWU-WzBVsmTXk",
    authDomain: "intelselfnotes.firebaseapp.com",
    projectId: "intelselfnotes",
    storageBucket: "intelselfnotes.appspot.com",
    messagingSenderId: "801116888609",
    appId: "1:801116888609:web:9537f6c5bfc770636a8d60"
})

const firestore = firebase.firestore();
const auth = firebase.auth();

function SignIn({style}) {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }
    return (
        <button className={style ? style : ""} onClick={signInWithGoogle}>Sign in with Google</button>
    )
}

function SignOut({ style}) {
    return auth.currentUser && (
        <button className={style ? style : ""} onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function cargarNotasUsuario(user,setNotas) {
    if (user) {
        //verificamos si el usuario está en la base de datos, sino lo añadimos
        firestore.collection('Usuarios').where('email', '==', user.email).get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                // Lo añadimos
                firestore.collection('Usuarios').add({
                    email: user.email,
                    nombre: user.displayName
                });
                setNotas([]);
            } else {
                //obtenemos el ID del usuario
                firestore.collection('Usuarios').where('email', '==', user.email).get().then((querySnapshot) => {
                    if (!querySnapshot.empty){
                        const userID= querySnapshot.docs[0].id;
                        firestore.collection('Notas').where('userID', '==', userID).get().then((querySnapshot) => {
                            let notas = [];
                            querySnapshot.forEach((doc) => {
                                notas.push(doc.data());
                            });
                            //TODO falta que no cargue el id del usuario al que pertenece la nota
                            //miramos si hay alguna nota que haya caducado
                            const fechaActual = format(new Date(), 'dd/MM/yyyy');
                            let idNotasCaducadas = [];
                            notas.forEach((nota, index) => {
                                const fechaFinal = nota.fechaFinal;
                                if (parse(fechaFinal, 'dd/MM/yyyy', new Date()) < parse(fechaActual, 'dd/MM/yyyy', new Date())){
                                    idNotasCaducadas.push(nota.ID);
                                }
                            });
                            if (idNotasCaducadas.length > 0) {
                                firestore.collection('Notas').where('ID', 'in', idNotasCaducadas).get().then((querySnapshot) => {
                                    if (!querySnapshot.empty) {
                                        querySnapshot.forEach((doc) => {
                                            doc.ref.delete();
                                        });
                                    } else {
                                        console.log("No se ha encontrado la nota al eliminarla");
                                    }
                                });
                            }
                            setNotas(notas.filter(nota => !idNotasCaducadas.includes(nota.ID)));

                        }).catch((error) => {
                            console.error('Error al cargar las notas del usuario:', error);
                        });
                    }else{
                        console.log("No se ha encontrado el usuario al cargar las notas");
                    }
                });
            }
        });
            // Realiza alguna operación adicional o redirección
    }else{
        setNotas([]);
    }
}
function buscarIdMayor(notas){
    if (notas.length === 0){
        return 0;
    }else{
        return Math.max.apply(Math, notas.map(function(o) { return o.ID; })) +1;
    }
}
function guardarNota(nota, setNotas, notas) {
    firestore.collection('Usuarios').where ('email', '==', auth.currentUser.email).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
            const idNota = buscarIdMayor(notas);
            const notaConID = { ...nota, ID: idNota };
            setNotas([...notas, notaConID])
            const userID= querySnapshot.docs[0].id;
            const notaConIDUsuario = { ...notaConID, userID: userID };
            firestore.collection('Notas').add(notaConIDUsuario);

        }else{
            console.log("No se ha encontrado el usuario al guardar la nota");
        }
    });

}
const App = () => {


    const [notas, setNotas] = useState([]);
    const [[notaAmpliada,indice], setNotaAmpliada] = useState([null,null]);
    const [filtro, setFiltro] = useState("");
    const [user] = useAuthState(auth);
    const nuevaNotaAmpliada = {titulo: "Ponga aqui su título", anotaciones: "Ponga aqui sus anotaciones", fechaInicio: "05/08/2023", fechaFinal: "30/08/2023", nivelImportancia: "0"};

    //cargamos los datos del usuario
    useEffect(() => {
        cargarNotasUsuario(user, setNotas);
    }, [user]);
    function eliminarNotaPorID(id) {
        firestore.collection('Notas').where('ID', '==', id).get().then((querySnapshot) => {
            if (!querySnapshot.empty){
                setNotas(notas.filter(n => n.ID !== id));
                querySnapshot.forEach((doc) => {
                    doc.ref.delete();
                });
            }else{
                console.log("No se ha encontrado la nota al eliminarla");
            }
        });
    }
    const editarNota = (idNota) => {
    }
    const ampliarNota = (idNota) => {
        const notaSeleccionada = notas.filter(n => n.ID === idNota);
        setNotaAmpliada([notaSeleccionada[0],idNota]);
    }
    const eliminarNotaAmpliada = () => {
        if (indice != null) {
            eliminarNotaPorID(indice)
        }
        setNotaAmpliada([null,null]);

    };
    const editarNotaAmpliada = () => {
        console.log(notaAmpliada)
    };
    const ampliarNotaAmpliada = () => {
        if (indice == null) {
            guardarNota(notaAmpliada, setNotas, notas);
        }
        let cambio = false;
        const nuevasNotas = notas.map((nota) => {
            if (nota.ID === indice && (notaAmpliada.titulo !== nota.titulo || notaAmpliada.anotaciones !== nota.anotaciones || notaAmpliada.fechaInicio !== nota.fechaInicio || notaAmpliada.fechaFinal !== nota.fechaFinal || notaAmpliada.nivelImportancia !== nota.nivelImportancia) ) {
                cambio = true;
                return notaAmpliada;
            }
            return nota;
        });
        if (cambio){
            setNotas(nuevasNotas);
            //actualizarla en la base de datos
            firestore.collection('Notas').where('ID', '==', indice).get().then((querySnapshot) => {
                if (!querySnapshot.empty){
                    querySnapshot.forEach((doc) => {
                        doc.ref.update(notaAmpliada);
                    });
                }else{
                    console.log("No se ha encontrado la nota al editarla");
                }
            });
        }
        setNotaAmpliada([null, null]);
    }
    return (
        <div>
            {notaAmpliada && (
                <div className="contenedorNotaAmpliada">
                    <NotaAmpliada
                        contenido={notaAmpliada}
                        eliminarNota={eliminarNotaAmpliada}
                        editarNota={editarNotaAmpliada}
                        ampliarNota={ampliarNotaAmpliada}
                        setContenido={setNotaAmpliada}
                        indice={indice}
                    />
                </div>
            )}
            <div className="header"></div>
            <div id="contenedorContenedorTextoFiltros">
                <div id="contenedorTextoFiltros">
                    <textarea id="textoFiltro" onChange={(e) => {
                        setFiltro(e.target.value)
                    }}></textarea>
                </div>
            </div>
            <div id="contenedorNotas">
                {notas.sort((nota1 , nota2) => {
                    const regularExpression = new RegExp(filtro, "i");
                    const nota1Similitud = nota1.titulo.match(regularExpression)?.[0]?.length || 0;
                    const nota2Similitud = nota2.titulo.match(regularExpression)?.[0]?.length || 0;
                    return nota2Similitud - nota1Similitud;
                }).map((nota) => (
                    <Nota
                        key={nota.ID}
                        contenido={nota}
                        eliminarNota={eliminarNotaPorID}
                        editarNota={editarNota}
                        ampliarNota={ampliarNota}
                    />
                ))}
                <button
                    id="botonAñadirNota"
                    onClick={() => setNotaAmpliada([nuevaNotaAmpliada, null])}
                >
                    +
                </button>
            </div>
            {!user && <SignIn
                style="button"
            />}
            <SignOut
                style="botonSignOut"
            />
        </div>
    );
};
    export default App;
