import { useEffect, useRef, useState } from "react";

const BackgroundMusic = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Playback failed:", err));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.volume = 0.5;
    }

    // Optional: try autoplay (won't always work)
    audio?.play().then(() => setIsPlaying(true)).catch(() => {
      console.log("Autoplay failed — user interaction required");
    });

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [src]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} src={src} />
      <button
        onClick={togglePlayback}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        {isPlaying ? "🔊 Sound Off" : "🔈 Sound On"}
      </button>
    </div>
  );
};

export default BackgroundMusic;
