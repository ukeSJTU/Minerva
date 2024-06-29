"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
import { SeriesDropdown } from "@/components/series_dropdown";

interface SeriesInfo {
  id: number;
  title: string;
  currentPost: { id: number; title: string; orderInSeries: number };
  prevPost: { id: number; title: string } | null;
  nextPost: { id: number; title: string } | null;
  totalPosts: number;
  posts: { id: number; title: string; orderInSeries: number }[];
}

export function DynamicIsland() {
  const [seriesInfo, setSeriesInfo] = useState<SeriesInfo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchSeriesInfo = async () => {
      const postId = pathname.split("/").pop();
      if (postId && !isNaN(Number(postId))) {
        const response = await fetch(`/api/series-info/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setSeriesInfo(data);
        } else {
          setSeriesInfo(null);
        }
      } else {
        setSeriesInfo(null);
      }
    };

    fetchSeriesInfo();
  }, [pathname]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getSeriesProgress = () => {
    if (seriesInfo) {
      return Math.round(
        ((seriesInfo.currentPost.orderInSeries - 1) / seriesInfo.totalPosts) *
          100
      );
    }
    return 0;
  };

  if (!seriesInfo) {
    return null;
  }

  return (
    <div className="fixed pt-[60px] mx-auto w-max top-4 bg-background/80 backdrop-blur-md shadow-md rounded-full px-4 py-2 flex items-center space-x-4 z-50">
      <SeriesDropdown
        posts={seriesInfo.posts}
        currentPostId={seriesInfo.currentPost.id}
        seriesTitle={seriesInfo.title}
      />
      <Link href={`/series/${seriesInfo.id}`}>
        <span className="text-sm font-bold">{seriesInfo.title}</span>
      </Link>
      <span className="text-sm">
        {seriesInfo.currentPost.orderInSeries} of {seriesInfo.totalPosts}
      </span>
      <div className="flex items-center space-x-2">
        {seriesInfo.prevPost ? (
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/posts/${seriesInfo.prevPost.id}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs">{getSeriesProgress()}%</span>
          </div>
          <svg className="w-8 h-8 text-gray-300" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-green-500"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${getSeriesProgress()}, 100`}
            />
          </svg>
        </div>
        {seriesInfo.nextPost ? (
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/posts/${seriesInfo.nextPost.id}`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={handleBackToTop}>
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
