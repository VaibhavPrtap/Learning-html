
import { useEffect, useState } from "react";
import { Borrower } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import BorrowerCard from "@/components/BorrowerCard";
import { History as HistoryIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";

const History = () => {
  const { toast } = useToast();
  const [settledBorrowers, setSettledBorrowers] = useState<Borrower[]>([]);

  // Load settled borrowers from localStorage on initial render
  useEffect(() => {
    const savedSettledBorrowers = localStorage.getItem("settledBorrowers");
    if (savedSettledBorrowers) {
      try {
        const parsedBorrowers = JSON.parse(savedSettledBorrowers);
        console.log("Loaded settled borrowers:", parsedBorrowers);
        setSettledBorrowers(parsedBorrowers);
      } catch (error) {
        console.error("Error parsing settled borrowers:", error);
        setSettledBorrowers([]);
      }
    }
  }, []);

  // Save to localStorage whenever settled borrowers change
  useEffect(() => {
    localStorage.setItem("settledBorrowers", JSON.stringify(settledBorrowers));
  }, [settledBorrowers]);

  // Handle clearing all history
  const handleClearHistory = () => {
    setSettledBorrowers([]);
    toast({
      description: "History cleared successfully",
    });
  };

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-6">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-medium">Settled Loans</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
              asChild
            >
              <Link to="/">
                <HistoryIcon className="h-4 w-4 mr-1" />
                Active Loans
              </Link>
            </Button>
            {settledBorrowers.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                className="flex items-center"
                onClick={handleClearHistory}
              >
                <Trash className="h-4 w-4 mr-1" />
                Clear History
              </Button>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          {settledBorrowers.length > 0
            ? `${settledBorrowers.length} settled loan${settledBorrowers.length !== 1 ? "s" : ""}`
            : "No settled loans yet"}
        </p>
      </header>
      
      <main>
        {settledBorrowers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
              <HistoryIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium mb-2">No settled loans yet</h2>
            <p className="text-muted-foreground mb-6">
              Settled loans will appear here once your borrowers repay their loans
            </p>
            <Button asChild>
              <Link to="/">Go to Active Loans</Link>
            </Button>
          </div>
        ) : (
          <div>
            {/* Settled borrowers */}
            {settledBorrowers.map((borrower) => (
              <BorrowerCard
                key={borrower.id}
                borrower={borrower}
                onUpdate={() => {}} // No updates for settled borrowers
                onEdit={() => {}} // No edits for settled borrowers
                onDelete={() => {}} // No deletion for settled borrowers
                isSettled={true}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;


