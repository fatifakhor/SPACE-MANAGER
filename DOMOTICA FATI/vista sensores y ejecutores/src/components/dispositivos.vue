<script setup>
import { ref, onBeforeMount, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import {onActualizaDispositivo, updateData} from '../firebase.js'

const tipoDispositivo = ref("")
const router = useRouter()
const temperatura = ref()
const coleccion = 'SALAS2'
const device = ref({})
const calculo = ref()
const funcionamiento = ref(Boolean)
const dispositivoId = router.currentRoute.value.params.dispositivo
let id = router.currentRoute.value.params.sala

onMounted(() => {
  tipoDispositivo.value = router.currentRoute.value.query.tipo;
})

onBeforeMount(() => {
  onActualizaDispositivo(coleccion, router.currentRoute.value.params.sala , docs => {
    if (tipoDispositivo.value === 'sensor') {
      const data = docs.data() 
      if (data.sensores && Array.isArray(data.sensores)) {
        // Busca el sensor correspondiente por su nombre
        const sensor = data.sensores.find(s => s.nombre === dispositivoId)
        if (sensor) {
          temperatura.value = sensor.valor  
          calculo.value = sensor.calculo
          device.value = sensor
        }
      }
    }else if (tipoDispositivo.value === 'ejecutor') {
      const data = docs.data() 
      if (data.ejecutores && Array.isArray(data.ejecutores)) {
        // Busca el ejecutor correspondiente por su nombre
        const ejecutor = data.ejecutores.find(e => e.nombre === dispositivoId)
        if (ejecutor) {
          funcionamiento.value = ejecutor.funcionamiento
        }
      }
    }
  })

})

/**modificar la temperatura del sensor */
const modificaTemperatura = () => {
 if (device.value && dispositivoId && temperatura.value !== undefined) {
    updateData(id, coleccion, {['sensores']: [{
      calculo: calculo.value,
      nombre: dispositivoId,
      valor: temperatura.value
    }]
    });
  } else {
    console.error("Dispositivo o temperatura no definidos.");
  } 
} 

const modificaTemperaturaEnSensor= computed(() => {
  return device.value.calculo === temperatura.value
})
 
</script>

<template>
  <div>
    <div id ="contenedorSensor" v-if="tipoDispositivo === 'sensor'">
      <h1>Detalles del Sensor {{ router.currentRoute.value.params.dispositivo }}</h1>
      <ul id="listaSensores">
        <li><p>Nombre de la sala: {{ router.currentRoute.value.params.sala }}</p></li>
        <li><p>Nombre del sensor: {{ router.currentRoute.value.params.dispositivo }}</p></li>
   
        <li class="text-black text-4xl flex flex-row gap-5">
          <!-- modificarlo para que aparezca lo que hay en calculo -->
        <label v-if="calculo" for="number"> El cálculo en ( {{ calculo }} ). Valor: </label> 
        <input v-model="temperatura" type="number"/>
        <button @click="modificaTemperatura"
        :disabled="modificaTemperaturaEnSensor">Cambiar</button>
         </li>
      </ul>
    </div>
    <div id="contenedorEjecutor" v-else-if="tipoDispositivo === 'ejecutor'">
      <h1>Detalles del Ejecutor {{ router.currentRoute.value.params.dispositivo }}</h1>
      <ul id="listaEjecutores">
        <li><p>Nombre de la sala: {{ router.currentRoute.value.params.sala }}</p></li>
        <li><p>Nombre del ejecutor: {{ router.currentRoute.value.params.dispositivo }}</p></li>
        <li><p>Funcionamiento: {{ funcionamiento ? 'en ejecución' : 'no está en ejecución' }}</p></li>
        
      </ul>
    </div>
  </div>
</template>

<style>

#contenedorSensor, #contenedorEjecutor {
  background-color: #7da880;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border: 1px solid #000;
}

#contenedorEjecutor{
  background-color: #7da880;
}

#contenedorSensor h1,
#contenedorEjecutor h1 {
  font-size: 40px;
  color: #333333;
  margin-bottom: 10px;
}

ul li p{
  font-size: 25px;
  margin: 0;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 10px;
}

label {
  font-size:25px;
 
}

button {
  padding: 10px 20px;
  background-color: #54b557;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover {
  background-color: #25942a;
}

/* Estilos para los inputs */
input {
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}


</style>