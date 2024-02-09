import {
    saveData2,
    getDataChanged_collection,
    deleteData,
    getData,
    updateData,
    deleteData2, 
} from './firebase.js'

const anadirSalas = document.getElementById("anadeSalas")
const divEntrada = document.getElementById("entrada")
const textoEntrada = document.getElementById("texto")
const botonConfirmar = document.getElementById("confirmar")
const botonesAnadirEjecSens = document.getElementById("opciones")
const anadirOpcionesSensor = document.getElementById("anadirOpcionesSensor")
const anadirOpcionesEjecutor = document.getElementById("anadirOpcionesEjecutor")
const contenedor = document.getElementById("contenedor")

let nombreSala = ''

let idBorrarSensor = 0
let idBorrarEjecutor = 0
let idBorrarSala = 1
let idAnadir= 0
let idSensorDatos = 0
let idEjecutorDatos = 0
let idVerEjecutor = 0
let idVerSensor = 0
let idSwitchButton = 0

let nuevoDato = {
    sensores: [],
    ejecutores: []
};

const coleccion = "SALAS2"


anadirSalas.addEventListener("click", async (e) => {
    divEntrada.style.visibility = "visible"

    botonConfirmar.addEventListener("click", async() => {
        nombreSala = textoEntrada.value
        const salaExistente = await getData(nombreSala, coleccion);

        if (salaExistente.exists()) {
            alert("Ya existe un espacio con este nombre.");
            return;
        }

        saveData2(coleccion, nombreSala, nuevoDato);
        botonesAnadirEjecSens.style.visibility = "visible"
        textoEntrada.value=""
        } 
    )
})

const functionSensor = async (nombreSala) => {

    anadirOpcionesSensor.style.visibility = "visible"
    anadirOpcionesSensor.id=idSensorDatos
    anadirOpcionesSensor.innerHTML=`<div id="divEntradaSensor">
    <h4>Nombre</h4>
    <input type="text" id="sensor${idSensorDatos}">
    <h4>Valor</h4>
    <input type="text" id="valorSensor_${idSensorDatos}">
    <h4>¿Qué va a calcular?</h4>
    <select id="selectSens_${idSensorDatos}">
        <option value="vacio">unidad</option>
        <option value="temperatura">temperatura (ºC)</option>
        <option value="sonido">sonido (dB)</option>
        <option value="luz">luminosidad</option>
    </select>
    <button class="enviarDatosSensor" id="Enviar${idSensorDatos}">Enviar</button>
    </div> `
    /**hay que añadirlo dentro de cada uno de los divs o que se vea mas claro este append:  */
    contenedor.prepend(anadirOpcionesSensor)


    document.getElementById(`Enviar${idSensorDatos}`).addEventListener("click", async (e) => {
        anadirOpcionesSensor.style.visibility = "visible"
        const nombre = document.getElementById(`sensor${idSensorDatos}`).value
        const valor = document.getElementById(`valorSensor_${idSensorDatos}`).value
        const selectSens = document.getElementById(`selectSens_${idSensorDatos}`).value
  
        if(nombre.value === "" || valor.value==="" || selectSens.value=== "vacio") {
            alert("rellena los datos antes de enviar")
        }
        else{
            try {
                const salaDoc = await getData(nombreSala, 'SALAS2');
                const salaData = salaDoc.data();

                const sensorExistente = salaData.sensores.find(sensor => sensor.nombre === nombre);
                if (sensorExistente) {
                    alert("Ya existe un sensor con este nombre.");
                    return;
                }

                const sensores = salaData.sensores || [];
                sensores.push({
                    nombre: nombre,
                    valor: valor,
                    calculo: selectSens
                });
                await updateData(nombreSala, 'SALAS2', { sensores: sensores })
                console.log("Sensor agregado correctamente")
                anadirOpcionesSensor.innerHTML = ''
            } catch (error) {
                console.error("Error al agregar el sensor:", error)
            }
        }
        idSensorDatos++
    })
}

const functionEjecutor =  (nombreSala) => {
    anadirOpcionesEjecutor.innerHTML = ``

    anadirOpcionesEjecutor.style.visibility = "visible"
    const elemento = document.createElement("p")
     
    elemento.innerHTML = `<div id="divEntradaEjecutor">
        <h4>Introduce el nombre del Ejecutor</h4>
        <input type="text" id ='ejec_${idEjecutorDatos}'>
        <button class="buttonConfirmar" id='ConfirmarEjecutor${idEjecutorDatos}'>Confirmar</button>
    </div>`
   
    anadirOpcionesEjecutor.append(elemento)

    document.getElementById(`ConfirmarEjecutor${idEjecutorDatos}`).addEventListener("click", async (e) => {
        const nombre = document.getElementById(`ejec_${idEjecutorDatos}`).value
    
        if (nombre === "") {
            alert("Introduce el nombre del ejecutor")
            return;  
        }

        try {
            const salaDoc = await getData(nombreSala, 'SALAS2')
            const salaData = salaDoc.data();

            const ejecutorExistente = salaData.ejecutores.find(ejecutor => ejecutor.nombre === nombre)
            if (ejecutorExistente) {
                alert("Ya existe un ejecutor con este nombre.")
                return;
            }

            const ejecutores = salaData.ejecutores || [];
            ejecutores.push({
                nombre: nombre,
                funcionamiento: true
            });

            await updateData(nombreSala, 'SALAS2', { ejecutores: ejecutores });
            anadirOpcionesEjecutor.innerHTML = '' 

        } catch (error) {
            console.error("Error al agregar el ejecutor:", error);
        }
        idEjecutorDatos++
    })
}
 
