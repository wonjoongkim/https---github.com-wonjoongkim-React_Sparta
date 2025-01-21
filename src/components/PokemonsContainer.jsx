import { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import { formatPokemonData } from '../utils/pokemon-helper';
import Loader from './Loader';

const PokemonsContainer = ({ type }) => {
  const [pokemons, setPokemons] = useState([]); // 모든 포켓몬 데이터
  const [filteredPokemons, setFilteredPokemons] = useState([]); // 필터링된 포켓몬
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [monsterAbilitiesData, setMonsterAbilitiesData] = useState({}); // 몬스터별 데이터를 저장

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const API_END_POINT = `https://pokeapi.co/api/v2/type/${type}`;
        const res = await fetch(API_END_POINT);
        const { pokemon: pokemonList } = await res.json();

        const pokemons = await Promise.all(
          pokemonList.map(async ({ pokemon }) => {
            const res = await fetch(pokemon.url);
            const data = await res.json();
            return formatPokemonData(data);
          })
        );

        // 검색어에 맞는 포켓몬 필터링
        setFilteredPokemons(
          pokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );

        const abilitiesData = {};

        for (const pokemon of pokemons) {
          const abilityUrls = pokemon.abilities.map((ability) => ability.ability.url);

          // 각 URL에 대해 병렬로 fetch 호출
          const abilityResponses = await Promise.all(
            abilityUrls.map((url) => fetch(url))
          );

          const abilities = await Promise.all(
            abilityResponses.map((res) => {
              if (!res.ok) {
                throw new Error(`Failed to fetch ability data: ${res.status}`);
              }
              return res.json();
            })
          );

          // 한국어 flavor text 필터링
          const koreanEntries = abilities
            .flatMap((s) => s.flavor_text_entries)
            .filter((entry) => entry.language.name === 'ko');

          // 중복 제거
          const uniqueEntries = Array.from(
            new Set(koreanEntries.map((entry) => entry.flavor_text))
          ).map((text) => koreanEntries.find((entry) => entry.flavor_text === text));

          abilitiesData[pokemon.id] = uniqueEntries;
        }

        // console.log(abilitiesData)
        setMonsterAbilitiesData(abilitiesData);
        setPokemons(pokemons); // 전체 포켓몬 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }

      setLoading(false);
    };

    fetchPokemons();
  }, [type]);

  // 검색어가 변경될 때마다 포켓몬 필터링
  useEffect(() => {
    setFilteredPokemons(
      pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, pokemons]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className='search-bar'>
        <input placeholder="Search Pokemon"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} className='search-input' />
      </div>
      <div className='pokemons-container'>
        {filteredPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            datas={monsterAbilitiesData[pokemon.id] || []} // 개별 데이터를 전달
          />
        ))}
      </div>
    </div>
  );
};

export default PokemonsContainer;
