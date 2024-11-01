// Define um tipo para os nomes dos operadores
type OperadorName = 
  | 'NICOLLY'
  | 'Nicolly'
  | 'Igor'
  | 'Marcio'
  | 'kauane'
  | 'Kauane'
  | 'GiovanaBlandino'
  | 'Giovana'
  | 'Andrew'
  | 'YASMIM'
  | 'FRANCIELE'
  | 'Kaike'
  | 'KaioFerreira'
  | 'Kaio'
  | 'Ricardo03'
  | 'Ricardo'
  | 'Evelly'
  | 'Fernanda'
  | 'Luiz'
  | 'LuizAlberto'
  | 'giovannacristina'
  | 'giovanna'
  | 'filipe'
  | 'Filipe'
  | 'Nicoli'
  | 'NICOLI'
  | 'nicoli'
  | 'matheus'
  | 'Matheus'
  | 'MATHEUS'
  | 'cassiane'
  | 'CASSIANE'
  | 'Cassiane';

// Define um tipo para o objeto operadores
type Operadores = Record<OperadorName, string>;

// Cria o objeto operadores com a tipagem correta
const operadores: Operadores = {
  NICOLLY: "https://grupomapscartaodigital.com.br/operadores/nicolly.jpg",
  Nicolly: "https://grupomapscartaodigital.com.br/operadores/nicolly.jpg",
  Igor: "https://grupomapscartaodigital.com.br/operadores/igor.jpg",
  Marcio: "https://grupomapscartaodigital.com.br/operadores/marcio.jpg",
  kauane: "https://grupomapscartaodigital.com.br/operadores/kauane.jpg",
  Kauane: "https://grupomapscartaodigital.com.br/operadores/kauane.jpg",
  GiovanaBlandino: "https://grupomapscartaodigital.com.br/operadores/giovanaBlandino.jpg",
  Giovana: "https://grupomapscartaodigital.com.br/operadores/giovanaBlandino.jpg",
  Andrew: "https://grupomapscartaodigital.com.br/operadores/andrew.jpg",
  YASMIM: "https://grupomapscartaodigital.com.br/operadores/yasmim.jpg",
  FRANCIELE: "https://grupomapscartaodigital.com.br/operadores/franciele.jpg",
  Kaike: "https://grupomapscartaodigital.com.br/operadores/kaike.jpg",
  KaioFerreira: "https://grupomapscartaodigital.com.br/operadores/kaioFerreira.jpg",
  Kaio: "https://grupomapscartaodigital.com.br/img/logo.png",
  Ricardo03: "https://grupomapscartaodigital.com.br/operadores/ricardo.jpg",
  Ricardo: "https://grupomapscartaodigital.com.br/operadores/ricardo.jpg",
  Evelly: "https://grupomapscartaodigital.com.br/operadores/evelly.jpg",
  Fernanda: "https://grupomapscartaodigital.com.br/operadores/fernanda.jpg",
  Luiz: "https://grupomapscartaodigital.com.br/operadores/luizAlberto.jpg",
  LuizAlberto: "https://grupomapscartaodigital.com.br/operadores/luizAlberto.jpg",
  giovannacristina: "https://grupomapscartaodigital.com.br/operadores/giovannaCristina.jpg",
  giovanna: "https://grupomapscartaodigital.com.br/operadores/giovannaCristina.jpg",
  filipe: "https://grupomapscartaodigital.com.br/operadores/filipe.jpg",
  Filipe: "https://grupomapscartaodigital.com.br/operadores/filipe.jpg",
  Nicoli: "https://grupomapscartaodigital.com.br/operadores/nicoli.jpg",
  nicoli: "https://grupomapscartaodigital.com.br/operadores/nicoli.jpg",
  NICOLI: "https://grupomapscartaodigital.com.br/operadores/nicoli.jpg",
  matheus: "https://grupomapscartaodigital.com.br/operadores/matheus.jpg",
  Matheus: "https://grupomapscartaodigital.com.br/operadores/matheus.jpg",
  MATHEUS: "https://grupomapscartaodigital.com.br/operadores/matheus.jpg",
  cassiane: "https://grupomapscartaodigital.com.br/operadores/cassiane.jpg",
  CASSIANE: "https://grupomapscartaodigital.com.br/operadores/cassiane.jpg",
  Cassiane: "https://grupomapscartaodigital.com.br/operadores/cassiane.jpg",
};

// Exporta o objeto operadores
export default operadores;
