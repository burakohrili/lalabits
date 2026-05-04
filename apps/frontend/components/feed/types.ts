export interface FeedPostAttachment {
  id: string;
  original_filename: string;
  file_size_bytes: string;
  content_type: string;
  is_downloadable: boolean;
}

export interface FeedPost {
  id: string;
  title: string;
  access_level: string;
  locked: boolean;
  teaser: string | null;
  content?: string | null;
  cover_image_url?: string | null;
  published_at: string | null;
  creator_username: string;
  creator_display_name: string;
  creator_avatar_url: string | null;
  attachments?: FeedPostAttachment[];
}

export interface CreatorGroup {
  creator: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
  posts: FeedPost[];
}
