"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AudioPlayer from "./AudioPlayer";
import ConvexClientProvider from "./ConvexClientProvider";
import { Component, type ReactNode } from "react";

class AudioErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function DiaryAudioPlayerInner({
  slug,
  locale,
  title,
  narrator,
}: {
  slug: string;
  locale: string;
  title: string;
  narrator: string;
}) {
  const audioUrl = useQuery(api.audio.getAudioUrl, { slug, locale });

  if (audioUrl === undefined || audioUrl === null) return null;

  return <AudioPlayer src={audioUrl} title={title} narrator={narrator} />;
}

export default function DiaryAudioPlayer(props: {
  slug: string;
  locale: string;
  title: string;
  narrator: string;
}) {
  return (
    <AudioErrorBoundary>
      <ConvexClientProvider>
        <DiaryAudioPlayerInner {...props} />
      </ConvexClientProvider>
    </AudioErrorBoundary>
  );
}
