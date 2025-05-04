
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import BorrowerCard from "@/components/BorrowerCard";
import AddBorrowerForm from "@/components/AddBorrowerForm";
import EditBorrowerForm from "@/components/EditBorrowerForm";
import EmptyState from "@/components/EmptyState";
import { Borrower } from "@/utils/types";
import { Plus, History } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [settledBorrowers, setSettledBorrowers] = useState<Borrower[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editBorrower, setEditBorrower] = useState<Borrower | null>(null);

  // Load borrowers from localStorage on initial render
  useEffect(() => {
    const savedBorrowers = localStorage.getItem("borrowers");
    if (savedBorrowers) {
      setBorrowers(JSON.parse(savedBorrowers));
    }
    
    const savedSettledBorrowers = localStorage.getItem("settledBorrowers");
    if (savedSettledBorrowers) {
      try {
        setSettledBorrowers(JSON.parse(savedSettledBorrowers));
      } catch (error) {
        console.error("Error parsing settled borrowers:", error);
        setSettledBorrowers([]);
      }
    }
  }, []);

  // Save borrowers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("borrowers", JSON.stringify(borrowers));
  }, [borrowers]);
  
  // Save settled borrowers to localStorage whenever they change
  useEffect(() => {
    console.log("Saving settled borrowers:", settledBorrowers);
    localStorage.setItem("settledBorrowers", JSON.stringify(settledBorrowers));
  }, [settledBorrowers]);

  // Handle adding a new borrower
  const handleAddBorrower = (newBorrower: Omit<Borrower, "id">) => {
    const borrowerWithId: Borrower = {
      ...newBorrower,
      id: uuidv4(),
    };
    
    setBorrowers((prev) => [...prev, borrowerWithId]);
    
    toast({
      title: "Borrower added",
      description: `${newBorrower.name} added to your tracking list.`,
    });
  };

  // Handle updating a borrower's repayment
  const handleUpdateRepayment = (id: string, amount: number) => {
    const borrowerToUpdate = borrowers.find(borrower => borrower.id === id);
    
    if (!borrowerToUpdate) return;
    
    const newAmount = Math.max(0, borrowerToUpdate.currentAmount - amount);
    const updatedBorrower = { ...borrowerToUpdate, currentAmount: newAmount };
    
    // If fully repaid, move to settled borrowers
    if (newAmount === 0) {
      // Remove from active borrowers
      setBorrowers(prev => prev.filter(borrower => borrower.id !== id));
      
      // Add to settled borrowers
      setSettledBorrowers(prev => {
        const newSettled = [...prev, updatedBorrower];
        console.log("New settled borrowers:", newSettled);
        return newSettled;
      });
      
      toast({
        title: "Loan settled!",
        description: `${borrowerToUpdate.name} has fully repaid their loan.`,
      });
    } else {
      // Just update the amount
      setBorrowers(prev => 
        prev.map(borrower => 
          borrower.id === id ? updatedBorrower : borrower
        )
      );
      
      toast({
        description: `Recorded payment of ${amount.toFixed(2)} from ${borrowerToUpdate.name}.`,
      });
    }
  };

  // Handle editing a borrower
  const handleEditBorrower = (updatedBorrower: Borrower) => {
    setBorrowers((prev) =>
      prev.map((borrower) =>
        borrower.id === updatedBorrower.id ? updatedBorrower : borrower
      )
    );
    
    toast({
      description: `${updatedBorrower.name}'s information updated.`,
    });
  };

  // Handle deleting a borrower
  const handleDeleteBorrower = (id: string) => {
    const borrowerToDelete = borrowers.find((b) => b.id === id);
    
    if (borrowerToDelete) {
      setBorrowers((prev) => prev.filter((borrower) => borrower.id !== id));
      
      toast({
        description: `${borrowerToDelete.name} has been removed from your tracking list.`,
      });
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-6">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-medium">LoanTracker</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
              asChild
            >
              <Link to="/history">
                <History className="h-4 w-4 mr-1" />
                History
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          {borrowers.length > 0
            ? `Tracking ${borrowers.length} active loan${borrowers.length !== 1 ? "s" : ""}`
            : "Start tracking your loans"}
        </p>
      </header>
      
      <main>
        {borrowers.length === 0 ? (
          <EmptyState onAddNew={() => setShowAddForm(true)} />
        ) : (
          <div>
            {/* Active borrowers */}
            {borrowers.map((borrower) => (
              <BorrowerCard
                key={borrower.id}
                borrower={borrower}
                onUpdate={handleUpdateRepayment}
                onEdit={setEditBorrower}
                onDelete={handleDeleteBorrower}
                isSettled={false}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Add Borrower Form */}
      <AddBorrowerForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={handleAddBorrower}
      />
      
      {/* Edit Borrower Form */}
      <EditBorrowerForm
        isOpen={!!editBorrower}
        borrower={editBorrower}
        onClose={() => setEditBorrower(null)}
        onSave={handleEditBorrower}
      />
    </div>
  );
};

export default Index;



