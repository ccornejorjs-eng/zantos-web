const form = document.getElementById('zantosForm');
const output = document.getElementById('output');
const previewBtn = document.getElementById('previewBtn');

function checkedValues(name){ return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value); }
function value(name){ const el = form.elements[name]; return el ? String(el.value || '').trim() : ''; }
function mapFrecuencia(label){ return ({'Ocasional':1,'Frecuente':2,'Muy frecuente':3,'Siempre':4})[label] || 0; }
function mapIntensidad(label){ return ({'Leve':1,'Moderado':2,'Alto':3,'Muy alto':4})[label] || 0; }

function buildCase(){
  const conductas = checkedValues('conductas');
  const contextos = checkedValues('contextos');
  const planEl = form.querySelector('input[name="plan"]:checked');
  return {
    id: 'caso_' + Date.now(),
    fecha: new Date().toISOString(),
    identificacion: {
      perro: value('nombre_perro'),
      especie: 'Canino',
      edad: { anios: Number(value('edad_anios') || 0), meses: Number(value('edad_meses') || 0) },
      rango_etario: value('rango_etario'),
      raza: value('raza'),
      sexo: value('sexo'),
      esterilizado: value('esterilizado')
    },
    tutor: {
      nombre_tutor: value('nombre_tutor'),
      telefono: value('telefono'),
      correo: value('correo'),
      pais: value('pais'),
      region: value('region'),
      comuna: value('comuna'),
      localidad: value('localidad')
    },
    evaluacion: {
      motivoConsulta: value('motivo_principal'),
      descripcionMotivo: value('descripcion_motivo'),
      problemaSecundario: value('problema_secundario'),
      conductasObservadas: conductas,
      descripcionConducta: value('descripcion_conducta'),
      desdeCuando: value('desde_cuando'),
      contexto: contextos,
      antecedente: value('antecedente'),
      consecuencia: value('consecuencia'),
      disparador: value('disparador'),
      frecuencia: value('frecuencia'),
      frecuenciaScore: mapFrecuencia(value('frecuencia')),
      intensidad: value('intensidad'),
      intensidadScore: mapIntensidad(value('intensidad')),
      duracion: value('duracion'),
      entorno: {
        tipo_vivienda: value('tipo_vivienda'),
        acceso_exterior: value('acceso_exterior'),
        convive_animales: value('convive_animales'),
        convive_ninos: value('convive_ninos'),
        nivel_actividad: value('nivel_actividad'),
        tiempo_solo: value('tiempo_solo'),
        tiempo_paseo: value('tiempo_paseo'),
        rutina_diaria: value('rutina_diaria')
      },
      historia: {
        inicio_problema: value('inicio_problema'),
        evolucion: value('evolucion'),
        edad_inicio: value('edad_inicio'),
        evento_desencadenante: value('evento_desencadenante'),
        intervenciones_previas: value('intervenciones_previas'),
        descripcion_intervenciones: value('descripcion_intervenciones')
      },
      alertas: {
        mordida: value('mordida'),
        intento_mordida: value('intento_mordida'),
        riesgo_actual: value('riesgo_actual'),
        rompio_piel: value('rompio_piel'),
        atencion_medica: value('atencion_medica'),
        problema_medico: value('problema_medico'),
        evaluacion_veterinaria: value('evaluacion_veterinaria'),
        observaciones_alerta: value('observaciones_alerta')
      },
      objetivoTutor: {
        objetivo: value('objetivo'),
        nivel_compromiso: value('nivel_compromiso')
      }
    },
    analisis: {},
    intervencion: {},
    informes: { resumenEjecutivo:'', tecnico:{}, cliente:{}, progreso:[] },
    seguimiento: [],
    planContratado: planEl ? planEl.value : 'Evaluación inicial',
    metadata: { estadoCaso:'nuevo', subestado:'pendiente_revision', origen:'formulario_web', fechaCreacion:new Date().toISOString() }
  };
}
function validate(data){
  const errors = [];
  if(!data.evaluacion.motivoConsulta) errors.push('Falta el motivo principal.');
  if(!data.evaluacion.conductasObservadas.length) errors.push('Debes seleccionar al menos una conducta.');
  if(!data.evaluacion.contexto.length) errors.push('Debes seleccionar al menos un contexto.');
  if(!data.evaluacion.frecuencia) errors.push('Falta la frecuencia.');
  if(!data.evaluacion.intensidad) errors.push('Falta la intensidad.');
  if(!data.evaluacion.alertas.observaciones_alerta) errors.push('Faltan observaciones importantes en seguridad y salud.');
  return errors;
}
function updatePreview(){ output.textContent = JSON.stringify(buildCase(), null, 2); }
previewBtn.addEventListener('click', updatePreview);
form.addEventListener('input', updatePreview);
form.addEventListener('change', updatePreview);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = buildCase();
  const errors = validate(data);
  if(errors.length){
    alert('No se puede crear el caso todavía:\n\n' + errors.join('\n'));
    updatePreview();
    return;
  }
  const cases = JSON.parse(localStorage.getItem('ZANTOS_WEB_CASES') || '[]');
  cases.unshift(data);
  localStorage.setItem('ZANTOS_WEB_CASES', JSON.stringify(cases));
  alert('Caso creado correctamente. Ahora ya aparece en panel.html');
  form.reset();
  const firstPlan = form.querySelector('input[name="plan"]');
  if(firstPlan) firstPlan.checked = true;
  updatePreview();
});
updatePreview();