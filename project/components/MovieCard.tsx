import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { getImageUrl } from '@/utils/api';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
}

export function MovieCard({ id, title, posterPath, voteAverage, releaseDate }: MovieCardProps) {
  const imageUrl = getImageUrl(posterPath);
  const year = new Date(releaseDate).getFullYear();

  return (
    <Link href={`/movie/${id}`} asChild>
      <Pressable style={styles.container}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.details}>
            <Text style={styles.year}>{year}</Text>
            <Text style={styles.rating}>★ {voteAverage.toFixed(1)}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#1F1D2B',
    borderRadius: 12,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 240,
    backgroundColor: '#2D2B3B',
  },
  info: {
    padding: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  year: {
    color: '#6B7280',
    fontSize: 12,
  },
  rating: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
  },
});