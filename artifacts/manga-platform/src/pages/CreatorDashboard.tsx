import { useState } from "react";
import { Link } from "wouter";
import {
  useGetCreator, useGetCreatorAnalytics, useGetCreatorRevenue,
  useListManga, useCreateManga, useCreateChapter,
  getGetCreatorQueryKey, getGetCreatorAnalyticsQueryKey, getGetCreatorRevenueQueryKey, getListMangaQueryKey
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Eye, Heart, Users, DollarSign, BookOpen, Upload, BarChart2, Home, ChevronRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const CREATOR_ID = 1;

type SidebarItem = { id: string; label: string; icon: React.ReactNode };
const sidebarItems: SidebarItem[] = [
  { id: "overview", label: "Overview", icon: <BarChart2 className="w-4 h-4" /> },
  { id: "manga", label: "My Manga", icon: <BookOpen className="w-4 h-4" /> },
  { id: "upload-manga", label: "Upload Manga", icon: <Upload className="w-4 h-4" /> },
  { id: "upload-chapter", label: "Upload Chapter", icon: <Upload className="w-4 h-4" /> },
  { id: "revenue", label: "Revenue", icon: <DollarSign className="w-4 h-4" /> },
];

const PIE_COLORS = ["hsl(263.4 70% 50.4%)", "hsl(346.8 77.2% 49.8%)", "hsl(199 89% 48%)"];

export default function CreatorDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mangaDialogOpen, setMangaDialogOpen] = useState(false);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: creator, isLoading: creatorLoading } = useGetCreator(CREATOR_ID, { query: { queryKey: getGetCreatorQueryKey(CREATOR_ID) } });
  const { data: analytics } = useGetCreatorAnalytics(CREATOR_ID, { query: { queryKey: getGetCreatorAnalyticsQueryKey(CREATOR_ID) } });
  const { data: revenue } = useGetCreatorRevenue(CREATOR_ID, { query: { queryKey: getGetCreatorRevenueQueryKey(CREATOR_ID) } });
  const { data: allManga } = useListManga({ limit: 20 });
  const myManga = allManga?.filter(m => m.creatorId === CREATOR_ID) ?? [];

  const createManga = useCreateManga();
  const createChapter = useCreateChapter();

  const mangaForm = useForm<{ title: string; description: string; genre: string; language: string }>({
    defaultValues: { title: "", description: "", genre: "Action", language: "English" }
  });
  const chapterForm = useForm<{ mangaId: string; chapterNumber: string; title: string }>({
    defaultValues: { mangaId: "", chapterNumber: "", title: "" }
  });

  const onSubmitManga = (data: { title: string; description: string; genre: string; language: string }) => {
    createManga.mutate({ data: { title: data.title, description: data.description, genre: data.genre, language: data.language } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMangaQueryKey() });
        mangaForm.reset();
        setMangaDialogOpen(false);
      }
    });
  };

  const onSubmitChapter = (data: { mangaId: string; chapterNumber: string; title: string }) => {
    const mId = parseInt(data.mangaId, 10);
    createChapter.mutate({
      mangaId: mId,
      data: { chapterNumber: parseFloat(data.chapterNumber), title: data.title, pages: [] }
    }, {
      onSuccess: () => {
        chapterForm.reset();
        setChapterDialogOpen(false);
      }
    });
  };

  if (creatorLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="w-56 border-r border-white/10 p-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
        </div>
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/10 bg-card/20 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Creator Studio</p>
          {creator && (
            <div className="flex items-center gap-2">
              <img src={creator.avatar} alt={creator.name} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium truncate">{creator.name}</p>
                {creator.isVerified && <CheckCircle className="w-3 h-3 text-primary inline" />}
              </div>
            </div>
          )}
        </div>
        <nav className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="w-full justify-start mb-2 text-muted-foreground">
            <Link href="/"><Home className="w-4 h-4 mr-2" /> Back to Home</Link>
          </Button>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${activeSection === item.id ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
              data-testid={`nav-${item.id}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Overview */}
        {activeSection === "overview" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Views", value: analytics?.totalViews.toLocaleString() ?? "—", icon: <Eye className="w-5 h-5 text-primary" />, sub: `+${analytics?.weeklyViews.toLocaleString()} this week` },
                { label: "Total Likes", value: analytics?.totalLikes.toLocaleString() ?? "—", icon: <Heart className="w-5 h-5 text-red-400" />, sub: "" },
                { label: "Followers", value: analytics?.totalFollowers.toLocaleString() ?? "—", icon: <Users className="w-5 h-5 text-blue-400" />, sub: "" },
                { label: "Revenue", value: revenue ? `$${revenue.totalRevenue.toFixed(0)}` : "—", icon: <DollarSign className="w-5 h-5 text-green-400" />, sub: "total earned" },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl border border-white/10 bg-card/30"
                  data-testid={`card-stat-${card.label.toLowerCase().replace(/ /g,"-")}`}
                >
                  <div className="flex items-center justify-between mb-2">{card.icon}</div>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
                  {card.sub && <div className="text-xs text-green-400 mt-1">{card.sub}</div>}
                </motion.div>
              ))}
            </div>
            {analytics && analytics.viewsByDay.length > 0 && (
              <div className="p-6 rounded-xl border border-white/10 bg-card/30 mb-6">
                <h2 className="text-base font-semibold mb-4">Views This Week</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={analytics.viewsByDay}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(263.4 70% 50.4%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(263.4 70% 50.4%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: "hsl(240 5% 64.9%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(240 5% 64.9%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(240 10% 8%)", border: "1px solid hsl(240 3.7% 15.9%)", borderRadius: "8px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="views" stroke="hsl(263.4 70% 50.4%)" fill="url(#grad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            {analytics && (analytics.topManga ?? []).length > 0 && (
              <div className="p-6 rounded-xl border border-white/10 bg-card/30">
                <h2 className="text-base font-semibold mb-4">Top Performing Manga</h2>
                <div className="space-y-3">
                  {(analytics.topManga ?? []).map(m => (
                    <div key={m.id} className="flex items-center gap-3">
                      <Link href={`/manga/${m.id}`} className="flex-1 text-sm hover:text-primary transition-colors">{m.title}</Link>
                      <span className="text-sm text-muted-foreground">{m.views.toLocaleString()} views</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* My Manga */}
        {activeSection === "manga" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">My Manga</h1>
              <Button onClick={() => setActiveSection("upload-manga")} className="bg-primary hover:bg-primary/90" data-testid="button-upload-manga">
                <Upload className="w-4 h-4 mr-2" /> Upload New
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {myManga.map(m => (
                <div key={m.id} className="group" data-testid={`card-my-manga-${m.id}`}>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/5 mb-3 relative">
                    <img src={m.coverImage} alt={m.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(m.views/1000).toFixed(0)}k</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{m.chapterCount} ch</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{m.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{m.status}</p>
                </div>
              ))}
              {myManga.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground border border-white/5 rounded-xl">
                  No manga yet. Upload your first manga to get started.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Manga */}
        {activeSection === "upload-manga" && (
          <div className="max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Upload New Manga</h1>
            <form onSubmit={mangaForm.handleSubmit(onSubmitManga)} className="space-y-4 p-6 rounded-xl border border-white/10 bg-card/30">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title *</label>
                <Input {...mangaForm.register("title", { required: true })} placeholder="Enter manga title" data-testid="input-manga-title" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea {...mangaForm.register("description")} placeholder="Describe your manga..." rows={4} data-testid="input-manga-desc" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Genre *</label>
                <Select defaultValue="Action" onValueChange={v => mangaForm.setValue("genre", v)}>
                  <SelectTrigger data-testid="select-manga-genre"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Action","Romance","Horror","Fantasy","Thriller","Drama","Comedy","Sci-Fi","Mystery","Adventure"].map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Language</label>
                <Select defaultValue="English" onValueChange={v => mangaForm.setValue("language", v)}>
                  <SelectTrigger data-testid="select-manga-language"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Korean">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={createManga.isPending} className="w-full bg-primary hover:bg-primary/90" data-testid="button-submit-manga">
                {createManga.isPending ? "Uploading..." : "Upload Manga"}
              </Button>
              {createManga.isSuccess && <p className="text-green-400 text-sm text-center">Manga uploaded successfully!</p>}
            </form>
          </div>
        )}

        {/* Upload Chapter */}
        {activeSection === "upload-chapter" && (
          <div className="max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Upload New Chapter</h1>
            <form onSubmit={chapterForm.handleSubmit(onSubmitChapter)} className="space-y-4 p-6 rounded-xl border border-white/10 bg-card/30">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Manga *</label>
                <Select onValueChange={v => chapterForm.setValue("mangaId", v)}>
                  <SelectTrigger data-testid="select-chapter-manga"><SelectValue placeholder="Select manga" /></SelectTrigger>
                  <SelectContent>
                    {myManga.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Chapter Number *</label>
                <Input {...chapterForm.register("chapterNumber", { required: true })} type="number" placeholder="e.g. 1" data-testid="input-chapter-number" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Chapter Title *</label>
                <Input {...chapterForm.register("title", { required: true })} placeholder="e.g. The Beginning" data-testid="input-chapter-title" />
              </div>
              <Button type="submit" disabled={createChapter.isPending} className="w-full bg-primary hover:bg-primary/90" data-testid="button-submit-chapter">
                {createChapter.isPending ? "Uploading..." : "Upload Chapter"}
              </Button>
              {createChapter.isSuccess && <p className="text-green-400 text-sm text-center">Chapter uploaded successfully!</p>}
            </form>
          </div>
        )}

        {/* Revenue */}
        {activeSection === "revenue" && revenue && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Revenue</h1>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Revenue", value: `$${revenue.totalRevenue.toFixed(2)}`, color: "text-green-400" },
                { label: "Ad Revenue", value: `$${revenue.adsRevenue.toFixed(2)}`, color: "text-blue-400" },
                { label: "Bonuses", value: `$${revenue.bonusRevenue.toFixed(2)}`, color: "text-yellow-400" },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl border border-white/10 bg-card/30" data-testid={`stat-rev-${s.label.toLowerCase().replace(/ /g,"-")}`}>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-white/10 bg-card/30">
                <h2 className="text-base font-semibold mb-4">Monthly Revenue</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenue.monthlyRevenue}>
                    <XAxis dataKey="month" tick={{ fill: "hsl(240 5% 64.9%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(240 5% 64.9%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(240 10% 8%)", border: "1px solid hsl(240 3.7% 15.9%)", borderRadius: "8px", fontSize: "12px" }} />
                    <Bar dataKey="amount" fill="hsl(263.4 70% 50.4%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-card/30">
                <h2 className="text-base font-semibold mb-4">Revenue Breakdown</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Ads", value: revenue.adsRevenue },
                        { name: "Bonus", value: revenue.bonusRevenue },
                        { name: "Donations", value: revenue.donationRevenue },
                      ]}
                      cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    >
                      {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(240 10% 8%)", border: "1px solid hsl(240 3.7% 15.9%)", borderRadius: "8px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-2">
                  {["Ads","Bonus","Donations"].map((label, i) => (
                    <span key={label} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
