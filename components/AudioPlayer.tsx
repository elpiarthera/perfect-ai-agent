"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
	src: string;
	title: string;
	narrator?: string;
};

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2] as const;
type PlaybackRate = (typeof PLAYBACK_RATES)[number];

function formatTime(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
	src,
	title,
	narrator,
}: AudioPlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const progressRef = useRef<HTMLDivElement>(null);

	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
	const [isDragging, setIsDragging] = useState(false);

	// Sync audio events
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		function onTimeUpdate() {
			if (!isDragging) setCurrentTime(audio?.currentTime ?? 0);
		}
		function onLoadedMetadata() {
			setDuration(audio?.duration ?? 0);
		}
		function onEnded() {
			setIsPlaying(false);
			setCurrentTime(0);
		}
		function onPlay() {
			setIsPlaying(true);
		}
		function onPause() {
			setIsPlaying(false);
		}

		audio.addEventListener("timeupdate", onTimeUpdate);
		audio.addEventListener("loadedmetadata", onLoadedMetadata);
		audio.addEventListener("ended", onEnded);
		audio.addEventListener("play", onPlay);
		audio.addEventListener("pause", onPause);

		return () => {
			audio.removeEventListener("timeupdate", onTimeUpdate);
			audio.removeEventListener("loadedmetadata", onLoadedMetadata);
			audio.removeEventListener("ended", onEnded);
			audio.removeEventListener("play", onPlay);
			audio.removeEventListener("pause", onPause);
		};
	}, [isDragging]);

	// Keep audio playback rate in sync
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.playbackRate = playbackRate;
		}
	}, [playbackRate]);

	function togglePlay() {
		const audio = audioRef.current;
		if (!audio) return;
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play().catch(() => {
				// Playback rejected (e.g. autoplay policy) — state will update via event
			});
		}
	}

	function cyclePlaybackRate() {
		const currentIndex = PLAYBACK_RATES.indexOf(playbackRate);
		const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length;
		setPlaybackRate(PLAYBACK_RATES[nextIndex]);
	}

	const seekToPosition = useCallback(
		(clientX: number) => {
			const bar = progressRef.current;
			const audio = audioRef.current;
			if (!bar || !audio || !duration) return;
			const rect = bar.getBoundingClientRect();
			const ratio = Math.max(
				0,
				Math.min(1, (clientX - rect.left) / rect.width),
			);
			const newTime = ratio * duration;
			audio.currentTime = newTime;
			setCurrentTime(newTime);
		},
		[duration],
	);

	function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
		seekToPosition(e.clientX);
	}

	function handleProgressKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		const audio = audioRef.current;
		if (!audio || !duration) return;
		const step = duration * 0.05; // 5% per keypress
		if (e.key === "ArrowRight" || e.key === "ArrowUp") {
			e.preventDefault();
			const newTime = Math.min(duration, currentTime + step);
			audio.currentTime = newTime;
			setCurrentTime(newTime);
		} else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
			e.preventDefault();
			const newTime = Math.max(0, currentTime - step);
			audio.currentTime = newTime;
			setCurrentTime(newTime);
		} else if (e.key === "Home") {
			e.preventDefault();
			audio.currentTime = 0;
			setCurrentTime(0);
		} else if (e.key === "End") {
			e.preventDefault();
			audio.currentTime = duration;
			setCurrentTime(duration);
		}
	}

	// Mouse drag on progress bar
	useEffect(() => {
		if (!isDragging) return;

		function onMouseMove(e: MouseEvent) {
			seekToPosition(e.clientX);
		}
		function onMouseUp() {
			setIsDragging(false);
		}

		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [isDragging, seekToPosition]);

	const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
	const isEmpty = !src;

	if (isEmpty) {
		return (
			<section
				className="flex items-center gap-3 rounded-lg border border-gray-800 bg-surface px-4 py-3 font-sans text-sm text-muted"
				aria-label={`Audio player: ${title}`}
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M9 18V5l12-2v13"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
					<circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
				</svg>
				<span>Audio coming soon</span>
				{narrator && (
					<span className="ml-auto rounded border border-gray-700 px-2 py-0.5 text-xs text-gray-500">
						{narrator}
					</span>
				)}
			</section>
		);
	}

	return (
		<section
			className="rounded-lg border border-gray-800 bg-surface font-sans"
			aria-label={`Audio player: ${title}`}
		>
			{/* Hidden native audio element */}
			{/* biome-ignore lint/a11y/useMediaCaption: captions unavailable for AI-generated narration */}
			<audio ref={audioRef} src={src} preload="metadata" />

			{/* Top row: title + narrator badge */}
			<div className="flex items-center justify-between gap-2 border-b border-gray-800 px-4 py-2.5">
				<p className="truncate text-xs text-gray-400">{title}</p>
				{narrator && (
					<span className="shrink-0 rounded border border-gray-700 px-2 py-0.5 text-xs text-muted">
						{narrator}
					</span>
				)}
			</div>

			{/* Controls row */}
			<div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap">
				{/* Play / Pause */}
				<button
					type="button"
					onClick={togglePlay}
					aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
					className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-700 text-gray-300 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent"
					style={{
						color: isPlaying ? "#f59e0b" : undefined,
						borderColor: isPlaying ? "#f59e0b" : undefined,
					}}
				>
					{isPlaying ? (
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<rect x="6" y="4" width="4" height="16" rx="1" />
							<rect x="14" y="4" width="4" height="16" rx="1" />
						</svg>
					) : (
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M8 5.14v14l11-7-11-7z" />
						</svg>
					)}
				</button>

				{/* Progress + time: takes remaining width */}
				<div className="flex min-w-0 flex-1 flex-col gap-1.5">
					{/* Progress bar */}
					<div
						ref={progressRef}
						role="slider"
						aria-label="Seek audio"
						aria-valuemin={0}
						aria-valuemax={Math.round(duration)}
						aria-valuenow={Math.round(currentTime)}
						aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
						tabIndex={0}
						className="group relative h-2 cursor-pointer rounded-full bg-gray-800"
						onClick={handleProgressClick}
						onMouseDown={() => setIsDragging(true)}
						onKeyDown={handleProgressKeyDown}
					>
						{/* Fill */}
						<div
							className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-100"
							style={{ width: `${progressPercent}%` }}
							aria-hidden="true"
						/>
						{/* Thumb */}
						<div
							className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-accent bg-surface opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
							style={{ left: `calc(${progressPercent}% - 7px)` }}
							aria-hidden="true"
						/>
					</div>

					{/* Time */}
					<div className="flex justify-between text-xs tabular-nums text-gray-500">
						<span aria-hidden="true">{formatTime(currentTime)}</span>
						<span aria-hidden="true">
							{duration > 0 ? formatTime(duration) : "--:--"}
						</span>
					</div>
				</div>

				{/* Playback rate */}
				<button
					type="button"
					onClick={cyclePlaybackRate}
					aria-label={`Playback speed: ${playbackRate}x. Click to change.`}
					className="h-11 shrink-0 rounded border border-gray-700 px-2.5 text-xs text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-300 focus-visible:border-accent focus-visible:text-accent"
				>
					{playbackRate === 1 ? "1x" : `${playbackRate}x`}
				</button>
			</div>
		</section>
	);
}
