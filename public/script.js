document.getElementById('formulario').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const datos = {
    nombre: form.nombre.value,
    correo: form.correo.value,
    clave: form.clave.value,
    numero_telefono: form.numero_telefono.value
  };

  const res = await fetch('/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  const data = await res.json();
  alert(data.mensaje);
  form.reset();
});
