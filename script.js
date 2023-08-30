const apiUrl = 'https://rickandmortyapi.com/api/';
const campoBusca = document.getElementById('campoBusca');
const resultado = document.getElementById('resultado');
const opcoesBusca = document.getElementById('opcoesBusca');
const homeDiv = document.getElementById('home');
const pag = document.getElementById('pag');
const numeroPa = document.getElementById('numero-pa');
const apiLink = document.getElementById('api-link');
let currentPage = 1;
// const body = document.body;

// informações da API - quantidade
axios
  .get(apiUrl + 'character')
  .then((response) => {
    const quantidadePersonagens = response.data.info.count;
    const nper = document.getElementById('nper');
    nper.innerHTML = `${quantidadePersonagens}`;
  })
  .catch((error) => {
    console.error('Erro ao obter quantidade de personagens:', error);
  });

axios
  .get(apiUrl + 'location')
  .then((response) => {
    const quantidadeLocalizacoes = response.data.info.count;
    const nloc = document.getElementById('nloc');
    nloc.innerHTML = `${quantidadeLocalizacoes}`;
  })
  .catch((error) => {
    console.error('Error getting number of locations:', error);
  });

axios
  .get(apiUrl + 'episode')
  .then((response) => {
    const quantidadeEpisodios = response.data.info.count;
    const nep = document.getElementById('nep');
    nep.innerHTML = `${quantidadeEpisodios}`;
  })
  .catch((error) => {
    console.error('Error getting number of episodes:', error);
  });

// campo de pesquisa ----------------------------------------------------------------

async function buscarNomeUltimoEpisodio(urlEpisodio) {
  try {
    const response = await axios.get(urlEpisodio);
    const ultimoEpisodio = response.data;
    return ultimoEpisodio.name;
  } catch (error) {
    console.error('Error getting last episode details:', error);
    return 'Error getting episode details';
  }
}

async function mostrarPersonagem(personagem) {
  try {
    const ultimoEpisodioName = await buscarNomeUltimoEpisodio(
      personagem.episode[personagem.episode.length - 1]
    );

    let estadoPersonagem = '';
    switch (personagem.status) {
      case 'Alive':
        estadoPersonagem = '🟢';
        break;
      case 'Dead':
        estadoPersonagem = '🔴';
        break;
      default:
        estadoPersonagem = '⚪';
    }

    resultado.innerHTML = `
    <div class="card mb-3 text-light fw-medium rounded-3" style="max-width: 540px; min-height: 220px; background-color: #34473B">
    <div class="row g-0 fs-6 px-3">
    
      <div class="col-md-4">
        <div class="d-flex align-items-center h-100"> 
        <img src="${personagem.image}" class="img-fluid rounded-start" alt="personagem.name">
        </div>
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title fw-semibold">${personagem.name}</h5>
          <p class="card-text mb-1 fw-medium"> ${estadoPersonagem} ${personagem.status} - ${personagem.species} </p>
          <p class="card-text mb-1"> <span class="fw-medium text-secondary"> Last Known Location: </span><br>${personagem.location.name} </p>
          <p class="card-text mb-1"> <span class="fw-medium text-secondary"> Last seen:</span><br>${ultimoEpisodioName} </p>
        </div>
      </div>
    </div>
    </div>
    `;
    campoBusca.innerHTML = '';
  } catch (error) {
    console.error('Error showing character:', error);
    resultado.innerHTML = 'An error occurred while displaying the character.';
  }
}

function buscarPersonagem(nome) {
  axios
    .get(apiUrl + 'character', {
      params: { name: nome },
    })
    .then((response) => {
      const personagens = response.data.results;

      if (personagens.length > 0) {
        mostrarPersonagem(personagens[0]);
      } else {
        resultado.innerHTML = 'Character not found.';
      }

      exibirOpcoesBusca(personagens);
    })
    .catch((error) => {
      console.error('Error fetching character:', error);
      resultado.innerHTML = 'An error occurred while fetching the character.';
    });
}

function exibirOpcoesBusca(personagens) {
  opcoesBusca.innerHTML = '';
  personagens.forEach((personagem) => {
    const opcao = document.createElement('div');
    opcao.textContent = personagem.name;
    opcao.classList.add('opcao-busca');
    opcao.addEventListener('click', () => {
      campoBusca.value = personagem.name;
      buscarPersonagem(personagem.name);
      opcoesBusca.innerHTML = ''; // Remover opções após seleção
    });
    opcoesBusca.appendChild(opcao);
  });
}

