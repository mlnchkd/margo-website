export default function ContactsPage() {
  const contacts = [
    { role: "Studio Manager", name: "Alina Petrova", email: "alina@photohouse.com" },
    { role: "Lead Photographer", name: "Dmytro Koval", email: "dmytro@photohouse.com" },
    { role: "Retoucher", name: "Marta June", email: "marta@photohouse.com" },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: "16px", fontSize: "30px" }}>Contacts</h1>
      <div style={{ display: "grid", gap: "10px" }}>
        {contacts.map((contact) => (
          <article
            key={contact.email}
            style={{
              background: "#fff",
              border: "1px solid #e5e8ef",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            <h2 style={{ fontSize: "18px", marginBottom: "4px" }}>{contact.name}</h2>
            <p style={{ color: "#5f6573", marginBottom: "2px" }}>{contact.role}</p>
            <p>{contact.email}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
