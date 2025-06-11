async function cargarDatos() {
  let menuActual = JSON.parse(localStorage.getItem("menuActual"));
  if (!menuActual) {
    menuActual = await fetch('menu.json').then(r => r.json());
    localStorage.setItem("menuActual", JSON.stringify(menuActual));
    localStorage.setItem("historico", JSON.stringify([]));
  }
  renderizar(menuActual);
}

async function renderizar(menu) {
  const recetas = await fetch('recetas.json').then(r => r.json());
  const contenedor = document.getElementById('calendario');
  contenedor.innerHTML = "";

  menu.forEach(dia => {
    const divDia = document.createElement('div');
    divDia.className = "bg-white p-4 rounded shadow";

    const titulo = document.createElement('h2');
    titulo.textContent = dia.fecha;
    titulo.className = "text-lg font-bold mb-2";

    const btnToggle = document.createElement('button');
    btnToggle.textContent = '+';
    btnToggle.className = "text-sm px-2 py-1 bg-green-200 rounded";
    const comidas = document.createElement('div');
    comidas.className = "hidden mt-2";

    Object.entries(dia).forEach(([clave, platillo]) => {
      if (clave !== "fecha") {
        const div = document.createElement('div');
        div.className = "my-2";
        const label = document.createElement('div');
        label.textContent = clave + ": " + platillo;
        label.className = "font-medium";
        const btn = document.createElement('button');
        btn.textContent = '+';
        btn.className = "ml-2 text-sm text-green-700";
        btn.onclick = () => {
          if (div.lastChild.nodeName !== 'DIV') {
            const receta = recetas[clave + ": " + platillo] || {ingredientes: [], preparacion: []};
            const det = document.createElement('div');
            det.className = "bg-gray-50 p-2 mt-1 rounded text-sm";
            det.innerHTML = `<p><strong>Ingredientes:</strong><ul class="list-disc list-inside">${receta.ingredientes.map(i => `<li>${i}</li>`).join('')}</ul></p>
              <p class="mt-2"><strong>Preparación:</strong><ol class="list-decimal list-inside">${receta.preparacion.map(p => `<li>${p}</li>`).join('')}</ol></p>`;
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
      }
    });

    btnToggle.onclick = () => {
      comidas.classList.toggle('hidden');
      btnToggle.textContent = comidas.classList.contains('hidden') ? '+' : '−';
    };

    divDia.appendChild(titulo);
    divDia.appendChild(btnToggle);
    divDia.appendChild(comidas);
    contenedor.appendChild(divDia);
  });
}

document.getElementById('menu-btn').onclick = () => {
  document.getElementById('menu-opciones').classList.remove('hidden');
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  const lista = document.getElementById('lista-semanas');
  lista.innerHTML = "";
  historico.forEach((menu, idx) => {
    const li = document.createElement('li');
    li.textContent = "Semana " + (idx + 1);
    li.className = "cursor-pointer text-green-700 underline";
    li.onclick = () => renderizar(menu);
    lista.appendChild(li);
  });
};

document.getElementById('nuevo-menu').onclick = async () => {
  const recetas = await fetch('recetas.json').then(r => r.json());
  const categorias = {
    Desayuno: [], Smoothie: [], Snack: [], Comida: [], Cena: []
  };

  Object.entries(recetas).forEach(([clave, datos]) => {
    const tipo = clave.split(":")[0].replace(/[^a-zA-Z]/g, '');
    if (categorias[tipo]) categorias[tipo].push({clave, ...datos});
  });

  function elegir(lista) {
    const copia = [...lista];
    return copia.splice(Math.floor(Math.random() * copia.length), 1)[0];
  }

  const nuevo = [];
  for (let i = 0; i < 7; i++) {
    nuevo.push({
      fecha: `🟩Día ${i + 1}`,
      [elegir(categorias.Desayuno).clave]: elegir(categorias.Desayuno).clave.split(": ")[1],
      [elegir(categorias.Smoothie).clave]: elegir(categorias.Smoothie).clave.split(": ")[1],
      [elegir(categorias.Snack).clave]: elegir(categorias.Snack).clave.split(": ")[1],
      [elegir(categorias.Comida).clave]: elegir(categorias.Comida).clave.split(": ")[1],
      [elegir(categorias.Snack).clave]: elegir(categorias.Snack).clave.split(": ")[1],
      [elegir(categorias.Cena).clave]: elegir(categorias.Cena).clave.split(": ")[1],
    });
  }

  const actual = JSON.parse(localStorage.getItem("menuActual"));
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  historico.push(actual);
  localStorage.setItem("historico", JSON.stringify(historico));
  localStorage.setItem("menuActual", JSON.stringify(nuevo));
  renderizar(nuevo);
};

window.onload = cargarDatos;