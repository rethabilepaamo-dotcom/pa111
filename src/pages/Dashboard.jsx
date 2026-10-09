
export default function Dashboard({
  books,
  users,
  transactions,
  availableCopies,
  setPage,
}) {
  const today = new Date().toISOString().slice(0, 10);
  const activeLoans = transactions.filter(t => !t.returnDate);
  const overdue = activeLoans.filter(t => t.dueDate < today);

  const stats = [
    { title: "Book Titles", value: books.length, icon: "▤" },
    { title: "Members", value: users.length, icon: "♙" },
    { title: "Books Borrowed", value: activeLoans.length, icon: "↗" },
    { title: "Overdue Books", value: overdue.length, icon: "!" },
  ];

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Monitor your library's current activity.</p>
        </div>
        <button className="primary-button" onClick={() => setPage("Books")}>
          + Manage Books
        </button>
      </div>

      <div className="stats-grid">
        {stats.map(stat => (
          <div className="stat-card" key={stat.title}>
            <div className="stat-icon">{stat.icon}</div>
            <p>{stat.title}</p>
            <h2>{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recent Transactions</h3>
              <p>Latest borrowing activity</p>
            </div>
            <button className="text-button" onClick={() => setPage("Transactions")}>
              View all →
            </button>
          </div>

          {transactions.slice(0, 5).map(t => (
            <div className="activity-row" key={t.id}>
              <div>
                <strong>{t.userName}</strong>
                <p>{t.bookTitle}</p>
              </div>
              <span className={`status ${t.returnDate ? "returned" : t.dueDate < today ? "overdue" : "borrowed"}`}>
                {t.returnDate ? "Returned" : t.dueDate < today ? "Overdue" : "Borrowed"}
              </span>
            </div>
          ))}

          {!transactions.length && (
            <p className="empty-message">No borrowing activity yet.</p>
          )}
        </div>

        <div className="panel">
          <h3>Book Availability</h3>
          <p className="muted">Copies currently available</p>

          {books.slice(0, 6).map(book => (
            <div className="availability-row" key={book.id}>
              <div className="book-letter">{book.title.charAt(0)}</div>
              <div className="availability-info">
                <strong>{book.title}</strong>
                <small>{book.author}</small>
              </div>
              <span>{availableCopies(book)} available</span>
            </div>
          ))}

          {!books.length && (
            <p className="empty-message">No books have been added.</p>
          )}
        </div>
      </div>
    </div>
  );
}