campoBusca.addEventListener('input', () => {
  opcoesBusca.style.display = 'block';
  resultado.style.display = 'none';
  const nomePersonagem = campoBusca.value.trim();
  if (!nomePersonagem) {
    opcoesBusca.innerHTML = '';
    resultado.innerHTML = '';
  } else {
    opcoesBusca.innerHTML = ''; // Limpar opções de busca quando o usuário digitar algo
    buscarPersonagem(nomePersonagem);
  }
});

opcoesBusca.addEventListener('click', () => {
  opcoesBusca.style.display = 'none';
  resultado.style.display = 'block';
  mostrarPersonagem();
});

// exibição dos personagens na home --------------------------------
function criarElementoPersonagem(personagem, ultimoEpisodioName) {
  const personagemDiv = document.createElement('div');
  personagemDiv.classList.add('col-12', 'col-md-6'); // Ajuste as classes das colunas aqui

  let estadoPersonagem = '';
  switch (personagem.status) {
      case 'Alive':
          estadoPersonagem = '🟢';
          break;
      case 'Dead':
          estadoPersonagem = '🔴';
          break;
      default:
          estadoPersonagem = '⚪';
  }

  

  personagemDiv.innerHTML = `
      <div class="card mb-3 text-light fw-medium rounded-3" style="background-color: #34473B">
          <div class="px-3" onclick="detalhes(this)">
              <div class="row">
                  <div class="col-12 col-sm-12 col-md-4 col-lg-5">
                      <div class="d-flex align-items-center h-100">
                          <img id="immagem-card" src="${personagem.image}" class="img-fluid rounded-start" alt="${personagem.name}">
                      </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-8 col-lg-7">
                      <div class="card-body">
                          <h5 class="card-title fw-semibold" id="titulo-card">${personagem.name}</h5>
                          <p class="card-text mb-1 fw-medium">${estadoPersonagem} ${personagem.status} - ${personagem.species}</p>
                          <p class="card-text mb-1"><span class="fw-medium text-secondary">Last Known Location:</span><br>${personagem.location.name}</p>
                          <p class="card-text mb-1"><span class="fw-medium text-secondary">Last seen:</span><br>${ultimoEpisodioName}</p>
                      </div>
                  </div>
              </div>
            </div>

              
          </div>
      </div>
  `;
 

  return personagemDiv;
}

function detalhes(card) {
  const cardTitle = card.querySelector('.card-title').textContent;
  const cardStatus = card.querySelector('.card-text.mb-1.fw-medium').textContent;

  console.log(`Name: ${cardTitle}, Status: ${cardStatus}`);
  console.log(card)
  
}



async function buscarPersonagensPaginados(pageNumber) {
  try {
    const pageSize = 6;
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?page=${pageNumber}`
    );
    const data = response.data;

    // Retornar a lista de personagens e informações de paginação
    return {
      personagens: data.results,
      info: {
        currentPage: data.info.page,
        totalPages: Math.ceil(data.info.count / pageSize),
      },
    };
  } catch (error) {
    console.error('Error when fetching paginated characters:', error);
    return {
      personagens: [],
      info: {
        currentPage: 1,
        totalPages: 1,
      },
    };
  }
}

async function carregarPersonagens(currentPage) {
  try {
    const { personagens, info } = await buscarPersonagensPaginados(currentPage);
    const primeirosSeisPersonagens = personagens.slice(0, 6);
    for (const personagem of primeirosSeisPersonagens) {
      const ultimoEpisodioName = await buscarNomeUltimoEpisodio(
        personagem.episode[personagem.episode.length - 1]
      );
      const personagemDiv = criarElementoPersonagem(
        personagem,
        ultimoEpisodioName
      );
      homeDiv.appendChild(personagemDiv);
    }
  } catch (error) {
    console.error('Error loading characters:', error);
  }
}

// Paginação --------------------------------

function carregarPaginaAnterior() {
  if (currentPage > 1) {
    currentPage--;
    console.log(currentPage);
    numeroPa.innerHTML = `${currentPage}`;
    homeDiv.innerHTML = '';
    carregarPersonagens(currentPage);
  }
}

function carregarProximaPagina() {
  currentPage++;
  console.log(currentPage);
  numeroPa.innerHTML = `${currentPage}`;

  homeDiv.innerHTML = '';
  carregarPersonagens(currentPage);
}

document
  .getElementById('pagina-anterior')
  .addEventListener('click', carregarPaginaAnterior);
document
  .getElementById('proxima-pagina')
  .addEventListener('click', carregarProximaPagina);

carregarPersonagens(currentPage);

// mudar tema

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
personagem = document.querySelectorAll('.personagem');

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
});

window.addEventListener('load', () => {
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
  }
});
