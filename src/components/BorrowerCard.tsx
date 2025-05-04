
import { useState } from "react";
import { Borrower } from "../utils/types";
import { formatCurrency, formatDate } from "../utils/formatUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Edit, Trash } from "lucide-react";

interface BorrowerCardProps {
  borrower: Borrower;
  onUpdate: (id: string, amount: number) => void;
  onEdit: (borrower: Borrower) => void;
  onDelete: (id: string) => void;
  isSettled: boolean;
}

const BorrowerCard = ({ 
  borrower, 
  onUpdate, 
  onEdit, 
  onDelete, 
  isSettled 
}: BorrowerCardProps) => {
  const [repaymentAmount, setRepaymentAmount] = useState<string>("");
  const [showRepay, setShowRepay] = useState<boolean>(false);
  const [isSettling, setIsSettling] = useState<boolean>(false);

  const handleRepayment = () => {
    const amountNum = parseFloat(repaymentAmount);
    
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > borrower.currentAmount) {
      return;
    }
    
    onUpdate(borrower.id, amountNum);
    setRepaymentAmount("");
    setShowRepay(false);
  };

  const handleSettleCompletely = () => {
    setIsSettling(true);
    
    // Mark as settled by updating with the full remaining amount
    setTimeout(() => {
      onUpdate(borrower.id, borrower.currentAmount);
      setIsSettling(false);
    }, 500); // Delay to allow animation to be seen
  };

  return (
    <div 
      className={`
        relative p-4 rounded-lg mb-4 card-shadow transition-all duration-300 
        ${isSettled ? 'settled-card' : ''}
        ${isSettling ? 'animate-settled' : 'bg-card'}
        //animate-slide-up
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className={`text-lg font-medium ${isSettled || isSettling ? 'text-white' : ''}`}>{borrower.name}</h2>
        {!isSettled && !isSettling &&(
          <div className="flex space-x-1">
            <button 
              onClick={() => onEdit(borrower)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={() => onDelete(borrower.id)}
              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className={`text-sm mb-1 ${isSettled || isSettling ? 'text-white/90' : 'text-muted-foreground'}`}>
        Borrowed on {formatDate(borrower.borrowDate)}
      </div>
      
      <div className="flex justify-between mb-3">
        <div className={`${isSettled || isSettling ? 'text-white/90' : 'text-muted-foreground'} text-sm`}>
          Originally borrowed
        </div>
        <div className={`font-medium ${isSettled || isSettling ? 'text-white' : ''}`}>
          {formatCurrency(borrower.originalAmount)}
        </div>
      </div>
      
      <div className="flex justify-between mb-3">
        <div className={`${isSettled || isSettling ? 'text-white' : 'text-foreground'} font-medium`}>
          Currently owes
        </div>
        <div className={`font-medium ${isSettled || isSettling ? 'text-white' : ''}`}>
          {formatCurrency(borrower.currentAmount)}
        </div>
      </div>
      
      {isSettled ? (
        <div className="bg-white/20 text-white font-medium text-center py-1.5 rounded-md mt-3">
          Settled
        </div>
      ) : isSettling ? (
        <div className="bg-white/20 text-white font-medium text-center py-1.5 rounded-md mt-3 animate-pulse">
          Settling...
        </div>
      ) : (
        <>
          {showRepay ? (
            <div className="flex mt-3 space-x-2">
              <Input
                type="number"
                step="0.01"
                placeholder="Amount repaid"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(e.target.value)}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleRepayment}
                disabled={!repaymentAmount || parseFloat(repaymentAmount) <= 0 || parseFloat(repaymentAmount) > borrower.currentAmount}
              >
                Record
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowRepay(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2 mt-3">
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => setShowRepay(true)}
              >
                Record payment
              </Button>
              <Button
                className="bg-mint hover:bg-mint-dark text-white"
                size="icon"
                onClick={handleSettleCompletely}
                title="Mark as settled"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BorrowerCard;
