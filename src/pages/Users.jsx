
import { useState } from "react";

export default function Users({ users, setUsers, transactions }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const filtered = users.filter(user =>
    `${user.name} ${user.email} ${user.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAdd() {
    setForm({ name: "", email: "", phone: "" });
    setEditing("new");
  }

  function openEdit(user) {
    setForm({ ...user });
    setEditing(user.id);
  }

  function saveUser(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter the member's name.");
      return;
    }

    if (editing === "new") {
      setUsers(old => [...old, { ...form, id: Date.now() }]);
    } else {
      setUsers(old =>
        old.map(user =>
          user.id === editing ? { ...form, id: editing } : user
        )
      );
    }

    setEditing(null);
  }

  function deleteUser(user) {
    const hasActiveLoan = transactions.some(
      t => t.userId === user.id && !t.returnDate
    );

    if (hasActiveLoan) {
      alert("This member has a book that must be returned first.");
      return;
    }

    if (window.confirm(`Remove member ${user.name}?`)) {
      setUsers(old => old.filter(u => u.id !== user.id));
    }
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Member Management</h1>
          <p>Register and manage library members.</p>
        </div>
        <button className="primary-button" onClick={openAdd}>+ Register Member</button>
      </div>

      <div className="search-box">
        <span>⌕</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email or phone..."
        />
      </div>

      <div className="panel table-panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Active Loans</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email || "—"}</td>
                  <td>{user.phone || "—"}</td>
                  <td>{transactions.filter(t => t.userId === user.id && !t.returnDate).length}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="small-button" onClick={() => openEdit(user)}>Edit</button>
                      <button className="small-button delete-button" onClick={() => deleteUser(user)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filtered.length && <p className="empty-message">No members found.</p>}
      </div>

      {editing !== null && (
        <div className="modal-overlay">
          <form className="modal-card" onSubmit={saveUser}>
            <h2>{editing === "new" ? "Register Member" : "Update Member"}</h2>

            <label>Full Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            <label>Phone Number</label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="primary-button" type="submit">Save Member</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}