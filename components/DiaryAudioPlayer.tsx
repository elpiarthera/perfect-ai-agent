"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AudioPlayer from "./AudioPlayer";
import ConvexClientProvider from "./ConvexClientProvider";

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
    <ConvexClientProvider>
      <DiaryAudioPlayerInner {...props} />
    </ConvexClientProvider>
  );
}
