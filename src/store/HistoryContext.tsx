import { useLocalStorage } from "@mantine/hooks";
import { createContext, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique IDs

type HistoryContextProps = {
  children: ReactNode;
};

type HistoryElement = {
  id: string;
  label: string;
  amount: number;
  type: string;
  dateCreated: string;
  category: string;
};

type HistoryContextType = {
  history: HistoryElement[];
  setHistory: (history: HistoryElement[]) => void;
  addHistoryElement: (element: Omit<HistoryElement, "id" | "dateCreated">) => void;
  deleteHistoryElement: (id: string) => void;
};

const HistoryContext = createContext<HistoryContextType>({
  history: [],
  setHistory: (history: HistoryElement[]) => {},
  addHistoryElement: (element) => {},
  deleteHistoryElement: (id: string) => {},
});

export function HistoryContextProvider({ children }: HistoryContextProps) {
  const [history, setHistory] = useLocalStorage<HistoryElement[]>({
    key: "History",
    defaultValue: [],
  });

  // Set the entire history array
  function setHistoryHandler(history: HistoryElement[]) {
    setHistory(history);
  }

  // Adds a new history element
  function addHistoryElementHandler(element: Omit<HistoryElement, "id" | "dateCreated">) {
    const today = new Date();
    const date = today.toLocaleDateString("en-GB"); // Format as dd/mm/yyyy

    setHistory((prev) => [
      {
        id: uuidv4(), // Generate a unique ID
        label: element.label,
        amount: element.amount,
        type: element.type,
        dateCreated: date,
        category: element.category,
      },
      ...prev,
    ]);
  }

  // Deletes a history element by ID
  function deleteHistoryElementHandler(id: string) {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }

  const context = {
    history,
    setHistory: setHistoryHandler,
    addHistoryElement: addHistoryElementHandler,
    deleteHistoryElement: deleteHistoryElementHandler,
  };

  return (
    <HistoryContext.Provider value={context}>
      {children}
    </HistoryContext.Provider>
  );
}

export default HistoryContext;
