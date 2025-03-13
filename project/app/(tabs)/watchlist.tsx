import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MovieCard } from '@/components/MovieCard';
import { fetchMovieDetails } from '@/utils/api';

export default function WatchlistScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const watchlistIds = await AsyncStorage.getItem('watchlist');
      if (watchlistIds) {
        const ids = JSON.parse(watchlistIds);
        const movieDetails = await Promise.all(
          ids.map((id) => fetchMovieDetails(id))
        );
        setMovies(movieDetails);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Watchlist</Text>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={styles.loading}>Loading watchlist...</Text>
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
        ) : (
          <Text style={styles.empty}>Your watchlist is empty</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 16,
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
  loading: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  empty: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});