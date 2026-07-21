export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  followed?: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  category: string;
  readTime: string;
  author: Author;
  date: string;
  imageUrl: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isLatest?: boolean;
  aiSummary?: string;
  likes: number;
  commentsCount: number;
  commentsList: Comment[];
  hasLiked?: boolean;
  hasSaved?: boolean;
  hasRead?: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  tags: string[];
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'achievement';
}
