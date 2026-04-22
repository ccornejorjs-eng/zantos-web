const form = document.getElementById('zantosForm');

const supabaseUrl = 'https://wzsyybrqycqcmouhmlzy.supabase.co';
const supabaseKey = 'sb_publishable_V5e8LxY7my69nDSOUYRGsA_UxvDzPrl';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

function checkedValues(name) {
return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);
}

function value(name) {
const el = form.elements[name];
return el ? String(el.value || '').trim() : '';
}

function mapFrecuencia(label) {
return ({ 'Ocasional': 1, 'Frecuente': 2, 'Muy frecuente': 3, 'Siempre': 4 })[label] || 0;
}

function mapIntensidad(label) {
return ({ 'Leve': 1, 'Moderado': 2, 'Alto': 3, 'Muy alto': 4 })[label] || 0;
}

function buildCaseRow() {
const conductas = checkedValues('conductas');
const contextos = checkedValues('contextos');

return {
estado: 'nuevo',
subestado: 'pendiente_revision',

nombre_perro: value('nombre_perro'),
edad: `${value('edad_anios')} años ${value('edad_meses')} meses`.trim(),
raza: value('raza'),
sexo: value('sexo'),
esterilizado: value('esterilizado'),

nombre_tutor: value('nombre_tutor'),
telefono: value('telefono'),
email: value('correo'),
pais: value('pais'),
region: value('region'),
comuna: value('comuna'),
localidad: value('localidad'),

motivo_consulta: value('motivo_principal'),
descripcion_problema: value('descripcion_motivo'),
problema_secundario: value('problema_secundario'),

descripcion_conducta: value('descripcion_conducta'),
desde_cuando: value('desde_cuando'),
antecedente: value('antecedente'),
consecuencia: value('consecuencia'),
disparador: value('disparador'),

frecuencia: value('frecuencia'),
frecuencia_score: mapFrecuencia(value('frecuencia')),
intensidad: value('intensidad'),
intensidad_score: mapIntensidad(value('intensidad')),
duracion: value('duracion'),

tipo_vivienda: value('tipo_vivienda'),
acceso_exterior: value('acceso_exterior'),
convive_animales: value('convive_animales'),
convive_ninos: value('convive_ninos'),
nivel_actividad: value('nivel_actividad'),
tiempo_solo: value('tiempo_solo'),
tiempo_paseo: value('tiempo_paseo'),
rutina_diaria: value('rutina_diaria'),

inicio_problema: value('inicio_problema'),
evolucion: value('evolucion'),
edad_inicio: value('edad_inicio'),
intervenciones_previas: value('intervenciones_previas'),
evento_desencadenante: value('evento_desencadenante'),
descripcion_intervenciones: value('descripcion_intervenciones'),

mordida: value('mordida'),
intento_mordida: value('intento_mordida'),
riesgo_actual: value('riesgo_actual'),
rompio_piel: value('rompio_piel'),
atencion_medica: value('atencion_medica'),
problema_medico: value('problema_medico'),
evaluacion_veterinaria: value('evaluacion_veterinaria'),
observaciones_alerta: value('observaciones_alerta'),

objetivo: value('objetivo'),
nivel_compromiso: value('nivel_compromiso'),
plan_sugerido: value('plan'),
score_global: mapFrecuencia(value('frecuencia')) + mapIntensidad(value('intensidad')),

edad_llegada_hogar: value('edad_llegada_hogar'),
destete_prematuro: value('destete_prematuro'),
historial_medico: value('historial_medico'),
problemas_previos: value('problemas_previos'),
detalle_problemas_previos: value('detalle_problemas_previos'),
trabajo_previo: value('trabajo_previo'),
detalle_trabajo_previo: value('detalle_trabajo_previo'),

participantes_proceso: value('participantes_proceso'),

vinculo_actual: value('vinculo_actual'),
detalle_vinculo: value('detalle_vinculo'),

lugar_descanso: value('lugar_descanso'),
acceso_areas: value('acceso_areas'),
juguetes_enriquecimiento: value('juguetes_enriquecimiento'),
detalle_enriquecimiento: value('detalle_enriquecimiento'),
estimulos_hogar: value('estimulos_hogar'),
detalle_estimulos_hogar: value('detalle_estimulos_hogar'),

frecuencia_paseos: value('frecuencia_paseos'),
reaccion_elementos_paseo: value('reaccion_elementos_paseo'),
manipulacion_elementos: value('manipulacion_elementos'),
actividad_exterior: value('actividad_exterior'),
atencion_tutor_paseo: value('atencion_tutor_paseo'),
reaccion_perros_calle: value('reaccion_perros_calle'),
detalle_reaccion_perros: value('detalle_reaccion_perros'),
reaccion_personas_calle: value('reaccion_personas_calle'),
detalle_reaccion_personas: value('detalle_reaccion_personas'),
reaccion_otros_animales_calle: value('reaccion_otros_animales_calle'),
detalle_reaccion_otros_animales: value('detalle_reaccion_otros_animales'),
reaccion_ruidos: value('reaccion_ruidos'),
detalle_reaccion_ruidos: value('detalle_reaccion_ruidos'),
signos_estres_paseo: value('signos_estres_paseo'),
detalle_estres_paseo: value('detalle_estres_paseo'),

conductas_json: JSON.stringify(conductas),
contextos_json: JSON.stringify(contextos)
};
}

