import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark, Play, ChevronLeft, Star, Clock } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { fetchMovieDetails, getImageUrl } from '@/utils/api';

const { width } = Dimensions.get('window');

export default function MovieScreen() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<any>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    loadMovie();
    checkWatchlist();
  }, [id]);

  const loadMovie = async () => {
    try {
      const data = await fetchMovieDetails(Number(id));
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const checkWatchlist = async () => {
    try {
      const watchlist = await AsyncStorage.getItem('watchlist');
      const watchlistIds = watchlist ? JSON.parse(watchlist) : [];
      setIsInWatchlist(watchlistIds.includes(Number(id)));
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  };

  const toggleWatchlist = async () => {
    try {
      const watchlist = await AsyncStorage.getItem('watchlist');
      const watchlistIds = watchlist ? JSON.parse(watchlist) : [];
      const movieId = Number(id);

      if (isInWatchlist) {
        const newWatchlist = watchlistIds.filter(
          (id: number) => id !== movieId,
        );
        await AsyncStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      } else {
        watchlistIds.push(movieId);
        await AsyncStorage.setItem('watchlist', JSON.stringify(watchlistIds));
      }

      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const handleBack = () => {
    if (showTrailer) {
      setShowTrailer(false);
    } else {
      router.back();
    }
  };

  if (!movie) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const renderTrailer = () => {
    if (!movie.trailer) return null;

    return (
      <View style={styles.trailerContainer}>
        <WebView
          style={styles.trailer}
          javaScriptEnabled={true}
          source={{
            uri: `https://www.youtube.com/embed/${movie.trailer.key}?rel=0&autoplay=1`,
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <ChevronLeft color="#FFFFFF" size={24} />
          </Pressable>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: backdropUrl }}
              style={styles.backdrop}
              resizeMode="cover"
            />
            {!showTrailer && movie.trailer && (
              <Pressable
                style={styles.playButton}
                onPress={() => setShowTrailer(true)}
              >
                <Play color="#FFFFFF" size={32} fill="#FFFFFF" />
              </Pressable>
            )}
            <LinearGradient
              colors={['transparent', '#121212']}
              style={styles.gradient}
            />
          </View>

          {showTrailer && renderTrailer()}

          <View style={styles.posterContainer}>
            <Image
              source={{ uri: posterUrl }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.ratingContainer}>
                <Star color="#F59E0B" size={16} fill="#F59E0B" />
                <Text style={styles.rating}>
                  {movie.vote_average.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Pressable
            style={[
              styles.watchlistButton,
              isInWatchlist && styles.inWatchlist,
            ]}
            onPress={toggleWatchlist}
          >
            <Bookmark
              size={20}
              color={isInWatchlist ? '#121212' : '#FFFFFF'}
              fill={isInWatchlist ? '#121212' : 'none'}
            />
            <Text
              style={[
                styles.watchlistText,
                isInWatchlist && styles.inWatchlistText,
              ]}
            >
              {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </Text>
          </Pressable>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.detailText}>
                {formatRuntime(movie.runtime)}
              </Text>
            </View>
            <Text style={styles.detailText}>
              {new Date(movie.release_date).getFullYear()}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>

          <Text style={styles.sectionTitle}>Cast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.castContainer}
          >
            {movie.credits.cast.slice(0, 10).map((actor: any) => (
              <View key={actor.id} style={styles.castMember}>
                <Image
                  source={{
                    uri: actor.profile_path
                      ? getImageUrl(actor.profile_path)
                      : 'https://via.placeholder.com/200x300?text=No+Image',
                  }}
                  style={styles.castImage}
                />
                <Text style={styles.castName} numberOfLines={1}>
                  {actor.name}
                </Text>
                <Text style={styles.character} numberOfLines={1}>
                  {actor.character}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.genres}>
            {movie.genres.map((genre: any) => (
              <View key={genre.id} style={styles.genre}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  loading: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 10,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
    backgroundColor: 'rgba(226, 18, 33, 0.9)',
    borderRadius: 32,
    padding: 16,
    zIndex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  trailerContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  trailer: {
    flex: 1,
  },
  posterContainer: {
    flexDirection: 'row',
    padding: 16,
    marginTop: -80,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  watchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1D2B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  inWatchlist: {
    backgroundColor: '#E21221',
  },
  watchlistText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  inWatchlistText: {
    color: '#121212',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    color: '#6B7280',
    marginLeft: 4,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  overview: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  castContainer: {
    marginBottom: 24,
  },
  castMember: {
    width: 100,
    marginRight: 12,
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  castName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  character: {
    color: '#6B7280',
    fontSize: 12,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genre: {
    backgroundColor: '#1F1D2B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
