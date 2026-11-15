import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import { formatTime } from './RevOptionList';

// Every hunt page plays clips of one video: CodeNamePizza's "REVELATIONS EASTER EGG GUIDE [2022]"
// (YouTube oEmbed, 2026-11-14 audit). The credit is on the YouTube link's name and tooltip; a visible
// credit line is a look change and waits for Bryen's approval.
const GUIDE_VIDEO = { id: 'tt3mpH7Rrfo', author: 'CodeNamePizza' };

const GuideVideoPlayer = forwardRef(function GuideVideoPlayer(
  {
    videoId = GUIDE_VIDEO.id,
    title = 'Revelations guide video',
    caption = 'Choose a section to jump directly to that part of the guide.',
    nowPlaying = null,
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

  const credited = videoId === GUIDE_VIDEO.id;
  const youtubeHref = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&t=${Math.floor(selectedStart)}s`;

  return (
    <figure className="rev-video">
      <div className="rev-video__frame">
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
          className="rev-video__player"
          iframeClassName="rev-video-player__iframe"
        />
      </div>
      <figcaption className="rev-video__bar">
        <span className="rev-video__now" role="status">
          {nowPlaying ? (
            <>
              <span className="rev-video__label">Playing</span>{' '}
              <span className="rev-video__title">{nowPlaying}</span>
            </>
          ) : (
            <span className="rev-video__hint">{caption}</span>
          )}
          {failed && <span className="rev-video__warning"> Player unavailable here — use YouTube.</span>}
        </span>
        <a
          className="rev-video__external"
          href={youtubeHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${selectedStart ? 'the selected timestamp' : credited ? `${GUIDE_VIDEO.author}’s guide` : 'the guide'} on YouTube`}
          title={credited ? `Video: ${GUIDE_VIDEO.author}` : undefined}
        >
          {selectedStart ? `YouTube at ${formatTime(selectedStart)}` : 'Open on YouTube'} <span aria-hidden="true">↗</span>
        </a>
      </figcaption>
    </figure>
  );
});

export default GuideVideoPlayer;
