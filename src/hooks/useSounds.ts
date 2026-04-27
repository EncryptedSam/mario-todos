import { useEffect, useRef } from "react";

type SoundMap = Record<string, HTMLAudioElement>;

export const useSounds = () => {
  const soundsRef = useRef<SoundMap>({});
  const volumeRef = useRef<number>(0.5);

  useEffect(() => {
    const modules = import.meta.glob("/src/assets/sounds/*.mp3", {
      eager: true,
      as: "url",
    }) as Record<string, string>;

    const sounds: SoundMap = {};

    Object.entries(modules).forEach(([path, url]) => {
      const name = path.split("/").pop()?.replace(".mp3", "") || "";

      const audio = new Audio(url);
      audio.preload = "auto";
      audio.volume = volumeRef.current;

      sounds[name] = audio;
    });

    soundsRef.current = sounds;
  }, []);

  const setVolume = (value: number) => {
    // clamp between 0 and 1
    const vol = Math.min(1, Math.max(0, value));
    volumeRef.current = vol;

    Object.values(soundsRef.current).forEach((audio) => {
      audio.volume = vol;
    });
  };

  const play = (name: string) => {
    const sound = soundsRef.current[name];
    if (!sound) return;

    sound.currentTime = 0;
    sound.volume = volumeRef.current;
    sound.play().catch(() => {});
  };

  const stop = (name: string) => {
    const sound = soundsRef.current[name];
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
  };

  const stopAll = () => {
    Object.values(soundsRef.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  return {
    play,
    stop,
    stopAll,
    setVolume,
    getVolume: () => volumeRef.current,
  };
};
