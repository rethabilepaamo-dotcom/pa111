
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";

const initialBooks = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Programming", copies: 5 },
  { id: 2, title: "Java Programming", author: "Herbert Schildt", category: "Programming", copies: 4 },
];

const initialUsers = [
  { id: 1, name: "Mary Jones", email: "mary@example.com", phone: "58000001" },
];

function loadData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("Dashboard");
  const [books, setBooks] = useState(() => loadData("library_books", initialBooks));
  const [users, setUsers] = useState(() => loadData("library_users", initialUsers));
  const [transactions, setTransactions] = useState(
    () => loadData("library_transactions", [])
  );

  useEffect(() => {
    localStorage.setItem("library_books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("library_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("library_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const today = new Date().toISOString().slice(0, 10);

  function availableCopies(book) {
    const borrowed = transactions.filter(
      t => t.bookId === book.id && !t.returnDate
    ).length;

    return Math.max(0, Number(book.copies) - borrowed);
  }

  function login(username, password) {
    if (username === "admin" && password === "1234") {
      setLoggedIn(true);
      setPage("Dashboard");
      return true;
    }
    return false;
  }

  function borrowBook(bookId, userId, dueDate) {
    const book = books.find(b => b.id === Number(bookId));
    const user = users.find(u => u.id === Number(userId));

    if (!book || !user || availableCopies(book) < 1) {
      return "This book is not available.";
    }

    if (!dueDate || dueDate < today) {
      return "Please select a valid due date.";
    }

    setTransactions(old => [
      {
        id: Date.now(),
        bookId: book.id,
        userId: user.id,
        bookTitle: book.title,
        userName: user.name,
        borrowDate: today,
        dueDate,
        returnDate: "",
      },
      ...old,
    ]);

    return "Book borrowed successfully.";
  }

  function returnBook(transactionId) {
    setTransactions(old =>
      old.map(t =>
        t.id === transactionId
          ? { ...t, returnDate: today }
          : t
      )
    );
  }

  if (!loggedIn) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">L</div>
          <div>
            <h2>Libra</h2>
            <small>Library System</small>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        {["Dashboard", "Books", "Members", "Transactions"].map(item => (
          <button
            key={item}
            className={`nav-link ${page === item ? "active" : ""}`}
            onClick={() => setPage(item)}
          >
            <span>
              {{
                Dashboard: "⌂",
                Books: "▤",
                Members: "♙",
                Transactions: "↔",
              }[item]}
            </span>
            {item}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Library Admin</small>
            </div>
          </div>
          <button
            className="logout-button"
            onClick={() => setLoggedIn(false)}
          >
            ↪ Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <small>LIBRARY MANAGEMENT</small>
            <h2>{page}</h2>
          </div>
          <div className="admin-tag">
            <span className="online-dot"></span>
            Administrator
          </div>
        </header>

        <section className="page-content">
          {page === "Dashboard" && (
            <Dashboard
              books={books}
              users={users}
              transactions={transactions}
              availableCopies={availableCopies}
              setPage={setPage}
            />
          )}

          {page === "Books" && (
            <Books
              books={books}
              setBooks={setBooks}
              availableCopies={availableCopies}
              transactions={transactions}
            />
          )}

          {page === "Members" && (
            <Users
              users={users}
              setUsers={setUsers}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          )}

          {page === "Transactions" && (
            <Transactions
              books={books}
              users={users}
              transactions={transactions}
              borrowBook={borrowBook}
              returnBook={returnBook}
              availableCopies={availableCopies}
            />
          )}
        </section>
      </main>
    </div>
  );
}