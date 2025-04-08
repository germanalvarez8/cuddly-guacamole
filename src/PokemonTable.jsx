import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const PokemonTable = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de la API');
                }
                const data = await response.json();
                const pokemonDetails = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const pokemonResponse = await fetch(pokemon.url);
                        const pokemonData = await pokemonResponse.json();
                        return {
                            name: pokemonData.name,
                            height: pokemonData.height,
                            weight: pokemonData.weight,
                            types: pokemonData.types.map(type => type.type.name).join(', ')
                        };
                    })
                );
                setPokemons(pokemonDetails);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchPokemons();
    }, []);

    return (
        <div className="card">
            <DataTable
                value={pokemons}
                loading={loading}
                paginator
                rows={10}
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column field="name" header="Nombre" sortable></Column>
                <Column field="height" header="Altura" sortable></Column>
                <Column field="weight" header="Peso" sortable></Column>
                <Column field="types" header="Tipos" sortable></Column>
            </DataTable>
        </div>
    );
};

export default PokemonTable;