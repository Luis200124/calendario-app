async function cargarDatos() {
  const calendario = await fetch('menu.json').then(r => r.json());
  const recetas = await fetch('recetas.json').then(r => r.json());
  const contenedor = document.getElementById('calendario');

  calendario.forEach(dia => {
    const divDia = document.createElement('div');
    divDia.className = 'day';
    const titulo = document.createElement('h2');
    titulo.textContent = dia.fecha;
    const btnToggle = document.createElement('button');
    btnToggle.textContent = '+';
    btnToggle.className = 'toggle-btn';
    const comidas = document.createElement('div');
    comidas.className = 'oculto';

    ['Desayuno', 'Comida', 'Cena'].forEach(tipo => {
      const platillo = dia[tipo];
      const div = document.createElement('div');
      const label = document.createElement('strong');
      label.textContent = tipo + ': ' + platillo;
      const btn = document.createElement('button');
      btn.textContent = '+';
      btn.onclick = () => {
        if (div.lastChild.nodeName !== 'DIV') {
          const receta = recetas[platillo] || {ingredientes: [], preparacion: "No disponible"};
          const det = document.createElement('div');
          det.className = 'receta';
          det.innerHTML = `<p><strong>Ingredientes:</strong> ${receta.ingredientes.join(', ')}</p><p><strong>Preparación:</strong> ${receta.preparacion}</p>`;
          div.appendChild(det);
          btn.textContent = '−';
        } else {
          div.removeChild(div.lastChild);
          btn.textContent = '+';
        }
      };
      div.appendChild(label);
      div.appendChild(btn);
      comidas.appendChild(div);
    });

    btnToggle.onclick = () => {
      comidas.classList.toggle('oculto');
      btnToggle.textContent = comidas.classList.contains('oculto') ? '+' : '−';
    };

    divDia.appendChild(titulo);
    divDia.appendChild(btnToggle);
    divDia.appendChild(comidas);
    contenedor.appendChild(divDia);
  });
}

document.getElementById('menu-btn').onclick = () => {
  document.getElementById('menu-opciones').classList.toggle('oculto');
};

document.getElementById('nuevo-menu').onclick = () => {
  alert('Aquí se generaría un nuevo menú (a implementar)');
};

window.onload = cargarDatos;