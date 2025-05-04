
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddNew: () => void;
}

const EmptyState = ({ onAddNew }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="#cccccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="text-lg font-medium mb-2">No entries yet</h2>
      <p className="text-muted-foreground mb-6">
        Add your first borrower to start tracking money owed to you
      </p>
      <Button onClick={onAddNew} className="flex items-center">
        <Plus className="mr-2 h-4 w-4" />
        Add New Borrower
      </Button>
    </div>
  );
};

export default EmptyState;
