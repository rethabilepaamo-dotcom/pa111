
import { useState } from "react";

export default function Transactions({
  books,
  users,
  transactions,
  borrowBook,
  returnBook,
  availableCopies,
}) {
  const [search, setSearch] = useState("");
  const [bookId, setBookId] = useState("");
  const [userId, setUserId] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  );

  const today = new Date().toISOString().slice(0, 10);

  const filtered = transactions.filter(t =>
    `${t.bookTitle} ${t.userName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function submitBorrow(e) {
    e.preventDefault();

    const result = borrowBook(bookId, userId, dueDate);
    alert(result);

    if (result === "Book borrowed successfully.") {
      setBookId("");
      setUserId("");
    }
  }

  function statusOf(t) {
    if (t.returnDate) return "Returned";
    if (t.dueDate < today) return "Overdue";
    return "Borrowed";
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Borrowing & Returns</h1>
          <p>Record book loans and manage returns.</p>
        </div>
      </div>

      <div className="panel borrow-panel">
        <h2>Issue a Book</h2>
        <form className="borrow-form" onSubmit={submitBorrow}>
          <div>
            <label>Select Book</label>
            <select value={bookId} onChange={e => setBookId(e.target.value)} required>
              <option value="">Choose a book</option>
              {books.filter(b => availableCopies(b) > 0).map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} ({availableCopies(book)} available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Select Member</label>
            <select value={userId} onChange={e => setUserId(e.target.value)} required>
              <option value="">Choose a member</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Due Date</label>
            <input
              type="date"
              min={today}
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              required
            />
          </div>

          <button className="primary-button" type="submit">Confirm Borrowing</button>
        </form>
      </div>

      <div className="search-box">
        <span>⌕</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search member or book..."
        />
      </div>

      <div className="panel table-panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Return Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.userName}</strong></td>
                  <td>{t.bookTitle}</td>
                  <td>{t.borrowDate}</td>
                  <td>{t.dueDate}</td>
                  <td>
                    <span className={`status ${statusOf(t).toLowerCase()}`}>
                      {statusOf(t)}
                    </span>
                  </td>
                  <td>{t.returnDate || "—"}</td>
                  <td>
                    {!t.returnDate && (
                      <button className="small-button" onClick={() => {
                        if (window.confirm(`Record return of "${t.bookTitle}"?`)) {
                          returnBook(t.id);
                        }
                      }}>
                        Return Book
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filtered.length && <p className="empty-message">No transactions found.</p>}
      </div>
    </div>
  );
}