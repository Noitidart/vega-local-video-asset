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

const videoSource = 'https://www.w3schools.com/html/mov_bbb.mp4'; // require('../assets/mov_bbb.mp4');

function LocalVideo() {
  const [videoPlayerState, setVideoPlayerState] = useState<VideoPlayerState>({
    status: 'idle',
  });

  const createVideo = useCreateVideo({
    videoPlayerState,
    setVideoPlayerState,
  });

  useDestroyVideoBeforeUnmount(
    videoPlayerState.status === 'success' ? videoPlayerState.player : null,
  );

  useCreateVideoOnMount(createVideo);

  if (videoPlayerState.status === 'success') {
    return (
      <View style={styles.videoContainer}>
        <Text style={styles.text}>success</Text>

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

type CreateVideoInputs = {
  videoPlayerState: VideoPlayerState;
  setVideoPlayerState: (state: VideoPlayerState) => void;
};

function useCreateVideo({
  videoPlayerState,
  setVideoPlayerState,
}: CreateVideoInputs) {
  return useCallback(
    async function createVideo(): Promise<void> {
      if (videoPlayerState.status === 'success') {
        return;
      } else if (videoPlayerState.status === 'loading') {
        return;
      }

      setVideoPlayerState({status: 'loading'});

      const player = new VideoPlayer();

      try {
        await player.initialize();
      } catch (error: unknown) {
        setVideoPlayerState({
          status: 'error',
          message:
            'Failed to initialize video: ' +
            (error instanceof Error ? error.message : String(error)),
        });
        return;
      }

      player.loop = true;
      player.muted = false;
      player.src = videoSource;

      try {
        await player.play();
      } catch (error: unknown) {
        destroyVideo(player);
        setVideoPlayerState({
          status: 'error',
          message:
            'Failed to play video: ' +
            (error instanceof Error ? error.message : String(error)),
        });
        return;
      }

      setVideoPlayerState({status: 'success', player});
    },
    [videoPlayerState, setVideoPlayerState],
  );
}

function useCreateVideoOnMount(createVideo: () => void) {
  useEffect(
    function createVideoOnMount() {
      createVideo();
    },
    [createVideo],
  );
}

function destroyVideo(player: VideoPlayer) {
  player.pause();
  player.deinitialize();
}

function useDestroyVideoBeforeUnmount(player: VideoPlayer | null) {
  const playerRef = useRef<VideoPlayer | null>(null);
  playerRef.current = player;

  useEffect(function setupDestroyVideoBeforeUnmount() {
    return function destroyVideoBeforeUnmount() {
      if (!playerRef.current) {
        return;
      }

      destroyVideo(playerRef.current);
      playerRef.current = null;
    };
  }, []);
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
