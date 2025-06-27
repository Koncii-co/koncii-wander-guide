
import { useState } from 'react';

export const useIndexState = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showExpandedSearch, setShowExpandedSearch] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState("");

  return {
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
  };
};
