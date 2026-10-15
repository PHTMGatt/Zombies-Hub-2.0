import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import YouTube from 'react-youtube';

const GuideVideoPlayer = forwardRef(function GuideVideoPlayer(
  {
    videoId = 'tt3mpH7Rrfo',
    title = 'Revelations guide video',
    caption = 'Choose a section to jump directly to that part of the guide.',
  },
  ref,
) {
  const playerRef = useRef(null);
  const stopTimerRef = useRef(null);
  const pendingSegmentRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [selectedStart, setSelectedStart] = useState(0);

  const clearStopTimer = () => {
    if (stopTimerRef.current) {
      window.clearInterval(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  };

  const runSegment = (player, start, end) => {
    clearStopTimer();
    player.seekTo(start, true);
    player.playVideo();

    if (typeof end === 'number' && end > start) {
      stopTimerRef.current = window.setInterval(() => {
        const current = playerRef.current?.getCurrentTime?.();
        if (typeof current === 'number' && current >= end) {
          playerRef.current?.pauseVideo?.();
          clearStopTimer();
        }
      }, 250);
    }
  };

  const playSegment = (start, end) => {
    if (!Number.isFinite(start) || start < 0) return false;
    setSelectedStart(start);
    const segment = { start, end };
    const player = playerRef.current;

    if (!player) {
      pendingSegmentRef.current = segment;
      return true;
    }

    pendingSegmentRef.current = null;
    runSegment(player, start, end);
    return true;
  };

  useImperativeHandle(ref, () => ({
    playSegment,
    seekTo(start) {
      return playSegment(start);
    },
  }));

  useEffect(() => () => {
    clearStopTimer();
    playerRef.current = null;
    pendingSegmentRef.current = null;
  }, []);

  const opts = {
    width: '100%',
    height: '310',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
    },
  };

  return (
    <div className="video-card rev-video-player">
      <YouTube
        videoId={videoId}
        opts={opts}
        title={title}
        onError={() => {
          setFailed(true);
          clearStopTimer();
        }}
        onReady={(event) => {
          setFailed(false);
          playerRef.current = event.target;

          const pending = pendingSegmentRef.current;
          if (pending) {
            pendingSegmentRef.current = null;
            runSegment(event.target, pending.start, pending.end);
          }
        }}
        className="sk-video"
        iframeClassName="rev-video-player__iframe"
      />
      <div className="video-caption">{caption}</div>
      <p className="video-caption">
        {failed && <span role="status">The embedded player is unavailable. </span>}
        <a href={`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&t=${Math.floor(selectedStart)}s`} target="_blank" rel="noopener noreferrer">
          Watch {selectedStart ? 'the selected timestamp' : 'the guide'} on YouTube
        </a>
      </p>
    </div>
  );
});

export default GuideVideoPlayer;
