import React, { useEffect, useState } from 'react';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState(null);

  useEffect(() => {
    const fetchPokemonList = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      setPokemonList(data.results);
      setFilteredPokemonList(data.results);
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (selectedPokemon) {
        const response = await fetch(selectedPokemon.url);
        const data = await response.json();
        setPokemonDetails(data);
      }
    };

    fetchPokemonDetails();
  }, [selectedPokemon]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filteredList = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(term)
    );
    setFilteredPokemonList(filteredList);
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const renderPokemonDetails = () => {
    if (!selectedPokemon || !pokemonDetails) {
      return null;
    }

    const { name } = selectedPokemon;
    const { sprites, abilities, stats } = pokemonDetails;

    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-75">
        <div className="max-w-lg p-4 bg-white rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">{name}</h2>
          <img
            src={sprites.front_default}
            alt={name}
            className="mx-auto mb-4"
          />
          <div>
            <h3 className="text-lg font-bold">Abilities:</h3>
            <ul>
              {abilities.map((ability) => (
                <li key={ability.ability.name}>{ability.ability.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Stats:</h3>
            <ul>
              {stats.map((stat) => (
                <li key={stat.stat.name}>
                  {`${stat.stat.name}: ${stat.base_stat}`}
                </li>
              ))}
            </ul>
          </div>
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
            onClick={() => setSelectedPokemon(null)}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Pokédex App</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Pokémon"
          className="border border-gray-300 rounded px-4 py-2"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
        {filteredPokemonList.map((pokemon) => (
          <div
            key={pokemon.name}
            className="bg-gray-200 rounded-lg p-4 text-center cursor-pointer"
            onClick={() => handlePokemonClick(pokemon)}
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url
                .split('/')
                .slice(-2, -1)}.png`}
              alt={pokemon.name}
              className="mx-auto mb-2"
            />
            <span className="text-sm text-gray-800">{pokemon.name}</span>
          </div>
        ))}
      </div>
      {renderPokemonDetails()}
    </div>
  );
};

export default App;