function validate(data) {
const errors = [];

if (!data.nombre_perro) errors.push('Falta el nombre del perro.');
if (!data.nombre_tutor) errors.push('Falta el nombre del responsable.');
if (!data.motivo_consulta) errors.push('Falta el motivo principal.');
if (!data.descripcion_problema) errors.push('Falta la descripción del problema.');
if (!data.descripcion_conducta) errors.push('Falta la descripción de la conducta.');
if (!data.frecuencia) errors.push('Falta la frecuencia.');
if (!data.intensidad) errors.push('Falta la intensidad.');
if (!data.observaciones_alerta) errors.push('Faltan observaciones importantes.');

return errors;
}

document.querySelectorAll('.collapsible h2').forEach(header => {
header.addEventListener('click', () => {
const section = header.parentElement;

document.querySelectorAll('.collapsible').forEach(s => {
if (s !== section) s.classList.remove('open');
});

section.classList.toggle('open');
});
});

const progressFill = document.getElementById('progressFill');

function calcularProgreso() {
if (!progressFill) return;

const inputs = form.querySelectorAll('input, select, textarea');
let total = 0;
let llenos = 0;

inputs.forEach(i => {
if (i.type === 'checkbox' || i.type === 'radio') return;
total++;
if (i.value && i.value.trim() !== '') llenos++;
});

const porcentaje = total ? Math.round((llenos / total) * 100) : 0;
progressFill.style.width = porcentaje + '%';
}

form.addEventListener('input', calcularProgreso);
form.addEventListener('change', calcularProgreso);

form.addEventListener('submit', async (e) => {
e.preventDefault();

const data = buildCaseRow();
const errors = validate(data);

if (errors.length) {
alert('No se puede crear el caso todavía:\n\n' + errors.join('\n'));
return;
}

const { error } = await supabaseClient
.from('casos')
.insert([data]);

if (error) {
console.error('Error al guardar en Supabase:', error);
alert('Hubo un error al guardar el caso en la base de datos.');
return;
}

alert('Caso creado correctamente y guardado en la base de datos.');

form.reset();

const firstPlan = form.querySelector('input[name="plan"]');
if (firstPlan) firstPlan.checked = true;

document.querySelectorAll('.collapsible').forEach((section, index) => {
if (index === 0) {
section.classList.add('open');
} else {
section.classList.remove('open');
}
});

calcularProgreso();
});

calcularProgreso();
