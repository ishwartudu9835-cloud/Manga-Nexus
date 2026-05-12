import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MangaDetail from "./pages/MangaDetail";
import ChapterReader from "./pages/ChapterReader";
import Leaderboard from "./pages/Leaderboard";
import Contests from "./pages/Contests";
import Community from "./pages/Community";
import CreatorProfile from "./pages/CreatorProfile";
import CreatorDashboard from "./pages/CreatorDashboard";
import UserProfile from "./pages/UserProfile";
import GenrePage from "./pages/GenrePage";
import InfoPage from "./pages/InfoPages";
import { Search, Bell, Menu, X, BookOpen, Trophy, Users, Sparkles } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } }
});

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MangaVerse
            </span>
          </Link>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link href="/browse" className="px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 hover:text-primary text-foreground/70">
              Browse
            </Link>
            <Link href="/leaderboard" className="px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 hover:text-primary text-foreground/70 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Leaderboard
            </Link>
            <Link href="/contests" className="px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 hover:text-primary text-foreground/70 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Contests
            </Link>
            <Link href="/community" className="px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 hover:text-primary text-foreground/70 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Community
            </Link>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link href="/browse" className="hidden md:flex items-center w-48 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-muted-foreground text-sm gap-2 hover:bg-white/8 transition-colors">
            <Search className="w-3.5 h-3.5 shrink-0" /> Search manga...
          </Link>
          <Link href="/user/1" className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground" aria-label="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          </Link>
          <Link
            href="/creator-dashboard"
            className="hidden md:flex items-center h-9 px-4 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/25 transition-colors"
          >
            Creator Studio
          </Link>
          <Link href="/user/1" className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/40 hover:border-primary transition-colors shrink-0">
            <img src="https://picsum.photos/seed/user1/100/100" alt="Profile" className="w-full h-full object-cover" />
          </Link>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 px-4 py-3 flex flex-col gap-2">
          {[
            { href: "/browse", label: "Browse" },
            { href: "/leaderboard", label: "Leaderboard" },
            { href: "/contests", label: "Contests" },
            { href: "/community", label: "Community" },
            { href: "/creator-dashboard", label: "Creator Studio" },
            { href: "/user/1", label: "My Profile" },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="py-2 text-sm text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-background py-10 mt-20">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">MangaVerse</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">The premium destination for manga readers and creators worldwide.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/browse" className="hover:text-primary transition-colors">Browse</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="/contests" className="hover:text-primary transition-colors">Contests</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Creators</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/creator-dashboard" className="hover:text-primary transition-colors">Creator Studio</Link></li>
              <li><Link href="/creator/1" className="hover:text-primary transition-colors">Creator Profiles</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Creator Program</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Genres</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/genres/action" className="hover:text-primary transition-colors">Action</Link></li>
              <li><Link href="/genres/romance" className="hover:text-primary transition-colors">Romance</Link></li>
              <li><Link href="/genres/fantasy" className="hover:text-primary transition-colors">Fantasy</Link></li>
              <li><Link href="/genres/horror" className="hover:text-primary transition-colors">Horror</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="/dmca" className="hover:text-primary transition-colors">DMCA</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
          <span>© 2025 MangaVerse. All rights reserved.</span>
          <span>Built for manga lovers, by manga lovers.</span>
        </div>
      </div>
    </footer>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col w-full bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function ReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col w-full bg-black text-foreground">
      <main className="flex-1">{children}</main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Chapter reader — no nav/footer */}
      <Route path="/manga/:mangaId/chapter/:chapterId">
        {(params) => (
          <ReaderLayout>
            <ChapterReader />
          </ReaderLayout>
        )}
      </Route>
      {/* All other pages */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/browse" component={Browse} />
            <Route path="/manga/:mangaId" component={MangaDetail} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/contests" component={Contests} />
            <Route path="/community" component={Community} />
            <Route path="/creator/:creatorId" component={CreatorProfile} />
            <Route path="/creator-dashboard" component={CreatorDashboard} />
            <Route path="/user/:userId" component={UserProfile} />
            <Route path="/genres/:slug" component={GenrePage} />
            <Route path="/about" component={InfoPage} />
            <Route path="/contact" component={InfoPage} />
            <Route path="/terms" component={InfoPage} />
            <Route path="/privacy" component={InfoPage} />
            <Route path="/dmca" component={InfoPage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
