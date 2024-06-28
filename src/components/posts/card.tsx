import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CalendarIcon, EyeIcon, HeartIcon, ArrowRightIcon } from "lucide-react";
import CategoryBadge from "../badges/category";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    categoryId: number;
    seriesId: number | null;
    orderInSeries: number | null;
    category?: {
      id: number;
      name: string;
    };
    series?: {
      id: number;
      name: string;
    };
    imageUrl?: string;
    views?: number;
    likes?: number;
  };
  imagePosition?: "left" | "right";
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  imagePosition = "left",
}) => {
  const imageUrl = post.imageUrl || "/images/moebius_1.jpg";
  const isImageLeft = imagePosition === "left";

  return (
    <Card
      className={`flex overflow-hidden w-full max-w-[800px] h-[200px] ${isImageLeft ? "flex-row" : "flex-row-reverse"}`}
    >
      <div
        className={`relative w-1/3 ${isImageLeft ? "rounded-l-xl" : "rounded-r-xl"} overflow-hidden`}
      >
        <div className="absolute inset-0 group">
          <Image
            src={imageUrl}
            alt="Blog Post Image"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
      <div
        className={`w-2/3 p-6 flex flex-col justify-between items-start text-left`}
      >
        <div className="w-full">
          <h3 className="text-xl font-bold line-clamp-2">
            <Link href={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground my-2">
            <span className="flex items-center gap-1 ">
              <CalendarIcon className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {"|"}
            <span className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              {post.views || 0} views
            </span>
            {"|"}
            <span className="flex items-center gap-1">
              <HeartIcon className="w-4 h-4" />
              {post.likes || 0} likes
            </span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {post.content}
          </p>
        </div>
        <div
          className={`flex flex-row items-center w-full justify-between ${isImageLeft ? "flex-row-reverse" : "flex-row"}`}
        >
          <CategoryBadge name={post.category?.name || "Uncategorized"} />
          <Link
            href={`/posts/${post.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Read More
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;