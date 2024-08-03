import React, { useState } from 'react';

const NewClient = ({ addClient, categories }) => {
  const [client, setClient] = useState({ firstName: '', lastName: '', email: '', category: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addClient(client);
    setClient({ firstName: '', lastName: '', email: '', num: '', category: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        value={client.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        name="lastName"
        value={client.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        required
      /><input
      type="text"
      name="email"
      value={client.num}
      onChange={handleChange}
      placeholder="Contácto"
      required
    />
      <input
        type="email"
        name="email"
        value={client.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <select
        name="category"
        value={client.category}
        onChange={handleChange}
        required
      >
        <option value="" disabled>Select Job Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>
      <button type="submit">Add Client</button>
    </form>
  );
};

export default NewClient; 