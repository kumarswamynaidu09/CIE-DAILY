import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Share2,
  Home as HomeIcon,
  Compass,
  PenTool,
  Bell,
  User,
  Check,
  X,
  MoreVertical,
  Cpu,
  Brain,
  Shield,
  Rocket,
  Lightbulb,
  TrendingUp,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  BookOpen,
  Mail,
  Lock,
  LogIn,
  LogOut,
  Clock
} from "lucide-react";
import { Article, Author, AlertNotification, Comment } from "./types";
import { supabase } from "../utils/supabase";

export default function App() {
  // Navigation State
  const [view, setView] = useState<"login" | "signup" | "splash" | "home" | "article-detail" | "explore" | "write" | "alerts" | "console" | "bookmarks">("login");

  // Auth Form States
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authName, setAuthName] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");


  // CIE Daily Timing State
  const [dailyTiming, setDailyTiming] = useState<string>(() => {
    return localStorage.getItem("cie_daily_timing") || "08:30 AM";
  });
  const [dailyTimingEnabled, setDailyTimingEnabled] = useState<boolean>(() => {
    return localStorage.getItem("cie_daily_timing_enabled") === "true";
  });
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  // Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [pendingArticles, setPendingArticles] = useState<Article[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Interaction States
  const [activeCategory, setActiveCategory] = useState<string>("Technology");
  const [searchQuery, setSearchQuery] = useState<string>("Explore");
  const [searchText, setSearchText] = useState<string>("");
  const [currentConsoleTab, setCurrentConsoleTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [commentText, setCommentText] = useState<string>("");
  const [showCommentDrawer, setShowCommentDrawer] = useState<boolean>(false);

  // Write Form States
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("Technology");
  const [newReadTime, setNewReadTime] = useState<string>("5 min read");
  const [newAuthorName, setNewAuthorName] = useState<string>("");
  const [newAuthorRole, setNewAuthorRole] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newTags, setNewTags] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generatedSummary, setGeneratedSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customSummary, setCustomSummary] = useState<string>("");
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [newCoverPreview, setNewCoverPreview] = useState<string>("");

  // Splash Screen loading bar micro-interaction
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // Toast notifications for user actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic scroll progress state for article reading
  const [articleScrollProgress, setArticleScrollProgress] = useState<number>(0);

  // Reader Profile States
  const [profileName, setProfileName] = useState<string>(() => {
    return localStorage.getItem("cie_profile_name") || "Kumarswamy Naidu";
  });
  const [profileBio, setProfileBio] = useState<string>(() => {
    return localStorage.getItem("cie_profile_bio") || "Exploring the frontiers of technology, design, and intelligence. Passionate about AI ethics, Startup building, and Design systems.";
  });
  const [profileAvatar, setProfileAvatar] = useState<string>(() => {
    return localStorage.getItem("cie_profile_avatar") || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256";
  });
  const [profileRole, setProfileRole] = useState<string>(() => {
    return localStorage.getItem("cie_profile_role") || "Avid Reader";
  });
  const [profileStreak, setProfileStreak] = useState<number>(() => {
    const saved = localStorage.getItem("cie_profile_streak");
    return saved ? parseInt(saved, 10) : 12;
  });
  const [profileInterests, setProfileInterests] = useState<string[]>(() => {
    const saved = localStorage.getItem("cie_profile_interests");
    return saved ? JSON.parse(saved) : ["Technology", "AI", "Innovation"];
  });
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [currentProfileTab, setCurrentProfileTab] = useState<"history" | "bookmarks" | "submissions" | "preferences">("history");

  // Temporary inputs for editing profile
  const [tempName, setTempName] = useState<string>(profileName);
  const [tempBio, setTempBio] = useState<string>(profileBio);
  const [tempAvatar, setTempAvatar] = useState<string>(profileAvatar);
  const [tempRole, setTempRole] = useState<string>(profileRole);
  const [tempStreak, setTempStreak] = useState<number>(profileStreak);
  const [tempAvatarFile, setTempAvatarFile] = useState<File | null>(null);

  const saveProfileChanges = async () => {
    if (!tempName.trim()) {
      triggerToast("Name cannot be empty!");
      return;
    }

    let finalAvatarUrl = tempAvatar;

    if (tempAvatarFile) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const fileExt = tempAvatarFile.name.split('.').pop();
          const fileName = `${user.id}-${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('cie-media')
            .upload(`avatars/${fileName}`, tempAvatarFile);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('cie-media')
            .getPublicUrl(`avatars/${fileName}`);
            
          finalAvatarUrl = publicUrl;
        }
      } catch (err) {
        console.error("Avatar upload failed:", err);
        triggerToast("Avatar upload failed, using previous.");
      }
    }

    try {
       const { data: { user } } = await supabase.auth.getUser();
       if (user) {
          await supabase.from('profiles').update({
             name: tempName,
             bio: tempBio,
             avatar: finalAvatarUrl,
             role: tempRole
          }).eq('id', user.id);
       }
    } catch (err) {
       console.error("Profile update failed", err);
    }

    setProfileName(tempName);
    setProfileBio(tempBio);
    setProfileAvatar(finalAvatarUrl);
    setProfileRole(tempRole);
    setProfileStreak(tempStreak);

    localStorage.setItem("cie_profile_name", tempName);
    localStorage.setItem("cie_profile_bio", tempBio);
    localStorage.setItem("cie_profile_avatar", finalAvatarUrl);
    localStorage.setItem("cie_profile_role", tempRole);
    localStorage.setItem("cie_profile_streak", tempStreak.toString());

    setIsEditingProfile(false);
    setTempAvatarFile(null);
    triggerToast("Reader profile updated successfully!");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Auth Submit Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError("Please fill in all fields");
      return;
    }
    setAuthError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });
      if (error) throw error;
      // onAuthStateChange will handle the redirect
    } catch (err: any) {
      setAuthError(err.message || "Failed to log in.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
      setAuthError("Please fill in all fields");
      return;
    }
    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }
    setAuthError("");
    try {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: {
          data: { full_name: authName },
          emailRedirectTo: `${window.location.origin}/`,
        }
      });
      if (error) throw error;
      // If email confirmation is required, session will be null
      if (data.session === null) {
        setAuthError("");
        triggerToast(`Confirmation email sent to ${authEmail}. Please check your inbox!`);
        setView("login");
      } else {
        // Auto-confirmed (email confirmations disabled in Supabase)
        // onAuthStateChange will handle navigation
        triggerToast("Account created! Setting up your profile...");
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to sign up.");
    }
  };

  const handleGoogleAuth = async (mode: "login" | "signup") => {
    setAuthError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google auth error", err);
      setAuthError(err.message || "Failed to authenticate with Google");
    }
  };

  // 1. Fetch initial dataset from the full-stack server
  const fetchData = async () => {
    try {
      const { data: articlesData } = await supabase
        .from('articles')
        .select(`*, author:profiles(id, name, role, avatar, bio), commentsList:comments(id, text, timestamp:created_at, author:profiles(id, name, avatar))`)
        .order('created_at', { ascending: false });

      if (articlesData) {
        const mappedArticles = articlesData.map((row: any) => ({
          ...row,
          author: row.author || { id: 'unknown', name: 'Unknown', role: 'Guest', avatar: '' },
          date: row.date || new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          imageUrl: row.image_url,
          readTime: row.read_time,
          aiSummary: row.ai_summary,
          rejectionReason: row.rejection_reason,
          likes: row.likes_count || 0,
          commentsCount: row.commentsList?.length || 0,
          commentsList: (row.commentsList || []).map((c: any) => ({
             id: c.id,
             text: c.text,
             timestamp: new Date(c.timestamp).toLocaleString(),
             authorName: c.author?.name || 'Unknown',
             authorAvatar: c.author?.avatar || ''
          }))
        }));

        setArticles(mappedArticles.filter(a => a.status === 'approved'));
        setPendingArticles(mappedArticles.filter(a => a.status === 'pending' || a.status === 'rejected'));
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: alertsData } = await supabase
          .from('alerts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (alertsData) {
          setAlerts(alertsData.map(a => ({ ...a, timestamp: new Date(a.created_at).toLocaleString() })));
        }
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        (payload) => fetchData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        (payload) => fetchData()
      )
      .subscribe();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("cie_is_authenticated");
        setView("login");
        return;
      }

      if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
        const isGoogle = session.user.app_metadata.provider === "google";
        // A new signup has identities with a created_at very close to now
        const isNewUser = session.user.identities?.[0]?.created_at === session.user.created_at;
        const alreadyOnboarded = localStorage.getItem("cie_is_authenticated");

        localStorage.setItem("cie_is_authenticated", "true");

        if (isGoogle) {
          const name = session.user.user_metadata.full_name || "";
          const avatar = session.user.user_metadata.avatar_url || "";
          setProfileName(name);
          setProfileAvatar(avatar);
          localStorage.setItem("cie_profile_name", name);
          localStorage.setItem("cie_profile_avatar", avatar);
          triggerToast(`Welcome${isNewUser ? "" : " back"}, ${name}!`);
          setView("splash");
        } else if (isNewUser && !alreadyOnboarded) {
          // Brand new email signup — send to profile setup
          setProfileName(session.user.user_metadata.full_name || "");
          setProfileBio("");
          setProfileAvatar("");
          setProfileRole("");
          setProfileStreak(0);
          localStorage.setItem("cie_profile_name", session.user.user_metadata.full_name || "");
          localStorage.setItem("cie_profile_bio", "");
          localStorage.setItem("cie_profile_avatar", "");
          localStorage.setItem("cie_profile_role", "");
          localStorage.setItem("cie_profile_streak", "0");
          triggerToast("Welcome! Please set up your profile.");
          setIsEditingProfile(true);
          setView("console");
        } else {
          // Returning email user
          triggerToast("Welcome back!");
          setView((prev) => (prev === "login" || prev === "signup" ? "home" : prev));
        }

        fetchData();
      }
    });

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Splash Screen timer simulation
  useEffect(() => {
    if (view === "splash") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setView("home");
            }, 300);
            return 100;
          }
          return prev + 4;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [view]);

  // 2b. Scroll Progress and View Transition Management
  useEffect(() => {
    if (view === "article-detail") {
      window.scrollTo(0, 0);
      setArticleScrollProgress(0);
    }
  }, [view, selectedArticle]);

  useEffect(() => {
    const handleScroll = () => {
      if (view === "article-detail") {
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const totalHeight = docHeight - winHeight;
        if (totalHeight > 0) {
          const progress = (window.scrollY / totalHeight) * 100;
          setArticleScrollProgress(Math.min(100, Math.max(0, progress)));
        } else {
          setArticleScrollProgress(100);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [view, selectedArticle]);

  // 3. Form Submission
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      triggerToast("Please provide a title and content.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to submit.");

      let finalImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOo8xVipyZkefG3ArvV-wZ8z0NnhWaxuxvhCEWyfCxZkcvpBVw2Bp0oyYwJwwDmZ4O76pnmY6PLP_wu7LENlitAFkUsjvA50SQ3GXZdxX2uzvlZSogTX-iXdDXJxhm9zIhbVv5H9Mpr-rBC96HKoFQLQa6PCU8hoUmbRjSF9foRevZ2Rd365PmNyuNAtJUMtxePU8ZLPXunSjbKZwNw8upsVhFJPIkJebyrP7c3IXzlg3338QnVJx2qAzKvAd-i3Eq_lgBqkndLkU';
      if (newCoverFile) {
        try {
          const fileExt = newCoverFile.name.split('.').pop();
          const fileName = `covers/${user.id}-${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('cie-media')
            .upload(fileName, newCoverFile);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage
            .from('cie-media')
            .getPublicUrl(fileName);
          finalImageUrl = publicUrl;
        } catch (err) {
          console.error("Cover upload failed", err);
          triggerToast("Cover upload failed, using default.");
        }
      }

      const payload = {
        author_id: user.id,
        title: newTitle,
        category: newCategory,
        read_time: newReadTime,
        content: newContent,
        tags: newTags ? newTags.split(",").map((t) => t.trim()) : [newCategory],
        ai_summary: customSummary || generatedSummary,
        status: 'pending',
        image_url: finalImageUrl,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      };

      const { error } = await supabase.from('articles').insert([payload]);
      if (error) throw error;
      
      triggerToast("Draft submitted to Editorial Review console!");
      
      // Clear fields
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      setNewAuthorName("");
      setNewAuthorRole("");
      setGeneratedSummary("");
      setCustomSummary("");
      setNewCoverFile(null);
      setNewCoverPreview("");

      // Refresh and route to console
      await fetchData();
      setView("console");
    } catch (err) {
      console.error(err);
      triggerToast("Error submitting to Supabase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Generate AI Summary using Gemini API Route
  const handleGenerateAiSummary = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      triggerToast("Add title and content before generating summary.");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedSummary(data.summary);
        triggerToast("AI Summary synthesized successfully!");
      } else {
        triggerToast("AI generation failed.");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Failed to connect to Gemini API.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 5. Approve, Reject, Like, Save, or Comment on Server
  const handleArticleAction = async (articleId: string, action: string, extra: any = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && action !== "read") {
        triggerToast("Please log in to perform this action.");
        return;
      }

      if (action === "approve") {
        await supabase.from('articles').update({ status: 'approved' }).eq('id', articleId);
        triggerToast("Article published to live feed!");
        fetchData();
      } else if (action === "reject") {
        await supabase.from('articles').update({ 
          status: 'rejected',
          rejection_reason: extra.rejectionReason || "Does not meet guidelines."
        }).eq('id', articleId);
        triggerToast("Draft rejected.");
        fetchData();
      } else if (action === "like") {
        const { data: existingLike } = await supabase.from('article_likes').select('id').eq('article_id', articleId).eq('user_id', user.id).maybeSingle();
        if (existingLike) {
          await supabase.from('article_likes').delete().eq('id', existingLike.id);
          triggerToast("Removed like");
        } else {
          await supabase.from('article_likes').insert({ article_id: articleId, user_id: user.id });
          triggerToast("Liked!");
        }
        fetchData();
      } else if (action === "save") {
        const { data: existingBookmark } = await supabase.from('bookmarks').select('id').eq('article_id', articleId).eq('user_id', user.id).maybeSingle();
        if (existingBookmark) {
          await supabase.from('bookmarks').delete().eq('id', existingBookmark.id);
          triggerToast("Removed from bookmarks");
        } else {
          await supabase.from('bookmarks').insert({ article_id: articleId, user_id: user.id });
          triggerToast("Saved to your bookmarks");
        }
        fetchData();
      } else if (action === "read") {
        setArticles((prev) =>
          prev.map((a) => (a.id === articleId ? { ...a, hasRead: !a.hasRead } : a))
        );
        if (selectedArticle && selectedArticle.id === articleId) {
          setSelectedArticle((prev) => prev ? { ...prev, hasRead: !prev.hasRead } : null);
        }
      } else if (action === "comment") {
        await supabase.from('comments').insert({
          article_id: articleId,
          author_id: user.id,
          text: extra.text
        });
        setCommentText("");
        triggerToast("Comment added!");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      triggerToast("Action failed.");
    }
  };

  const markAlertsAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('alerts').update({ read: true }).eq('user_id', user.id);
        setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper filters
  const filteredArticles = articles.filter((a) => {
    if (activeCategory === "All") return true;
    return a.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase());
  });

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const trendingArticles = articles.filter((a) => a.isTrending);
  const latestArticles = articles.filter((a) => a.isLatest);

  return (
    <div className="relative min-h-screen bg-[#fff8f6] font-sans text-brand-on-surface pb-24 overflow-x-hidden selection:bg-brand-primary-container selection:text-white">

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-brand-primary text-white px-5 py-3 rounded-full shadow-lg font-headline text-sm font-semibold flex items-center gap-2"
          >
            <Sparkles size={16} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Render Switch */}
      <AnimatePresence mode="wait">

        {/* VIEW: LOGIN */}
        {view === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 bg-[#fff8f6] flex flex-col items-center justify-center p-6 z-[95] overflow-y-auto"
          >
            <div className="w-full max-w-md bg-white border border-brand-outline-variant/30 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary to-orange-400" />

              {/* Brand Logo & Title */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-3.5 rotate-12">
                  <BookOpen className="text-white" size={26} />
                </div>
                <h2 className="font-headline text-2xl font-extrabold text-brand-on-surface">CIE Daily</h2>
                <p className="font-sans text-xs text-brand-secondary mt-1">Sign in to read, learn, build, and inspire.</p>
              </div>

              {/* Error Alert */}
              {authError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 font-medium">
                  {authError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-brand-secondary uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 text-brand-outline" size={16} />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 bg-brand-surface-container-low border border-brand-outline-variant/30 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary transition-colors text-brand-on-surface"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-brand-secondary uppercase tracking-wider">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 text-brand-outline" size={16} />
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 bg-brand-surface-container-low border border-brand-outline-variant/30 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary transition-colors text-brand-on-surface"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-brand-primary text-white font-headline font-bold text-sm rounded-xl hover:opacity-95 shadow-md shadow-orange-500/10 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <LogIn size={16} />
                  Sign In
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <hr className="border-brand-outline-variant/30" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-white text-[11px] font-bold text-brand-secondary uppercase tracking-widest">
                  or
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleGoogleAuth("login")}
                className="w-full h-11 border border-brand-outline-variant/40 hover:bg-brand-surface-container-low text-brand-on-surface font-headline font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2.5"
              >
                {/* Custom Google Vector Logo */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.5 5.5 0 0 1 8.5 13a5.5 5.5 0 0 1 5.491-5.514c2.256 0 3.911.954 4.88 1.914l3.223-3.223C20.142 4.29 17.228 3 14 3 8.477 3 4 7.477 4 13s4.477 10 10 10c5.5 0 9.5-3.87 9.5-9.5 0-.648-.05-1.125-.15-1.5-.7-.015-11.11-.215-11.11-.215z" />
                </svg>
                Continue with Google
              </button>

              {/* Footer Switch */}
              <p className="text-center text-xs text-brand-secondary mt-6 font-sans">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setAuthError(""); setView("signup"); }}
                  className="text-brand-primary font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* VIEW: SIGNUP */}
        {view === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 bg-[#fff8f6] flex flex-col items-center justify-center p-6 z-[95] overflow-y-auto"
          >
            <div className="w-full max-w-md bg-white border border-brand-outline-variant/30 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary to-orange-400" />

              {/* Brand Logo & Title */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-3.5 rotate-12">
                  <BookOpen className="text-white" size={26} />
                </div>
                <h2 className="font-headline text-2xl font-extrabold text-brand-on-surface">Create Account</h2>
                <p className="font-sans text-xs text-brand-secondary mt-1">Join the community of readers and creators.</p>
              </div>

              {/* Error Alert */}
              {authError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 font-medium">
                  {authError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-brand-secondary uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 text-brand-outline" size={16} />
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Kumarswamy Naidu"
                      className="w-full h-11 bg-brand-surface-container-low border border-brand-outline-variant/30 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary transition-colors text-brand-on-surface"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-secondary uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 text-brand-outline" size={16} />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 bg-brand-surface-container-low border border-brand-outline-variant/30 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary transition-colors text-brand-on-surface"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-secondary uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 text-brand-outline" size={16} />
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 bg-brand-surface-container-low border border-brand-outline-variant/30 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary transition-colors text-brand-on-surface"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-brand-primary text-white font-headline font-bold text-sm rounded-xl hover:opacity-95 shadow-md shadow-orange-500/10 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <User size={16} />
                  Sign Up
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <hr className="border-brand-outline-variant/30" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-white text-[11px] font-bold text-brand-secondary uppercase tracking-widest">
                  or
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleGoogleAuth("signup")}
                className="w-full h-11 border border-brand-outline-variant/40 hover:bg-brand-surface-container-low text-brand-on-surface font-headline font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2.5"
              >
                {/* Custom Google Vector Logo */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.5 5.5 0 0 1 8.5 13a5.5 5.5 0 0 1 5.491-5.514c2.256 0 3.911.954 4.88 1.914l3.223-3.223C20.142 4.29 17.228 3 14 3 8.477 3 4 7.477 4 13s4.477 10 10 10c5.5 0 9.5-3.87 9.5-9.5 0-.648-.05-1.125-.15-1.5-.7-.015-11.11-.215-11.11-.215z" />
                </svg>
                Sign Up with Google
              </button>

              {/* Footer Switch */}
              <p className="text-center text-xs text-brand-secondary mt-6 font-sans">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setAuthError(""); setView("login"); }}
                  className="text-brand-primary font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* VIEW 1: SPLASH SCREEN */}
        {view === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#fff8f6] flex flex-col items-center justify-center p-6 z-[90]"
          >
            <main className="relative flex flex-col items-center justify-center w-full max-w-lg text-center">
              {/* Minimalist Logo Mark */}
              <div className="mb-8 animate-scale-in">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 border-[1.5px] border-brand-outline-variant rounded-2xl rotate-12 transition-transform hover:rotate-45 duration-700"></div>
                  <div className="w-14 h-14 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <BookOpen className="text-white" size={30} />
                  </div>
                </div>
              </div>

              {/* Brand Identity */}
              <div className="space-y-2 animate-fade-in">
                <h1 className="font-headline text-4xl font-extrabold text-brand-on-surface tracking-tight">
                  CIE Daily
                </h1>
                <p className="font-sans text-xs font-semibold text-brand-secondary uppercase tracking-[0.25em] pt-2">
                  Read. Learn. Build. Inspire.
                </p>
              </div>

              {/* Atmospheric Loading bar */}
              <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-brand-outline-variant/30 overflow-hidden rounded-full">
                <div
                  className="h-full bg-brand-primary-container transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </main>

            {/* Subtle atmospheric blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-surface-container-high/20 rounded-full blur-[100px]"></div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: HOME SCREEN */}
        {view === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-screen-md mx-auto px-6 pt-20"
          >
            {/* Top AppBar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f6]/95 backdrop-blur-md border-b border-brand-outline-variant/30 flex justify-between items-center px-6 h-16 max-w-screen-md mx-auto">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => {
                    setTempName(profileName);
                    setTempBio(profileBio);
                    setTempAvatar(profileAvatar);
                    setTempRole(profileRole);
                    setTempStreak(profileStreak);
                    setView("console");
                  }}
                  className="w-9 h-9 rounded-full bg-brand-surface-container-high overflow-hidden border border-brand-outline-variant/40 cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all"
                >
                  <img
                    className="w-full h-full object-cover"
                    src={profileAvatar}
                    alt="avatar"
                  />
                </div>
                <h1 className="font-headline text-xl font-bold text-brand-primary">CIE Daily</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setView("explore"); setSearchText(""); }}
                  className="p-2 hover:bg-brand-surface-container-low rounded-full transition-colors"
                >
                  <Search size={20} className="text-brand-primary" />
                </button>
              </div>
            </header>

            {/* Greeting */}
            <section className="mt-6 mb-8">
              <p className="font-headline text-xs font-semibold text-brand-secondary tracking-wider uppercase">Welcome Back</p>
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-brand-on-surface leading-tight mt-1">
                Good Morning, {profileName.split(" ")[0]}
              </h2>
            </section>

            {/* Category Chips Horizontal Nav */}
            <nav className="flex gap-2 overflow-x-auto no-scrollbar mb-8 -mx-6 px-6">
              {["Technology", "AI", "Startups", "Innovation", "Design", "All"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full font-headline text-xs font-bold transition-all duration-200 ${activeCategory === cat
                    ? "bg-brand-primary text-white shadow-md shadow-orange-500/10"
                    : "bg-brand-surface-container-low text-brand-on-surface hover:bg-brand-surface-container"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* Featured Story */}
            {featuredArticle && (
              <section className="mb-8">
                <div
                  onClick={() => { setSelectedArticle(featuredArticle); setView("article-detail"); }}
                  className="group bg-brand-surface-container-lowest border border-brand-outline-variant/30 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-primary/40 transition-all shadow-sm"
                >
                  <div className="aspect-video relative overflow-hidden bg-brand-surface-container">
                    <img
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      src={featuredArticle.imageUrl}
                      alt="Featured"
                    />
                    <div className="absolute top-4 left-4 bg-brand-primary px-3 py-1.5 rounded-full">
                      <span className="font-sans text-[10px] text-white uppercase font-bold tracking-widest">Featured</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="font-headline text-[10px] text-brand-primary-container font-bold uppercase tracking-wider mb-2 block">{featuredArticle.category}</span>
                    <h3 className="font-headline text-xl font-bold text-brand-on-surface mb-3 group-hover:text-brand-primary transition-colors leading-snug">
                      {featuredArticle.title}
                    </h3>
                    <p className="font-sans text-sm text-brand-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                      {featuredArticle.content}
                    </p>

                    {/* Post Actions Footer */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex justify-between items-center border-t border-brand-outline-variant/20 pt-3.5"
                    >
                      <div className="flex items-center gap-1.5 text-[11px] text-brand-secondary">
                        <span className="font-headline font-semibold text-brand-on-surface-variant">Uploaded:</span>
                        <span>{featuredArticle.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArticleAction(featuredArticle.id, "save");
                          }}
                          className="p-1.5 hover:bg-brand-surface-container rounded-full transition-colors text-brand-secondary hover:text-brand-primary"
                          title={featuredArticle.hasSaved ? "Remove from Bookmarks" : "Save to Bookmarks"}
                        >
                          <Bookmark size={18} className={featuredArticle.hasSaved ? "fill-brand-primary text-brand-primary" : ""} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerToast("Link copied to clipboard!");
                          }}
                          className="p-1.5 hover:bg-brand-surface-container rounded-full transition-colors text-brand-secondary hover:text-brand-primary"
                          title="Share Article"
                        >
                          <Share2 size={18} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArticleAction(featuredArticle.id, "read");
                            triggerToast(featuredArticle.hasRead ? "Marked as Unread" : "Marked as Read!");
                          }}
                          className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${featuredArticle.hasRead
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "hover:bg-brand-surface-container text-brand-secondary hover:text-brand-primary"
                            }`}
                          title={featuredArticle.hasRead ? "Mark as Unread" : "Mark as Read"}
                        >
                          <Check size={18} className={featuredArticle.hasRead ? "stroke-[2.5px]" : ""} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Trending Section */}
            <section className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <h4 className="font-headline text-lg font-bold text-brand-on-surface">Trending</h4>
                <button onClick={() => setView("explore")} className="font-headline text-xs font-bold text-brand-primary hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {trendingArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => { setSelectedArticle(art); setView("article-detail"); }}
                    className="bg-brand-surface-container-lowest border border-brand-outline-variant/30 rounded-2xl p-5 flex gap-4 items-start cursor-pointer hover:border-brand-primary/30 transition-all shadow-sm"
                  >
                    <div className="flex-1">
                      <span className="font-headline text-[10px] text-brand-primary-container uppercase font-bold mb-1.5 block">{art.category}</span>
                      <h5 className="font-headline text-base font-bold text-brand-on-surface mb-2 group-hover:text-brand-primary line-clamp-2 leading-snug">{art.title}</h5>
                      <div className="flex items-center gap-2 text-brand-secondary font-headline text-xs">
                        <span className="font-semibold text-brand-on-surface-variant">{art.author.name}</span>
                        <span className="w-1 h-1 bg-brand-outline rounded-full"></span>
                        <span>{art.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Latest Articles */}
            <section className="mb-12">
              <h4 className="font-headline text-lg font-bold text-brand-on-surface mb-4">Latest Articles</h4>
              <div className="grid grid-cols-1 gap-6">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    onClick={() => { setSelectedArticle(art); setView("article-detail"); }}
                    className="bg-brand-surface-container-lowest border border-brand-outline-variant/30 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-primary/30 transition-all shadow-sm group"
                  >
                    <div className="h-48 overflow-hidden bg-brand-surface-container">
                      <img
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        src={art.imageUrl}
                        alt={art.title}
                      />
                    </div>
                    <div className="p-6">
                      <span className="font-headline text-[10px] text-brand-primary-container font-bold uppercase mb-2 block">{art.category}</span>
                      <h5 className="font-headline text-lg font-bold text-brand-on-surface mb-3 group-hover:text-brand-primary transition-colors leading-snug">{art.title}</h5>
                      <p className="font-sans text-sm text-brand-on-surface-variant mb-4 line-clamp-2 leading-relaxed">{art.content}</p>

                      <div className="flex justify-between items-center border-t border-brand-outline-variant/20 pt-4">
                        <div className="flex items-center gap-2">
                          <img className="w-6 h-6 rounded-full object-cover border border-brand-outline-variant/30" src={art.author.avatar} alt={art.author.name} />
                          <span className="font-headline text-xs font-semibold text-brand-on-surface-variant">{art.author.name}</span>
                        </div>
                        <span className="font-sans text-xs text-brand-secondary">{art.readTime}</span>
                      </div>

                      {/* Post Actions Footer */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex justify-between items-center border-t border-brand-outline-variant/20 pt-3.5 mt-3.5"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-brand-secondary">
                          <span className="font-headline font-semibold text-brand-on-surface-variant">Uploaded:</span>
                          <span>{art.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArticleAction(art.id, "save");
                            }}
                            className="p-1.5 hover:bg-brand-surface-container rounded-full transition-colors text-brand-secondary hover:text-brand-primary"
                            title={art.hasSaved ? "Remove from Bookmarks" : "Save to Bookmarks"}
                          >
                            <Bookmark size={18} className={art.hasSaved ? "fill-brand-primary text-brand-primary" : ""} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerToast("Link copied to clipboard!");
                            }}
                            className="p-1.5 hover:bg-brand-surface-container rounded-full transition-colors text-brand-secondary hover:text-brand-primary"
                            title="Share Article"
                          >
                            <Share2 size={18} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArticleAction(art.id, "read");
                              triggerToast(art.hasRead ? "Marked as Unread" : "Marked as Read!");
                            }}
                            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${art.hasRead
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              : "hover:bg-brand-surface-container text-brand-secondary hover:text-brand-primary"
                              }`}
                            title={art.hasRead ? "Mark as Unread" : "Mark as Read"}
                          >
                            <Check size={18} className={art.hasRead ? "stroke-[2.5px]" : ""} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* VIEW 3: ARTICLE DETAIL VIEW */}
        {view === "article-detail" && selectedArticle && (
          <motion.div
            key="article-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-screen-md mx-auto px-6 pt-20"
          >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f6]/95 backdrop-blur-md border-b border-brand-outline-variant/30 flex justify-between items-center px-6 h-16 max-w-screen-md mx-auto">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView("home")}
                  className="p-2 hover:bg-brand-surface-container-low rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-brand-primary" />
                </button>
                <span className="font-headline text-lg font-bold text-brand-primary">CIE Daily</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-outline-variant/40">
                  <img className="w-full h-full object-cover" src={selectedArticle.author.avatar} alt="Author" />
                </div>
              </div>
              {/* Reading Progress Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-outline-variant/20">
                <div
                  className="h-full bg-brand-primary transition-all duration-75"
                  style={{ width: `${articleScrollProgress}%` }}
                />
              </div>
            </header>

            <article className="py-6">
              {/* Category */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-brand-primary text-white rounded-full font-headline text-[10px] font-bold uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-brand-on-surface leading-tight mb-6">
                {selectedArticle.title}
              </h1>

              {/* Author Info Block */}
              <div className="flex items-center justify-between mb-8 border-b border-brand-outline-variant/20 pb-6">
                <div className="flex items-center gap-3">
                  <img className="w-10 h-10 rounded-full object-cover border border-brand-outline-variant/30" src={selectedArticle.author.avatar} alt="Avatar" />
                  <div>
                    <p className="font-headline text-sm font-bold text-brand-on-surface">{selectedArticle.author.name}</p>
                    <p className="font-sans text-[11px] text-brand-secondary">{selectedArticle.author.role} • {selectedArticle.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleArticleAction(selectedArticle.id, "save")}
                    className="p-2 hover:bg-brand-surface-container rounded-full transition-colors text-brand-secondary"
                  >
                    <Bookmark size={20} className={selectedArticle.hasSaved ? "fill-brand-primary text-brand-primary" : ""} />
                  </button>
                  <button
                    onClick={() => triggerToast("Link copied to clipboard!")}
                    className="p-2 hover:bg-brand-surface-container rounded-full transition-colors text-brand-secondary"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="w-full h-64 md:h-96 bg-brand-surface-container rounded-2xl mb-8 overflow-hidden border border-brand-outline-variant/20">
                <img className="w-full h-full object-cover" src={selectedArticle.imageUrl} alt="Hero" />
              </div>



              {/* Body Content */}
              <div className="font-sans text-base text-brand-on-surface leading-relaxed space-y-6">
                {selectedArticle.content.split("\n\n").map((para, i) => {
                  if (para.startsWith(">")) {
                    return (
                      <blockquote key={i} className="border-l-4 border-brand-outline pl-5 italic my-6 py-1">
                        <p className="font-headline text-lg text-brand-on-surface-variant font-medium leading-normal">
                          {para.replace(/^>\s*/, "").replace(/"/g, "")}
                        </p>
                      </blockquote>
                    );
                  }
                  if (para.startsWith("###")) {
                    return (
                      <h3 key={i} className="font-headline text-xl font-bold text-brand-primary pt-4 pb-1">
                        {para.replace(/^###\s*/, "")}
                      </h3>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2 border-t border-brand-outline-variant/20 pt-6">
                {selectedArticle.tags?.map((tag) => (
                  <span key={tag} className="px-3.5 py-1.5 bg-brand-surface-container text-brand-secondary font-headline text-xs font-bold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Bottom Actions Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#fff8f6]/95 backdrop-blur-md border-t border-brand-outline-variant/30 py-3.5 px-6 max-w-screen-md mx-auto flex justify-around items-center">
              <button
                onClick={() => handleArticleAction(selectedArticle.id, "like")}
                className={`flex flex-col items-center gap-1 text-xs font-headline font-bold transition-transform active:scale-95 ${selectedArticle.hasLiked ? "text-brand-primary" : "text-brand-secondary"
                  }`}
              >
                <ThumbsUp size={20} className={selectedArticle.hasLiked ? "fill-brand-primary text-brand-primary animate-pulse" : ""} />
                <span>{selectedArticle.likes}</span>
              </button>

              <button
                onClick={() => setShowCommentDrawer(!showCommentDrawer)}
                className="flex flex-col items-center gap-1 text-brand-secondary text-xs font-headline font-bold hover:text-brand-primary transition-colors"
              >
                <MessageSquare size={20} />
                <span>{selectedArticle.commentsCount}</span>
              </button>

              <button
                onClick={() => handleArticleAction(selectedArticle.id, "save")}
                className="flex flex-col items-center gap-1 text-brand-secondary text-xs font-headline font-bold hover:text-brand-primary transition-colors"
              >
                <Bookmark size={20} className={selectedArticle.hasSaved ? "fill-brand-primary text-brand-primary" : ""} />
                <span>{selectedArticle.hasSaved ? "Saved" : "Save"}</span>
              </button>

              <button
                onClick={() => triggerToast("Link copied to clipboard!")}
                className="flex flex-col items-center gap-1 text-brand-secondary text-xs font-headline font-bold hover:text-brand-primary transition-colors"
              >
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Section Drawer / Card (Simulated inline) */}
            <AnimatePresence>
              {showCommentDrawer && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-brand-surface-container-lowest rounded-2xl border border-brand-outline-variant/30 p-6 my-6 shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-headline text-base font-bold text-brand-on-surface">Comments ({selectedArticle.commentsCount})</h4>
                    <button onClick={() => setShowCommentDrawer(false)} className="p-1 hover:bg-brand-surface-container rounded-full">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar mb-4">
                    {selectedArticle.commentsList.length === 0 ? (
                      <p className="text-sm text-brand-secondary italic text-center py-4">No comments yet. Start the conversation!</p>
                    ) : (
                      selectedArticle.commentsList.map((c) => (
                        <div key={c.id} className="flex gap-3 items-start border-b border-brand-outline-variant/10 pb-3">
                          <img className="w-8 h-8 rounded-full object-cover" src={c.authorAvatar} alt="Comment avatar" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-headline text-xs font-bold text-brand-on-surface">{c.authorName}</span>
                              <span className="text-[10px] text-brand-secondary">{c.timestamp}</span>
                            </div>
                            <p className="text-sm text-brand-on-surface-variant leading-relaxed">{c.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add an insightful comment..."
                      className="flex-1 bg-brand-surface-container-low border border-brand-outline-variant/30 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-primary transition-colors"
                    />
                    <button
                      onClick={() => {
                        if (commentText.trim()) {
                          handleArticleAction(selectedArticle.id, "comment", {
                            text: commentText,
                            authorName: profileName,
                            authorAvatar: profileAvatar
                          });
                        }
                      }}
                      className="p-3 bg-brand-primary text-white rounded-xl hover:opacity-95 active:scale-95 transition-all"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* VIEW 4: EXPLORE SCREEN */}
        {view === "explore" && (
          <motion.div
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-screen-md mx-auto px-6 pt-20"
          >
            {/* AppBar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f6]/95 backdrop-blur-md border-b border-brand-outline-variant/30 flex justify-between items-center px-6 h-16 max-w-screen-md mx-auto">
              <h1 className="font-headline text-xl font-bold text-brand-primary">Explore</h1>
              <span className="font-headline text-xs text-brand-secondary font-bold">Discover New Ideas</span>
            </header>

            {/* Search Input Bar */}
            <section className="mb-8 mt-4">
              <div className="relative group">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Explore journals, authors, topics..."
                  className="w-full h-14 bg-brand-surface-container-lowest border border-brand-outline-variant/30 rounded-full pl-12 pr-12 text-sm focus:outline-none focus:border-brand-primary transition-colors placeholder:text-brand-secondary"
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary group-focus-within:text-brand-primary transition-colors" />
                <button
                  onClick={() => triggerToast("Advanced search filters enabled.")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-brand-secondary hover:text-brand-primary transition-colors"
                >
                  <SlidersHorizontal size={20} />
                </button>
              </div>
            </section>

            {/* Search Results / Trending Topics Grid */}
            {searchText ? (
              <section className="mb-12">
                <h3 className="font-headline text-lg font-bold text-brand-on-surface mb-4">Results for "{searchText}"</h3>
                <div className="space-y-4">
                  {articles.filter(a =>
                    a.title.toLowerCase().includes(searchText.toLowerCase()) ||
                    a.content.toLowerCase().includes(searchText.toLowerCase()) ||
                    a.category.toLowerCase().includes(searchText.toLowerCase())
                  ).length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-brand-outline-variant/30">
                      <p className="text-brand-secondary font-headline font-semibold">No direct articles found.</p>
                      <button
                        onClick={() => { setSearchText(""); }}
                        className="mt-4 px-5 py-2.5 bg-brand-primary text-white font-headline text-xs font-bold rounded-full hover:opacity-90"
                      >
                        Reset search
                      </button>
                    </div>
                  ) : (
                    articles.filter(a =>
                      a.title.toLowerCase().includes(searchText.toLowerCase()) ||
                      a.content.toLowerCase().includes(searchText.toLowerCase()) ||
                      a.category.toLowerCase().includes(searchText.toLowerCase())
                    ).map(art => (
                      <div
                        key={art.id}
                        onClick={() => { setSelectedArticle(art); setView("article-detail"); }}
                        className="bg-brand-surface-container-lowest border border-brand-outline-variant/30 rounded-2xl p-5 cursor-pointer hover:border-brand-primary/30 transition-all flex flex-col gap-3"
                      >
                        <div className="flex gap-4 items-start w-full">
                          <div className="flex-1">
                            <span className="font-headline text-[10px] text-brand-primary-container font-bold uppercase mb-1 block">{art.category}</span>
                            <h4 className="font-headline text-base font-bold text-brand-on-surface mb-1 leading-snug">{art.title}</h4>
                            <p className="font-sans text-xs text-brand-secondary line-clamp-1">{art.content}</p>
                          </div>
                        </div>

                        {/* Post Actions Footer */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex justify-between items-center border-t border-brand-outline-variant/20 pt-3 mt-1"
                        >
                          <div className="flex items-center gap-1.5 text-[11px] text-brand-secondary">
                            <span className="font-headline font-semibold text-brand-on-surface-variant">Uploaded:</span>
                            <span>{art.date}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArticleAction(art.id, "save");
                              }}
                              className="p-1.5 hover:bg-brand-surface-container rounded-full transition-colors text-brand-secondary hover:text-brand-primary"
                              title={art.hasSaved ? "Remove from Bookmarks" : "Save to Bookmarks"}
                            >
                              <Bookmark size={18} className={art.hasSaved ? "fill-brand-primary text-brand-primary" : ""} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerToast("Link copied to clipboard!");
                              }}
                              className="p-1.5 hover:bg-brand-surface-container rounded-full transition-colors text-brand-secondary hover:text-brand-primary"
                              title="Share Article"
                            >
                              <Share2 size={18} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArticleAction(art.id, "read");
                                triggerToast(art.hasRead ? "Marked as Unread" : "Marked as Read!");
                              }}
                              className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${art.hasRead
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                : "hover:bg-brand-surface-container text-brand-secondary hover:text-brand-primary"
                                }`}
                              title={art.hasRead ? "Mark as Unread" : "Mark as Read"}
                            >
                              <Check size={18} className={art.hasRead ? "stroke-[2.5px]" : ""} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            ) : (
              <>
                {/* Highlight Spotlight Card */}
                <section className="mb-8">
                  <div className="flex items-end justify-between mb-4">
                    <h2 className="font-headline text-lg font-bold text-brand-on-surface">Trending Topics</h2>
                    <button onClick={() => triggerToast("Showing all topics")} className="font-headline text-xs font-bold text-brand-primary uppercase tracking-widest">View All</button>
                  </div>

                  <div
                    onClick={() => {
                      const atomArticle = articles.find(a => a.id === 'quantum-leap-atoms') || articles[0];
                      setSelectedArticle(atomArticle);
                      setView("article-detail");
                    }}
                    className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden group cursor-pointer border border-brand-outline-variant/30 shadow-md"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                    <img
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiiVuAAtmGfR7HrXdevHmyezSY-jr_zmFqfCSjlWsjky6QFPNHG5En83E_3mFGUFUhJZ6kx9tttEuQC-R-fFwcOGgaYsU986mtzfuyO_t7-IEM5JpIe_dVCyDtQiv41BnfSmsZAeKk0W650sup6yrKtRTLZykHNa1uazNKS10OaGsSEAiJkh-vwcs9Zt8Rx8jM0EfsiBNsl1P78AtIPJGR8Nc_Gts-d79MryRgEo5BcH9lPD6Ed0K1aUlC5p2VZz_qmR69co05OP8"
                      alt="Spotlight"
                    />
                    <div className="absolute bottom-0 left-0 p-5 z-20">
                      <span className="bg-brand-primary text-white text-[9px] font-headline font-bold px-3 py-1 rounded-full mb-3 inline-block tracking-widest">
                        TECH REVOLUTION
                      </span>
                      <h3 className="text-white font-headline text-lg md:text-xl font-extrabold leading-snug mb-1">
                        The Quantum Leap: Why Silicon Valley is Betting on Cold Atoms
                      </h3>
                      <p className="text-white/70 font-sans text-xs">4 min read • By Sarah Jenkins</p>
                    </div>
                  </div>

                  {/* Bento grids */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div
                      onClick={() => triggerToast("Topic: AI Ethics")}
                      className="p-4 bg-brand-surface-container-low rounded-xl border border-brand-outline-variant/30 hover:border-brand-primary transition-all cursor-pointer"
                    >
                      <span className="text-brand-primary font-headline text-2xl font-bold opacity-30 block">01</span>
                      <h4 className="font-headline text-xs font-bold leading-snug text-brand-on-surface mt-1">AI Ethicists in the Age of LLMs</h4>
                    </div>
                    <div
                      onClick={() => triggerToast("Topic: Startup Funding")}
                      className="p-4 bg-brand-surface-container-low rounded-xl border border-brand-outline-variant/30 hover:border-brand-primary transition-all cursor-pointer"
                    >
                      <span className="text-brand-primary font-headline text-2xl font-bold opacity-30 block">02</span>
                      <h4 className="font-headline text-xs font-bold leading-snug text-brand-on-surface mt-1">Bootstrapping vs. VC Burn</h4>
                    </div>
                  </div>
                </section>

                {/* Categories Grid of buttons */}
                <section className="mb-8">
                  <h2 className="font-headline text-lg font-bold text-brand-on-surface mb-4">Categories</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Technology", icon: <Cpu size={16} /> },
                      { label: "AI", icon: <Brain size={16} /> },
                      { label: "Cybersecurity", icon: <Shield size={16} /> },
                      { label: "Startups", icon: <Rocket size={16} /> },
                      { label: "Creativity", icon: <Lightbulb size={16} /> },
                      { label: "Finance", icon: <TrendingUp size={16} /> }
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { setActiveCategory(item.label); setSearchText(item.label); }}
                        className="flex items-center gap-3 p-4 bg-brand-surface-container-lowest border border-brand-outline-variant/30 rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-150 group"
                      >
                        <span className="text-brand-primary group-hover:text-white transition-colors">{item.icon}</span>
                        <span className="font-headline text-xs font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Popular Authors list */}
                <section className="mb-8">
                  <h2 className="font-headline text-lg font-bold text-[#251913] mb-4">Popular Authors</h2>
                  <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2 -mx-6 px-6">
                    {[
                      {
                        name: "Dr. Elena Rossi",
                        role: "AI Specialist",
                        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8EkQIOOcnwe6oqiNacBX7xOvT3ux2A8NA_d7u_VfW_y4XDJZAy5wx90GaW_zDt-Dl7PrWrCccvt-80RU_4EZJjioqZxoChI8WbyO9oSDAWO3Bc-1WMHngPrjcJolhzQscbHmCHYeJ_sm84fMgmFKl1VmAzTsdrmFzlUScDiIjzHR_26hr4dTUkqa0-27PsWKAL6dqsgyxErLKLGHLtj4hMijXB9cGB8p2F4i6cKDglnuskPoxAvytuTMl0MfPf5ysBvWzytdqna4",
                        tagline: '"Bridging the gap between neural networks and human intuition."'
                      },
                      {
                        name: "Marcus Thorne",
                        role: "VC Partner",
                        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuANy8Dl2-nNtcmGPmaV3Kwcw4h3ZL4zUjg947YtaKMs-8G5jaqmMWYl59ITKpLpNNS_0u1_5v9MR6eRCxim7j1pI-bVWIViFBeRgHHd7ktBkUslBPRHw57EWbYnY3cCTwI1zPr_xo8k50_5I32AYD70a0opW8iqDWSQz7E8--NOaWnxFYislAOYFawWE30KMey2xLEjDUU76LWpCQ5AzXDvwOdgOYyfc8J_w2ycqt5PhHArJsY7etrV9t7TdU5SR5s30d76lWZfn58",
                        tagline: '"Analyzing the mechanics of hyper-growth in sustainable tech."'
                      },
                      {
                        name: "Sofia Chen",
                        role: "Tech Journalist",
                        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtF67HBXvmL4_1FCVsbqBlqvuJXCd1vQ9Dflp-IR5Gsog3Tou1iRi8Jq0R0Lz8wvc1MlksW4XBIz-Mpixsz1Dp4_xYIRLHyoMtPEjkaT51oQOSqAp0XxulV-gLZapaCt29hyxLBJEeGOGO47Q7rygPWa3QNsFNfgBt61hPOyNcrnCqIIbe5OJN3QE30idE2Zu3VO0s9g2eWfRIRIoRIXZS0wikNW6trQOXYV5t87njiIV7c1YFePFlKkPtd5hhKp62bkSD1XEa1Ew",
                        tagline: '"Uncovering the stories that shape our digital future."'
                      }
                    ].map((author, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-64 p-5 bg-white border border-brand-outline-variant/30 rounded-2xl shadow-sm hover:border-brand-primary/20 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3.5">
                          <img className="w-11 h-11 rounded-full object-cover" src={author.avatar} alt="Author avatar" />
                          <div>
                            <h4 className="font-headline text-xs font-bold text-brand-on-surface">{author.name}</h4>
                            <p className="font-sans text-[10px] text-brand-secondary">{author.role}</p>
                          </div>
                        </div>
                        <p className="font-sans text-[11px] text-brand-secondary line-clamp-2 leading-relaxed italic mb-4">
                          {author.tagline}
                        </p>
                        <button
                          onClick={() => triggerToast(`Following ${author.name}`)}
                          className="w-full py-2 rounded-xl border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all font-headline text-xs font-bold"
                        >
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* More Articles Section */}
                <section className="mt-8 mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={18} className="text-brand-primary" />
                    <h2 className="font-headline text-lg font-bold text-brand-on-surface">More Articles</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {articles.filter((a) => !a.isLatest).map((art) => (
                      <div
                        key={art.id}
                        onClick={() => { setSelectedArticle(art); setView("article-detail"); }}
                        className="bg-white border border-brand-outline-variant/30 rounded-2xl p-4 flex gap-4 items-center cursor-pointer hover:border-brand-primary/30 hover:-translate-y-0.5 active:scale-[0.99] transition-all shadow-sm"
                      >
                        {art.imageUrl && (
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-surface-container flex-shrink-0">
                            <img className="w-full h-full object-cover" src={art.imageUrl} alt={art.title} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="font-headline text-[9px] text-brand-primary font-bold uppercase tracking-wider mb-1 block">
                            {art.category}
                          </span>
                          <h4 className="font-headline text-xs font-bold text-brand-on-surface mb-1 line-clamp-1 leading-snug">
                            {art.title}
                          </h4>
                          <div className="flex items-center gap-2 text-brand-secondary font-headline text-[10px]">
                            <span className="font-semibold text-brand-on-surface-variant">{art.author.name}</span>
                            <span className="w-0.5 h-0.5 bg-brand-outline rounded-full"></span>
                            <span>{art.readTime}</span>
                          </div>
                        </div>
                        <span className="p-1.5 hover:bg-brand-surface-container rounded-full text-brand-secondary">
                          <ChevronRight size={14} />
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </motion.div>
        )}

        {/* VIEW 5: WRITE NEW ARTICLE */}
        {view === "write" && (
          <motion.div
            key="write"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-screen-md mx-auto px-6 pt-20"
          >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f6]/95 backdrop-blur-md border-b border-brand-outline-variant/30 flex justify-between items-center px-6 h-16 max-w-screen-md mx-auto">
              <h1 className="font-headline text-xl font-bold text-brand-primary">Submit Draft</h1>
              <span className="font-headline text-xs text-brand-secondary">Contributor Workspace</span>
            </header>

            <form onSubmit={handleSubmitArticle} className="space-y-6 mt-4">
              <div>
                <label className="block font-headline text-xs font-bold text-brand-on-surface uppercase mb-2">Article Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Synthesizing Sustainability: Algae-Based Textiles"
                  className="w-full h-12 bg-white border border-brand-outline-variant/30 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-headline text-xs font-bold text-brand-on-surface uppercase mb-2">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-12 bg-white border border-brand-outline-variant/30 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-primary"
                  >
                    <option>Technology</option>
                    <option>AI</option>
                    <option>Startups</option>
                    <option>Innovation</option>
                    <option>Design</option>
                  </select>
                </div>
                <div>
                  <label className="block font-headline text-xs font-bold text-brand-on-surface uppercase mb-2">Reading Time</label>
                  <input
                    type="text"
                    value={newReadTime}
                    onChange={(e) => setNewReadTime(e.target.value)}
                    placeholder="e.g. 6 min read"
                    className="w-full h-12 bg-white border border-brand-outline-variant/30 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-headline text-xs font-bold text-brand-on-surface uppercase mb-2">Author Name</label>
                  <input
                    type="text"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full h-12 bg-white border border-brand-outline-variant/30 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-headline text-xs font-bold text-brand-on-surface uppercase mb-2">Author Title</label>
                  <input
                    type="text"
                    value={newAuthorRole}
                    onChange={(e) => setNewAuthorRole(e.target.value)}
                    placeholder="e.g. Scholar, Lab Lead"
                    className="w-full h-12 bg-white border border-brand-outline-variant/30 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-headline text-xs font-bold text-brand-on-surface uppercase mb-2">Content Draft</label>
                <textarea
                  rows={8}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste your markdown or standard content draft here..."
                  className="w-full bg-white border border-brand-outline-variant/30 rounded-xl p-4 text-sm focus:outline-none focus:border-brand-primary leading-relaxed"
                  required
                />
              </div>



              <div>
                <label className="block font-headline text-xs font-bold text-brand-on-surface uppercase mb-2">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="AI, Quantum, Venture Architecture"
                  className="w-full h-12 bg-white border border-brand-outline-variant/30 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-headline text-xs font-bold text-brand-on-surface uppercase mb-2">Cover Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {newCoverPreview && (
                    <img src={newCoverPreview} alt="Cover Preview" className="w-24 h-16 object-cover rounded-lg border border-brand-outline-variant/30" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        if (file.size > 5 * 1024 * 1024) {
                          triggerToast("File size must be under 5MB.");
                          return;
                        }
                        setNewCoverFile(file);
                        setNewCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="flex-1 text-sm text-brand-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 transition-all cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-brand-primary text-white font-headline text-sm font-bold rounded-xl hover:opacity-95 active:scale-95 transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-2"
              >
                <PenTool size={18} />
                {isSubmitting ? "Publishing Draft..." : "Submit for Editorial Review"}
              </button>
            </form>
          </motion.div>
        )}

        {/* VIEW 6: ALERTS NOTIFICATIONS */}
        {view === "alerts" && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-screen-md mx-auto px-6 pt-20"
          >
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f6]/95 backdrop-blur-md border-b border-brand-outline-variant/30 flex justify-between items-center px-6 h-16 max-w-screen-md mx-auto">
              <h1 className="font-headline text-xl font-bold text-brand-primary">Alerts</h1>
              <button
                onClick={markAlertsAsRead}
                className="font-headline text-xs font-bold text-brand-secondary hover:text-brand-primary"
              >
                Mark all read
              </button>
            </header>

            <div className="space-y-4 mt-4">
              {alerts.length === 0 ? (
                <p className="text-center py-12 text-brand-secondary italic">No notifications yet.</p>
              ) : (
                alerts.map((al) => (
                  <div
                    key={al.id}
                    className={`p-4 rounded-xl border border-brand-outline-variant/30 transition-all flex items-start gap-3 shadow-sm ${al.read ? "bg-white" : "bg-brand-surface-container-low border-brand-primary/15"
                      }`}
                  >
                    <div className="mt-1">
                      {al.type === "achievement" ? (
                        <span className="text-amber-500 font-headline text-lg">🏆</span>
                      ) : al.type === "success" ? (
                        <span className="text-green-500 font-headline text-lg">✅</span>
                      ) : (
                        <span className="text-brand-primary font-headline text-lg">📢</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-headline text-xs font-bold text-brand-on-surface">{al.title}</h4>
                        <span className="text-[10px] text-brand-secondary">{al.timestamp}</span>
                      </div>
                      <p className="text-sm text-brand-on-surface-variant leading-relaxed mt-1">{al.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 7: READER PROFILE */}
        {view === "console" && (
          <motion.div
            key="console"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="w-full max-w-screen-md mx-auto px-6 pt-20 pb-24"
          >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f6]/95 backdrop-blur-md border-b border-brand-outline-variant/30 flex justify-between items-center px-6 h-16 max-w-screen-md mx-auto">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setView("home")}
                  className="p-1.5 hover:bg-brand-surface-container rounded-full text-brand-secondary hover:text-brand-primary"
                >
                  <ArrowLeft size={18} />
                </button>
                <h1 className="font-headline text-lg font-bold text-brand-primary">Reader Profile</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    if (isEditingProfile) {
                      await saveProfileChanges();
                    } else {
                      setTempName(profileName);
                      setTempBio(profileBio);
                      setTempAvatar(profileAvatar);
                      setTempRole(profileRole);
                      setTempStreak(profileStreak);
                      setIsEditingProfile(true);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-headline font-bold transition-all ${isEditingProfile
                    ? "bg-brand-primary text-white hover:opacity-95"
                    : "bg-brand-surface-container text-brand-on-surface hover:bg-brand-surface-container-high"
                    }`}
                >
                  {isEditingProfile ? "Save Profile" : "Edit Profile"}
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to log out?")) {
                      await supabase.auth.signOut();
                      localStorage.removeItem("cie_is_authenticated");
                      triggerToast("Logged out successfully");
                      setAuthEmail("");
                      setAuthPassword("");
                      setAuthName("");
                      setView("login");
                    }
                  }}
                  className="p-2 hover:bg-red-500/10 text-red-600 rounded-full transition-colors flex items-center justify-center"
                  title="Log Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </header>

            {/* Profile Overview Card */}
            <div className="bg-white border border-brand-outline-variant/30 rounded-2xl p-6 shadow-sm mb-6 mt-4 relative overflow-hidden">
              {/* Background Accent Mesh */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none"></div>

              {isEditingProfile ? (
                // Edit Profile Inline Form
                <div className="space-y-4">
                  <h3 className="font-headline text-sm font-bold text-brand-primary uppercase tracking-wider">Customize Your Card</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-brand-secondary uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full h-11 bg-[#fff8f6] border border-brand-outline-variant/30 rounded-xl px-3.5 text-sm focus:outline-none focus:border-brand-primary"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-brand-secondary uppercase mb-1">Tagline / Role</label>
                      <input
                        type="text"
                        value={tempRole}
                        onChange={(e) => setTempRole(e.target.value)}
                        className="w-full h-11 bg-[#fff8f6] border border-brand-outline-variant/30 rounded-xl px-3.5 text-sm focus:outline-none focus:border-brand-primary"
                        placeholder="e.g. Technology Curator, AI Ethicist"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-secondary uppercase mb-1">Avatar Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.size > 5 * 1024 * 1024) {
                            triggerToast("File size must be under 5MB.");
                            return;
                          }
                          setTempAvatarFile(file);
                          const objectUrl = URL.createObjectURL(file);
                          setTempAvatar(objectUrl);
                        }
                      }}
                      className="w-full h-11 bg-[#fff8f6] border border-brand-outline-variant/30 rounded-xl px-3.5 text-sm focus:outline-none focus:border-brand-primary font-mono flex items-center pt-2"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-secondary uppercase mb-1">Bio</label>
                    <textarea
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      rows={3}
                      className="w-full bg-[#fff8f6] border border-brand-outline-variant/30 rounded-xl p-3.5 text-sm focus:outline-none focus:border-brand-primary leading-relaxed"
                      placeholder="Write a brief intro bio..."
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 text-xs font-headline font-bold text-brand-secondary hover:text-brand-on-surface"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProfileChanges}
                      className="px-4 py-2 bg-brand-primary text-white text-xs font-headline font-bold rounded-xl hover:opacity-95 shadow-sm shadow-orange-500/10"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode Profile Detail
                <div className="flex flex-col md:flex-row gap-5 items-center md:items-start text-center md:text-left">
                  <div className="relative w-20 h-20 rounded-full bg-brand-surface-container-high overflow-hidden border-2 border-brand-primary shadow-sm flex-shrink-0">
                    <img src={profileAvatar} alt={profileName} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h2 className="font-headline text-2xl font-extrabold text-[#251913] leading-snug">{profileName}</h2>
                        <p className="font-headline text-xs font-bold text-brand-primary uppercase tracking-wider">{profileRole}</p>
                      </div>
                      <span className="inline-flex self-center md:self-start items-center gap-1 bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full text-[11px] font-headline font-bold">
                        🏆 Level {Math.max(1, Math.floor((articles.filter(a => a.hasRead).length + articles.filter(a => a.hasSaved).length + articles.reduce((acc, a) => acc + a.commentsList.filter(c => c.authorName === profileName).length, 0)) / 3) + 1)} : {
                          (() => {
                            const readCount = articles.filter(a => a.hasRead).length;
                            if (readCount >= 8) return "Elite Polymath";
                            if (readCount >= 5) return "Gold Explorer";
                            if (readCount >= 3) return "Silver Scholar";
                            return "Curious Mind";
                          })()
                        }
                      </span>
                    </div>

                    <p className="font-sans text-sm text-brand-on-surface-variant leading-relaxed mt-2.5">
                      {profileBio}
                    </p>

                    {/* Preferred Interests Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5 justify-center md:justify-start">
                      {profileInterests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2.5 py-0.5 bg-brand-surface-container-low text-brand-secondary border border-brand-outline-variant/20 rounded-full text-[10px] font-headline font-semibold"
                        >
                          #{interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reader Metrics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-brand-outline-variant/30 p-4.5 rounded-2xl flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🔥</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-headline font-bold text-brand-secondary uppercase tracking-wider">Streak</span>
                  <span className="text-lg font-extrabold text-[#251913]">{profileStreak} Days</span>
                </div>
              </div>

              <div className="bg-white border border-brand-outline-variant/30 p-4.5 rounded-2xl flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check size={18} className="stroke-[2.5px]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-headline font-bold text-brand-secondary uppercase tracking-wider">Articles Read</span>
                  <span className="text-lg font-extrabold text-[#251913]">{articles.filter((a) => a.hasRead).length}</span>
                </div>
              </div>

              <div className="bg-white border border-brand-outline-variant/30 p-4.5 rounded-2xl flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bookmark size={18} className="fill-blue-500/10 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-headline font-bold text-brand-secondary uppercase tracking-wider">Bookmarks</span>
                  <span className="text-lg font-extrabold text-[#251913]">{articles.filter((a) => a.hasSaved).length}</span>
                </div>
              </div>

              <div className="bg-white border border-brand-outline-variant/30 p-4.5 rounded-2xl flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-headline font-bold text-brand-secondary uppercase tracking-wider">Comments</span>
                  <span className="text-lg font-extrabold text-[#251913]">
                    {articles.reduce((acc, a) => acc + a.commentsList.filter(c => c.authorName === profileName).length, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* CIE Daily Settings Card */}
            <div className="bg-white border border-brand-outline-variant/30 rounded-2xl p-5 shadow-sm mb-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-brand-outline-variant/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-brand-primary" />
                  <h3 className="font-headline text-xs font-bold text-brand-primary uppercase tracking-wider">CIE Daily Briefing</h3>
                </div>
                {/* Sliding Toggle Switch */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-secondary">
                    {dailyTimingEnabled ? "Active" : "Disabled"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !dailyTimingEnabled;
                      setDailyTimingEnabled(nextVal);
                      localStorage.setItem("cie_daily_timing_enabled", String(nextVal));
                      triggerToast(`CIE Daily Briefing ${nextVal ? "Enabled" : "Disabled"}`);
                    }}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${dailyTimingEnabled ? "bg-brand-primary" : "bg-brand-outline-variant"
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${dailyTimingEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>
              </div>

              <p className="font-sans text-xs text-brand-secondary mb-4 leading-relaxed">
                Choose if and when your daily custom-curated intelligence briefing is compiled and delivered to your home feed.
              </p>

              <div className={`transition-all duration-300 ${dailyTimingEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                <div className="flex flex-col gap-2.5">
                  {/* Active Timing Display Button */}
                  <button
                    onClick={() => dailyTimingEnabled && setShowTimePicker(!showTimePicker)}
                    disabled={!dailyTimingEnabled}
                    className="w-full bg-[#fff8f6] border border-brand-outline-variant/30 hover:border-brand-primary/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm transition-all text-brand-on-surface text-left"
                  >
                    <div className="flex items-start sm:items-center gap-2.5 font-medium leading-tight">
                      <span className="text-base flex-shrink-0 mt-0.5 sm:mt-0">⏰</span>
                      <span className="break-words">
                        Daily Briefing Scheduled for <strong className="text-brand-primary whitespace-nowrap">{dailyTiming}</strong>
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-brand-primary uppercase bg-brand-primary/5 px-2.5 py-1 rounded-md self-start sm:self-auto flex-shrink-0">
                      {showTimePicker ? "Close" : "Change Time"}
                    </span>
                  </button>

                  {/* Animated Expandable Interactive Time Picker */}
                  <AnimatePresence>
                    {showTimePicker && dailyTimingEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden space-y-3 pt-1"
                      >
                        {/* Presets */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: "🌅 Early Bird", time: "07:30 AM" },
                            { label: "☕ Morning Brew", time: "08:30 AM" },
                            { label: "🥗 Lunch Brief", time: "12:00 PM" },
                            { label: "🌃 Night Review", time: "06:30 PM" }
                          ].map((preset) => (
                            <button
                              key={preset.time}
                              onClick={() => {
                                setDailyTiming(preset.time);
                                localStorage.setItem("cie_daily_timing", preset.time);
                                triggerToast(`Briefing time scheduled for ${preset.time}`);
                                setShowTimePicker(false);
                              }}
                              className={`h-9 px-3 text-xs font-semibold rounded-lg border text-left transition-all flex items-center justify-between ${dailyTiming === preset.time
                                ? "bg-brand-primary border-brand-primary text-white"
                                : "bg-transparent border-brand-outline-variant/40 text-brand-secondary hover:border-brand-primary/40"
                                }`}
                            >
                              <span>{preset.label}</span>
                              <span className="opacity-80 text-[10px]">{preset.time}</span>
                            </button>
                          ))}
                        </div>

                        {/* Custom Time Picker */}
                        <div className="flex items-center gap-3 bg-brand-surface-container-low p-2.5 rounded-xl border border-brand-outline-variant/20">
                          <span className="text-xs font-bold text-brand-secondary uppercase whitespace-nowrap">Or Set Custom:</span>
                          <input
                            type="time"
                            onChange={(e) => {
                              const val = e.target.value; // e.g. "14:30"
                              if (val) {
                                const [hStr, mStr] = val.split(":");
                                const h = parseInt(hStr, 10);
                                const ampm = h >= 12 ? "PM" : "AM";
                                const displayH = h % 12 === 0 ? 12 : h % 12;
                                const formattedTime = `${displayH.toString().padStart(2, "0")}:${mStr} ${ampm}`;
                                setDailyTiming(formattedTime);
                                localStorage.setItem("cie_daily_timing", formattedTime);
                                triggerToast(`Custom briefing time scheduled for ${formattedTime}`);
                              }
                            }}
                            className="bg-white border border-brand-outline-variant/30 text-xs font-bold rounded-lg h-8 px-2 focus:outline-none focus:border-brand-primary text-brand-on-surface"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Profile Tabs Navigation */}
            <div className="flex border-b border-brand-outline-variant/30 mb-6 overflow-x-auto no-scrollbar">
              <button
                className={`px-4 py-3 font-headline text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${currentProfileTab === "history"
                  ? "text-brand-primary border-brand-primary"
                  : "text-brand-secondary border-transparent hover:text-brand-primary"
                  }`}
                onClick={() => setCurrentProfileTab("history")}
              >
                <span>Recently Read</span>
                <span className="px-1.5 py-0.5 bg-brand-surface-container rounded-full text-[9px] text-brand-secondary">
                  {articles.filter((a) => a.hasRead).length}
                </span>
              </button>
              <button
                className={`px-4 py-3 font-headline text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${currentProfileTab === "bookmarks"
                  ? "text-brand-primary border-brand-primary"
                  : "text-brand-secondary border-transparent hover:text-brand-primary"
                  }`}
                onClick={() => setCurrentProfileTab("bookmarks")}
              >
                <span>Bookmarks</span>
                <span className="px-1.5 py-0.5 bg-brand-surface-container rounded-full text-[9px] text-brand-secondary">
                  {articles.filter((a) => a.hasSaved).length}
                </span>
              </button>
              <button
                className={`px-4 py-3 font-headline text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${currentProfileTab === "submissions"
                  ? "text-brand-primary border-brand-primary"
                  : "text-brand-secondary border-transparent hover:text-brand-primary"
                  }`}
                onClick={() => setCurrentProfileTab("submissions")}
              >
                <span>Submitted Drafts</span>
                <span className="px-1.5 py-0.5 bg-brand-surface-container rounded-full text-[9px] text-brand-secondary">
                  {pendingArticles.length}
                </span>
              </button>
              <button
                className={`px-4 py-3 font-headline text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${currentProfileTab === "preferences"
                  ? "text-brand-primary border-brand-primary"
                  : "text-brand-secondary border-transparent hover:text-brand-primary"
                  }`}
                onClick={() => setCurrentProfileTab("preferences")}
              >
                <SlidersHorizontal size={13} />
                <span>Preferences</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="space-y-4">
              {/* 1. History Tab */}
              {currentProfileTab === "history" && (
                articles.filter((a) => a.hasRead).length === 0 ? (
                  <div className="text-center py-12 bg-white border border-brand-outline-variant/20 rounded-2xl p-6">
                    <p className="text-brand-secondary italic text-sm mb-3">No articles in your reading history yet.</p>
                    <button
                      onClick={() => setView("home")}
                      className="px-4 py-2 bg-brand-primary text-white text-xs font-headline font-bold rounded-xl hover:opacity-95 shadow-sm"
                    >
                      Explore Articles
                    </button>
                  </div>
                ) : (
                  articles.filter((a) => a.hasRead).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => { setSelectedArticle(art); setView("article-detail"); }}
                      className="group bg-white border border-brand-outline-variant/30 p-4 rounded-2xl flex gap-4 items-center justify-between cursor-pointer hover:border-brand-primary/20 transition-all shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-headline text-[10px] text-brand-primary font-bold uppercase">{art.category}</span>
                          <span className="text-brand-secondary font-sans text-[10px]">• {art.readTime}</span>
                        </div>
                        <h4 className="font-headline text-sm font-bold text-brand-on-surface mb-0.5 group-hover:text-brand-primary transition-colors line-clamp-1 leading-snug">
                          {art.title}
                        </h4>
                        <p className="font-sans text-[11px] text-brand-secondary line-clamp-1">{art.aiSummary || art.content}</p>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            handleArticleAction(art.id, "read");
                            triggerToast("Marked as Unread");
                          }}
                          className="p-1.5 hover:bg-brand-surface-container rounded-full text-emerald-600 transition-colors"
                          title="Mark as Unread"
                        >
                          <Check size={16} className="stroke-[2.5px]" />
                        </button>
                        <button
                          onClick={() => handleArticleAction(art.id, "save")}
                          className="p-1.5 hover:bg-brand-surface-container rounded-full text-brand-secondary hover:text-brand-primary transition-colors"
                          title={art.hasSaved ? "Remove Bookmark" : "Save Bookmark"}
                        >
                          <Bookmark size={16} className={art.hasSaved ? "fill-brand-primary text-brand-primary" : ""} />
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* 2. Bookmarks Tab */}
              {currentProfileTab === "bookmarks" && (
                articles.filter((a) => a.hasSaved).length === 0 ? (
                  <div className="text-center py-12 bg-white border border-brand-outline-variant/20 rounded-2xl p-6">
                    <p className="text-brand-secondary italic text-sm mb-3">No saved articles yet.</p>
                    <button
                      onClick={() => setView("home")}
                      className="px-4 py-2 bg-brand-primary text-white text-xs font-headline font-bold rounded-xl hover:opacity-95 shadow-sm"
                    >
                      Browse Feed
                    </button>
                  </div>
                ) : (
                  articles.filter((a) => a.hasSaved).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => { setSelectedArticle(art); setView("article-detail"); }}
                      className="group bg-white border border-brand-outline-variant/30 p-4 rounded-2xl flex gap-4 items-center justify-between cursor-pointer hover:border-brand-primary/20 transition-all shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-headline text-[10px] text-brand-primary font-bold uppercase">{art.category}</span>
                          <span className="text-brand-secondary font-sans text-[10px]">• {art.readTime}</span>
                        </div>
                        <h4 className="font-headline text-sm font-bold text-brand-on-surface mb-0.5 group-hover:text-brand-primary transition-colors line-clamp-1 leading-snug">
                          {art.title}
                        </h4>
                        <p className="font-sans text-[11px] text-brand-secondary line-clamp-1">{art.content}</p>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleArticleAction(art.id, "save")}
                          className="p-1.5 hover:bg-brand-surface-container rounded-full text-brand-primary transition-colors"
                          title="Remove bookmark"
                        >
                          <Bookmark size={16} className="fill-brand-primary text-brand-primary" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* 3. My Submissions Tab */}
              {currentProfileTab === "submissions" && (
                pendingArticles.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-brand-outline-variant/20 rounded-2xl p-6 flex flex-col items-center">
                    <PenTool size={28} className="text-brand-outline-variant mb-2" />
                    <p className="text-brand-secondary italic text-sm mb-3">You haven't submitted any article drafts yet.</p>
                    <button
                      onClick={() => setView("write")}
                      className="px-4 py-2 bg-brand-primary text-white text-xs font-headline font-bold rounded-xl hover:opacity-95 shadow-sm flex items-center gap-1.5"
                    >
                      <PenTool size={13} />
                      Write an Article
                    </button>
                  </div>
                ) : (
                  pendingArticles.map((art) => (
                    <div
                      key={art.id}
                      className="bg-white border border-brand-outline-variant/30 p-5 rounded-2xl flex justify-between items-center shadow-sm"
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 font-headline text-[9px] font-bold rounded-full ${art.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : art.status === "rejected"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-brand-surface-container text-brand-secondary animate-pulse"
                            }`}>
                            {art.status ? art.status.toUpperCase() : "PENDING REVIEW"}
                          </span>
                          <span className="font-headline text-[10px] text-brand-secondary font-bold uppercase">{art.category}</span>
                        </div>
                        <h4 className="font-headline text-base font-bold text-brand-on-surface mb-1 leading-snug">{art.title}</h4>
                        <p className="font-sans text-xs text-brand-secondary">Submitted on {art.date}</p>
                        {art.status === "rejected" && art.rejectionReason && (
                          <p className="font-sans text-xs font-semibold text-red-500 mt-1">Reason: {art.rejectionReason}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {art.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleArticleAction(art.id, "approve")}
                              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 font-headline font-bold text-xs rounded-xl transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = window.prompt("Provide a reason for rejection:");
                                if (reason !== null) {
                                  handleArticleAction(art.id, "reject", { rejectionReason: reason });
                                }
                              }}
                              className="px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-headline font-bold text-xs rounded-xl transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {art.status === "rejected" && (
                          <button
                            onClick={() => {
                              setNewTitle(art.title);
                              setNewCategory(art.category);
                              setNewReadTime(art.readTime);
                              setNewContent(art.content);
                              setNewTags(art.tags ? art.tags.join(", ") : "");
                              setView("write");
                              triggerToast("Loaded draft into editor for editing & resubmission!");
                            }}
                            className="px-3.5 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-headline font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                          >
                            <PenTool size={12} />
                            Edit & Resubmit
                          </button>
                        )}
                        {art.status === "approved" && (
                          <button
                            onClick={() => { setSelectedArticle(art); setView("article-detail"); }}
                            className="p-2 hover:bg-brand-surface-container rounded-full text-brand-primary"
                          >
                            <ChevronRight size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )
              )}

              {/* 4. Preferences Tab */}
              {currentProfileTab === "preferences" && (
                <div className="bg-white border border-brand-outline-variant/30 rounded-2xl p-5.5 space-y-6 shadow-sm">
                  {/* Favorite Categories */}
                  <div>
                    <h4 className="font-headline text-sm font-bold text-brand-on-surface mb-2.5">Your Favorite Categories</h4>
                    <p className="font-sans text-xs text-brand-secondary mb-3.5">Articles from these topics will be highlighted on your daily intelligence dashboard.</p>
                    <div className="flex flex-wrap gap-2">
                      {["Technology", "AI", "Startups", "Innovation", "Design"].map((cat) => {
                        const isInterested = profileInterests.includes(cat);
                        return (
                          <button
                            key={cat}
                            onClick={() => {
                              let next;
                              if (isInterested) {
                                next = profileInterests.filter(c => c !== cat);
                              } else {
                                next = [...profileInterests, cat];
                              }
                              setProfileInterests(next);
                              localStorage.setItem("cie_profile_interests", JSON.stringify(next));
                              triggerToast(`${isInterested ? "Removed" : "Added"} ${cat} interest`);
                            }}
                            className={`px-3.5 py-1.5 rounded-full font-headline text-xs font-bold transition-all border ${isInterested
                              ? "bg-brand-primary border-brand-primary text-white shadow-sm"
                              : "bg-transparent border-brand-outline-variant/40 text-brand-secondary hover:border-brand-primary"
                              }`}
                          >
                            {cat} {isInterested ? "✓" : "+"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <hr className="border-brand-outline-variant/20" />

                  {/* Settings Toggles */}
                  <div className="space-y-4">
                    <h4 className="font-headline text-sm font-bold text-brand-on-surface">Reading Preferences</h4>

                    <div className="flex items-center justify-between py-1">
                      <div>
                        <p className="font-headline text-xs font-bold text-brand-on-surface">Enable Dynamic AI Summaries</p>
                        <p className="text-[11px] text-brand-secondary">Pre-generate 1-sentence teasers using Gemini model</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        onChange={() => triggerToast("Preference saved!")}
                        className="w-4 h-4 accent-brand-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div>
                        <p className="font-headline text-xs font-bold text-brand-on-surface">Weekly Scholar Digest</p>
                        <p className="text-[11px] text-brand-secondary">Deliver the highest rated innovation briefs to your inbox</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        onChange={() => triggerToast("Weekly digest preference updated!")}
                        className="w-4 h-4 accent-brand-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between py-1 border-t border-brand-outline-variant/10 pt-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-headline text-xs font-bold text-brand-on-surface">CIE Daily Briefing Delivery</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${dailyTimingEnabled ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-outline-variant/20 text-brand-secondary"}`}>
                            {dailyTimingEnabled ? "ON" : "OFF"}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-secondary">
                          {dailyTimingEnabled ? `Scheduled for ${dailyTiming}` : "Delivery is turned off"}
                        </p>
                      </div>

                      {/* Sliding toggle switch */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !dailyTimingEnabled;
                          setDailyTimingEnabled(nextVal);
                          localStorage.setItem("cie_daily_timing_enabled", String(nextVal));
                          triggerToast(`CIE Daily Briefing ${nextVal ? "Enabled" : "Disabled"}`);
                        }}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${dailyTimingEnabled ? "bg-brand-primary" : "bg-brand-outline-variant"
                          }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${dailyTimingEnabled ? "translate-x-4" : "translate-x-0"
                            }`}
                        />
                      </button>
                    </div>

                    {dailyTimingEnabled && (
                      <div className="flex items-center justify-between py-1 pl-4 border-l-2 border-brand-primary/20">
                        <div>
                          <p className="font-headline text-xs font-bold text-brand-on-surface">Delivery Hour</p>
                          <p className="text-[11px] text-brand-secondary">Choose the exact hour of day for briefing compilation</p>
                        </div>
                        <input
                          type="time"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const [hStr, mStr] = val.split(":");
                              const h = parseInt(hStr, 10);
                              const ampm = h >= 12 ? "PM" : "AM";
                              const displayH = h % 12 === 0 ? 12 : h % 12;
                              const formattedTime = `${displayH.toString().padStart(2, "0")}:${mStr} ${ampm}`;
                              setDailyTiming(formattedTime);
                              localStorage.setItem("cie_daily_timing", formattedTime);
                              triggerToast(`Daily briefing time scheduled for ${formattedTime}`);
                            }
                          }}
                          className="bg-[#fff8f6] border border-brand-outline-variant/30 text-xs font-bold rounded-lg h-9 px-2 focus:outline-none focus:border-brand-primary text-brand-on-surface"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between py-1">
                      <div>
                        <p className="font-headline text-xs font-bold text-brand-on-surface">Compact Layout Mode</p>
                        <p className="text-[11px] text-brand-secondary">Minimize spaces to fit more intelligence per screen</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        onChange={() => triggerToast("Compact layout preference updated!")}
                        className="w-4 h-4 accent-brand-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Log Out Section (At the end of the page) */}
            <div className="bg-white border border-red-200 rounded-2xl p-5.5 mt-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <LogOut size={16} className="text-red-500" />
                    <h3 className="font-headline text-xs font-bold text-red-500 uppercase tracking-wider">Account & Session</h3>
                  </div>
                  <p className="font-sans text-xs text-brand-secondary">
                    Sign out securely from CIE Daily on this device. Your bookmarks, active reading status, and submission drafts remain safe.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to log out?")) {
                      await supabase.auth.signOut();
                      localStorage.removeItem("cie_is_authenticated");
                      triggerToast("Logged out successfully");
                      setAuthEmail("");
                      setAuthPassword("");
                      setAuthName("");
                      setView("login");
                    }
                  }}
                  className="px-6 h-11 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-headline font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Log Out of CIE Daily
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 8: BOOKMARKS SCREEN */}
        {view === "bookmarks" && (
          <motion.div
            key="bookmarks"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-screen-md mx-auto px-6 pt-20 pb-24"
          >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f6]/95 backdrop-blur-md border-b border-brand-outline-variant/30 flex justify-between items-center px-6 h-16 max-w-screen-md mx-auto">
              <h1 className="font-headline text-xl font-bold text-brand-primary">Bookmarks</h1>
              <span className="font-headline text-xs text-brand-secondary font-bold">Saved Articles</span>
            </header>

            {/* Subtitle */}
            <section className="mt-4 mb-6">
              <p className="font-headline text-xs font-bold text-brand-secondary uppercase tracking-widest mb-1">Your Library</p>
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-[#251913]">Bookmarked Stories</h2>
            </section>

            {/* Saved Articles List */}
            <div className="grid grid-cols-1 gap-6">
              {articles.filter((a) => a.hasSaved).length === 0 ? (
                <div className="text-center py-16 bg-white border border-brand-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4">
                    <Bookmark size={28} />
                  </div>
                  <h3 className="font-headline text-base font-bold text-brand-on-surface mb-2">No bookmarks yet</h3>
                  <p className="text-xs text-brand-secondary max-w-sm leading-relaxed mb-6">
                    Articles you bookmark will appear here for easy reference and offline reading.
                  </p>
                  <button
                    onClick={() => setView("home")}
                    className="px-6 py-2.5 bg-brand-primary text-white font-headline text-xs font-bold rounded-xl shadow-md shadow-orange-500/10 hover:opacity-95 active:scale-95 transition-all"
                  >
                    Go to Home Feed
                  </button>
                </div>
              ) : (
                articles.filter((a) => a.hasSaved).map((art) => (
                  <article
                    key={art.id}
                    onClick={() => { setSelectedArticle(art); setView("article-detail"); }}
                    className="bg-brand-surface-container-lowest border border-brand-outline-variant/30 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-primary/30 transition-all shadow-sm group flex flex-col"
                  >
                    <div className="h-48 overflow-hidden bg-brand-surface-container relative">
                      <img
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        src={art.imageUrl}
                        alt={art.title}
                      />
                      <span className="absolute top-4 right-4 bg-brand-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {art.category}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="font-headline text-lg font-bold text-brand-on-surface mb-2.5 group-hover:text-brand-primary transition-colors leading-snug">{art.title}</h5>
                        <p className="font-sans text-xs text-brand-on-surface-variant mb-4 line-clamp-2 leading-relaxed">{art.content}</p>
                      </div>

                      <div className="border-t border-brand-outline-variant/20 pt-4 flex flex-col gap-3">
                        {/* Author section */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <img className="w-5 h-5 rounded-full object-cover border border-brand-outline-variant/30" src={art.author.avatar} alt={art.author.name} />
                            <span className="font-headline text-xs font-semibold text-brand-on-surface-variant">{art.author.name}</span>
                          </div>
                          <span className="font-sans text-[11px] text-brand-secondary">{art.readTime}</span>
                        </div>

                        {/* Post Actions Footer */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex justify-between items-center border-t border-brand-outline-variant/20 pt-3"
                        >
                          <div className="flex items-center gap-1.5 text-[11px] text-brand-secondary">
                            <span className="font-headline font-semibold text-brand-on-surface-variant">Uploaded:</span>
                            <span>{art.date}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArticleAction(art.id, "save");
                              }}
                              className="p-1.5 hover:bg-brand-surface-container rounded-full transition-colors text-brand-secondary hover:text-brand-primary"
                              title="Remove from Bookmarks"
                            >
                              <Bookmark size={18} className="fill-brand-primary text-brand-primary" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerToast("Link copied to clipboard!");
                              }}
                              className="p-1.5 hover:bg-brand-surface-container rounded-full transition-colors text-brand-secondary hover:text-brand-primary"
                              title="Share Article"
                            >
                              <Share2 size={18} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArticleAction(art.id, "read");
                                triggerToast(art.hasRead ? "Marked as Unread" : "Marked as Read!");
                              }}
                              className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${art.hasRead
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                : "hover:bg-brand-surface-container text-brand-secondary hover:text-brand-primary"
                                }`}
                              title={art.hasRead ? "Mark as Unread" : "Mark as Read"}
                            >
                              <Check size={18} className={art.hasRead ? "stroke-[2.5px]" : ""} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* BOTTOM NAVIGATION BAR */}
      {view !== "splash" && view !== "login" && view !== "signup" && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-3.5 bg-brand-surface-container-lowest border-t border-brand-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] rounded-t-2xl max-w-screen-md mx-auto">
          <button
            onClick={() => setView("home")}
            className={`flex flex-col items-center gap-1.5 transition-colors duration-200 ${view === "home" || view === "article-detail" ? "text-brand-primary font-bold" : "text-brand-secondary hover:text-brand-primary"
              }`}
          >
            <HomeIcon size={19} className={view === "home" ? "fill-brand-primary/10" : ""} />
            <span className="font-headline text-[10px] font-bold">Home</span>
          </button>

          <button
            onClick={() => { setView("explore"); setSearchText(""); }}
            className={`flex flex-col items-center gap-1.5 transition-colors duration-200 ${view === "explore" ? "text-brand-primary font-bold" : "text-brand-secondary hover:text-brand-primary"
              }`}
          >
            <Compass size={19} className={view === "explore" ? "fill-brand-primary/10" : ""} />
            <span className="font-headline text-[10px] font-bold">Explore</span>
          </button>

          <button
            onClick={() => setView("write")}
            className={`flex flex-col items-center gap-1.5 transition-colors duration-200 ${view === "write" ? "text-brand-primary font-bold" : "text-brand-secondary hover:text-brand-primary"
              }`}
          >
            <PenTool size={19} className={view === "write" ? "fill-brand-primary/10" : ""} />
            <span className="font-headline text-[10px] font-bold">Write</span>
          </button>

          <button
            onClick={() => setView("bookmarks")}
            className={`flex flex-col items-center gap-1.5 transition-colors duration-200 ${view === "bookmarks" ? "text-brand-primary font-bold" : "text-brand-secondary hover:text-brand-primary"
              }`}
          >
            <Bookmark size={19} className={view === "bookmarks" ? "fill-brand-primary text-brand-primary" : ""} />
            <span className="font-headline text-[10px] font-bold">Bookmarks</span>
          </button>
        </nav>
      )}
    </div>
  );
}
