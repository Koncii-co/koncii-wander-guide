
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import InspirationCarousel from "@/components/InspirationCarousel";
import QuickActions from "@/components/QuickActions";
import ExploreSection from "@/components/ExploreSection";
import ChatInterface from "@/components/ChatInterface";
import ExpandedSearch from "@/components/ExpandedSearch";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DelhiHeritageSection from "@/components/DelhiHeritageSection";
import IndexBackground from "@/components/IndexBackground";
import { useIndexState } from "@/hooks/useIndexState";
import { useAuthSync } from "@/hooks/useAuthSync";

const Index = () => {
  const {
    searchQuery,
    setSearchQuery,
    showChat,
    setShowChat,
    showExpandedSearch,
    setShowExpandedSearch,
    isLoaded,
    setIsLoaded,
    initialChatPrompt,
    setInitialChatPrompt
  } = useIndexState();

  // Sync user with Supabase when authenticated
  useAuthSync();

  // Animation loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [setIsLoaded]);

  const handleSearchClick = () => {
    setShowExpandedSearch(true);
  };

  const handleChatOpenWithPrompt = (prompt: string) => {
    setInitialChatPrompt(prompt);
    setShowChat(true);
  };

  const handleChatClose = () => {
    setShowChat(false);
    setInitialChatPrompt("");
  };

  const handleChatToggle = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative">
      <IndexBackground />

      <Header isLoaded={isLoaded} onChatToggle={handleChatToggle} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12 relative z-10">
        <HeroSection 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchClick={handleSearchClick}
          isLoaded={isLoaded}
        />

        {/* Quick Actions */}
        <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} animate-ease-in-bounce`}>
          <QuickActions onChatOpen={handleChatOpenWithPrompt} />
        </div>

        <DelhiHeritageSection 
          isLoaded={isLoaded}
          onChatOpenWithPrompt={handleChatOpenWithPrompt}
        />

        {/* Inspiration Carousel */}
        <section className={`space-y-6 transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} animate-ease-in-bounce`}>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text animate-bounce-in-ease">
              Trending Destinations
            </h3>
            <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">
              View All
            </Button>
          </div>
          <InspirationCarousel />
        </section>

        {/* Explore Section */}
        <div className={`transition-all duration-1000 delay-1100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <ExploreSection onAIAgentClick={() => {
            setInitialChatPrompt("I want to explore travel options and get personalized recommendations. Can you help me plan my next adventure?");
            setShowChat(true);
          }} />
        </div>
      </main>

      {/* Chat Interface */}
      {showChat && (
        <div className="animate-slide-in">
          <ChatInterface onClose={handleChatClose} initialPrompt={initialChatPrompt} />
        </div>
      )}

      {/* Expanded Search Interface */}
      {showExpandedSearch && (
        <div className="animate-fade-in">
          <ExpandedSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={() => setShowExpandedSearch(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
