
import { useState } from "react";

export default function Books({ books, setBooks, availableCopies, transactions }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    copies: 1,
  });

  const filtered = books.filter(book =>
    `${book.title} ${book.author} ${book.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAdd() {
    setForm({ title: "", author: "", category: "", copies: 1 });
    setEditing("new");
  }

  function openEdit(book) {
    setForm({ ...book });
    setEditing(book.id);
  }

  function saveBook(e) {
    e.preventDefault();

    const copies = Number(form.copies);

    if (!form.title.trim() || !form.author.trim() || copies < 1) {
      alert("Enter a title, author and at least one copy.");
      return;
    }

    if (editing !== "new") {
      const borrowed = transactions.filter(
        t => t.bookId === editing && !t.returnDate
      ).length;

      if (copies < borrowed) {
        alert(`You must keep at least ${borrowed} copies because some are borrowed.`);
        return;
      }
    }

    if (editing === "new") {
      setBooks(old => [...old, { ...form, id: Date.now(), copies }]);
    } else {
      setBooks(old =>
        old.map(book =>
          book.id === editing
            ? { ...form, id: editing, copies }
            : book
        )
      );
    }

    setEditing(null);
  }

  function deleteBook(book) {
    const borrowed = transactions.some(
      t => t.bookId === book.id && !t.returnDate
    );

    if (borrowed) {
      alert("This book cannot be removed while copies are borrowed.");
      return;
    }

    if (window.confirm(`Delete "${book.title}"?`)) {
      setBooks(old => old.filter(b => b.id !== book.id));
    }
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Book Management</h1>
          <p>Add, update, remove and search books.</p>
        </div>
        <button className="primary-button" onClick={openAdd}>+ Add Book</button>
      </div>

      <div className="search-box">
        <span>⌕</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search title, author or category..."
        />
      </div>

      <div className="panel table-panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Total Copies</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(book => (
                <tr key={book.id}>
                  <td><strong>{book.title}</strong></td>
                  <td>{book.author}</td>
                  <td>{book.category || "—"}</td>
                  <td>{book.copies}</td>
                  <td><span className="status returned">{availableCopies(book)}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="small-button" onClick={() => openEdit(book)}>Edit</button>
                      <button className="small-button delete-button" onClick={() => deleteBook(book)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filtered.length && <p className="empty-message">No books found.</p>}
      </div>

      {editing !== null && (
        <div className="modal-overlay">
          <form className="modal-card" onSubmit={saveBook}>
            <h2>{editing === "new" ? "Add New Book" : "Update Book"}</h2>

            <label>Book Title</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />

            <label>Author</label>
            <input
              value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })}
              required
            />

            <label>Category</label>
            <input
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Programming"
            />

            <label>Total Copies</label>
            <input
              type="number"
              min="1"
              value={form.copies}
              onChange={e => setForm({ ...form, copies: e.target.value })}
              required
            />

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="primary-button" type="submit">Save Book</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}