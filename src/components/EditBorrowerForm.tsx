
import { useEffect, useState } from "react";
import { Borrower } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface EditBorrowerFormProps {
  isOpen: boolean;
  borrower: Borrower | null;
  onClose: () => void;
  onSave: (borrower: Borrower) => void;
}

const EditBorrowerForm = ({ 
  isOpen, 
  borrower, 
  onClose, 
  onSave 
}: EditBorrowerFormProps) => {
  const [name, setName] = useState("");
  const [originalAmount, setOriginalAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [date, setDate] = useState("");
  
  useEffect(() => {
    if (borrower) {
      setName(borrower.name);
      setOriginalAmount(borrower.originalAmount.toString());
      setCurrentAmount(borrower.currentAmount.toString());
      setDate(borrower.borrowDate);
    }
  }, [borrower]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!borrower) return;
    
    const originalAmountNum = parseFloat(originalAmount);
    const currentAmountNum = parseFloat(currentAmount);
    
    if (
      name.trim() === "" || 
      isNaN(originalAmountNum) || 
      originalAmountNum <= 0 ||
      isNaN(currentAmountNum) ||
      currentAmountNum < 0
    ) return;
    
    onSave({
      ...borrower,
      name: name.trim(),
      originalAmount: originalAmountNum,
      currentAmount: currentAmountNum,
      borrowDate: date,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Borrower</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-original-amount">Original Amount</Label>
            <Input
              id="edit-original-amount"
              type="number"
              step="0.01"
              value={originalAmount}
              onChange={(e) => setOriginalAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-current-amount">Current Amount</Label>
            <Input
              id="edit-current-amount"
              type="number"
              step="0.01"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-date">Borrow Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBorrowerForm;
