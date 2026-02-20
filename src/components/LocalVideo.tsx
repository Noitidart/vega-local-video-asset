import {
  KeplerVideoView,
  VideoPlayer,
} from '@amazon-devices/react-native-w3cmedia';
import {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

type VideoPlayerState =
  | {status: 'idle'}
  | {status: 'loading'}
  | {status: 'error'; message: string}
  | {status: 'success'; player: VideoPlayer};

const videoSource = 'asset://mov_bbb.mp4';

function LocalVideo() {
  const [videoPlayerState, setVideoPlayerState] = useState<VideoPlayerState>({
    status: 'idle',
  });

  const videoPlayerRef = useRef<VideoPlayer | null>(null);

  const initializeVideo = useCallback(async () => {
    if (videoPlayerRef.current) return;

    setVideoPlayerState({status: 'loading'});

    try {
      const player = new VideoPlayer();
      await player.initialize();

      player.loop = true;
      player.muted = false;
      player.src = videoSource;

      videoPlayerRef.current = player;
      setVideoPlayerState({status: 'success', player});

      player.play().catch((error: unknown) => {
        console.error('Playback failed', error);
      });
    } catch (error: unknown) {
      setVideoPlayerState({
        status: 'error',
        message:
          'Failed to initialize video: ' +
          (error instanceof Error ? error.message : String(error)),
      });
    }
  }, []);

  useEffect(() => {
    initializeVideo();

    return () => {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.pause();
        videoPlayerRef.current.deinitialize();
        videoPlayerRef.current = null;
      }
    };
  }, [initializeVideo]);

  if (videoPlayerState.status === 'success') {
    return (
      <View style={styles.videoContainer}>
        <KeplerVideoView
          showControls={false}
          videoPlayer={videoPlayerState.player}
        />
      </View>
    );
  } else if (videoPlayerState.status === 'error') {
    return <Text style={styles.text}>error: {videoPlayerState.message}</Text>;
  }

  return <Text style={styles.text}>{videoPlayerState.status}</Text>;
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  text: {
    color: 'white',
    fontSize: 40,
  },
});

export default LocalVideo;
