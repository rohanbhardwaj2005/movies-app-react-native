import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon } from 'lucide-react-native';
import { MovieCard } from '@/components/MovieCard';
import { searchMovies } from '@/utils/api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setLoading(true);
      try {
        const data = await searchMovies(text);
        setMovies(data.results);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setMovies([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          placeholderTextColor="#6B7280"
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#E21221" />
        ) : movies.length > 0 ? (
          <View style={styles.grid}>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                voteAverage={movie.vote_average}
                releaseDate={movie.release_date}
              />
            ))}
          </View>
        ) : query.length > 2 ? (
          <Text style={styles.noResults}>No movies found</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    backgroundColor: '#1F1D2B',
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  noResults: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});