document.addEventListener("DOMContentLoaded", () => {
  
   getDataChanged_collection(coleccion, (datos) => {
        contenedor.innerHTML = ``
        const documentos = datos.docs
        let idAnadirEjecutor = 0
        let idAnadirSensor = 0

        documentos.forEach(doc => {
            let nombre = doc.id
        
            const salaContainer = document.createElement("div")
            salaContainer.innerHTML = `<h1>${nombre}</h1>
                <button class="buttonAnadir" id="Anadir${idAnadir}">Añadir</button>
                <button class="buttonBorrarSala" id="BSala${idBorrarSala}">Borrar Sala</button>
            `
            document.body.appendChild(salaContainer)

            salaContainer.classList = "salaContenedor"
            
            doc.data().sensores.forEach((sensor, index) => {
                const elemento = document.createElement("div")
                elemento.innerHTML = `<h4> sensor: ${sensor.nombre}</h4>
                    <p>cálculo: ${sensor.calculo} </p>
                    <p>valor: ${sensor.valor} </p>
                    <button class="borrar-sensor" data-sensor-index="${index}" id="BSensor${idBorrarSensor}">Borrar Sensor</button>
                    <button class="verSensor" id="verSens${idVerSensor}">Ver sensor</button>
                    <hr/>`
                salaContainer.appendChild(elemento)
                
                document.getElementById(`BSensor${idBorrarSensor}`).addEventListener("click", (e) => {
                    const sensorIndex = e.target.getAttribute("data-sensor-index")
                    deleteData2(nombre, 'sensores', sensorIndex)
                })
                idBorrarSensor++

                document.getElementById(`verSens${idVerSensor}`).addEventListener("click", (e) => {
                    const url = `http://localhost:5173/${doc.id}/sensores/${sensor.nombre}?tipo=sensor`
                    window.open(url, '_blank');
                })
                idVerSensor++
            });

            doc.data().ejecutores.forEach((ejecutor, index) => {
                const elemento = document.createElement("div")
                let encendido = ejecutor.funcionamiento ? 'Encendido' : 'Apagado';
                const switchId = `switch-label-${idSwitchButton}`
                idSwitchButton++
                elemento.innerHTML = `
                <h4 class="ejecutoresCard">ejecutor: ${ejecutor.nombre} </h4>
                <div class="switch-button">
                    <input type="checkbox" name="switch-button" id="${switchId}" class="switch-button__checkbox">
                    <label for="${switchId}" class="switch-button__label"></label>
                </div>
                <br>
                <br>
                <button class="borrarEjec" id="BEjecutor${idBorrarEjecutor}" data-ejecutor-index="${index}">Borrar Ejecutor</button>
                <button class="verEjecutor" id="verEjec${idVerEjecutor}">Ver ejecutor</button>
                <br>
              
                <hr/>
                `
                salaContainer.appendChild(elemento)

                /** darle funcionalidad al switch */
                document.getElementById(switchId).addEventListener("change", async () => {
                    const switchCheckbox = document.getElementById(switchId);
                    if (switchCheckbox.checked) {
                        encendido = "Encendido";
                        console.log(encendido);
                        ejecutor.funcionamiento = true;
                    } else {
                        encendido = 'Apagado';
                        console.log(encendido);
                        ejecutor.funcionamiento = false;
                    }
            
                    updateData(nombre, coleccion, {['ejecutores']: [{
                        funcionamiento: ejecutor.funcionamiento,
                        nombre: ejecutor.nombre,
                      }]
                    });
                 
                });
        
                document.getElementById(`BEjecutor${idBorrarEjecutor}`).addEventListener("click", (e) => {
                    const ejecutorIndex = e.target.getAttribute("data-ejecutor-index")
                    deleteData2(nombre, 'ejecutores', ejecutorIndex)
                })
                idBorrarEjecutor++ 

                document.getElementById(`verEjec${idVerEjecutor}`).addEventListener("click", (e) => {
                    const url = `http://localhost:5173/${doc.id}/ejecutores/${ejecutor.nombre}?tipo=ejecutor`
                    window.open(url, '_blank');
                })
                idVerEjecutor++
            })
            contenedor.appendChild(salaContainer)

            /*para borrar las salas*/
            document.getElementById(`BSala${idBorrarSala}`).addEventListener("click", (e) => {
                deleteData(nombre, 'SALAS2')
            })
            idBorrarSala++

         
            /*cuando pincho sobre el boton añadir, si pincho sobre añadir sensor o añadir ejecutor llamo a una función o a otra*/ 
            document.getElementById(`Anadir${idAnadir}`).addEventListener("click", (e) => {
                const el = document.createElement("div")
                el.innerHTML = `<button class="AnadirSensor" id="AnadirSensor${idAnadirSensor}">Añadir Sensor</button>
                <button class="AnadirEjecutor" id="AnadirEjecutor${idAnadirEjecutor}">Añadir Ejecutor</button>`
                salaContainer.append(el)

                document.getElementById(`AnadirSensor${idAnadirSensor}`).addEventListener("click", () => {
                    functionSensor(nombre)
                })
                idAnadirSensor++

                document.getElementById(`AnadirEjecutor${idAnadirEjecutor}`).addEventListener("click", () => {
                    functionEjecutor(nombre)
                })
                idAnadirEjecutor++
            }) 
            idAnadir++  
        })   
    })
})

