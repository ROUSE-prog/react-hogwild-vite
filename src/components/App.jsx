import { useState } from "react";
import hogsData from "../porkers_data";
import Nav from "./Nav";

function App() {
  const [hogs, setHogs] = useState(hogsData);
  const [showGreasedOnly, setShowGreasedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [hiddenHogs, setHiddenHogs] = useState([]);
  const [expandedHogs, setExpandedHogs] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    specialty: "",
    greased: false,
  });

  const toggleDetails = (hogName) => {
    setExpandedHogs((prev) =>
      prev.includes(hogName)
        ? prev.filter((name) => name !== hogName)
        : [...prev, hogName]
    );
  };

  const hideHog = (hogName) => {
    setHiddenHogs((prev) => [...prev, hogName]);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddHog = (event) => {
    event.preventDefault();

    const newHog = {
      name: formData.name,
      weight: Number(formData.weight),
      specialty: formData.specialty,
      greased: formData.greased,
      image: "https://via.placeholder.com/300x200?text=New+Hog",
      "highest medal achieved": "No medal yet",
    };

    setHogs((prev) => [...prev, newHog]);

    setFormData({
      name: "",
      weight: "",
      specialty: "",
      greased: false,
    });
  };

  const displayedHogs = hogs
    .filter((hog) => !hiddenHogs.includes(hog.name))
    .filter((hog) => (showGreasedOnly ? hog.greased : true))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "weight") return a.weight - b.weight;
      return 0;
    });

  return (
    <div className="app">
      <Nav />

      <main className="ui container">
        <section className="controls">
          <label htmlFor="greased-filter">
            Greased Pigs Only?
            <input
              id="greased-filter"
              type="checkbox"
              checked={showGreasedOnly}
              onChange={() => setShowGreasedOnly(!showGreasedOnly)}
            />
          </label>

          <label htmlFor="sort-by">
            Sort by:
            <select
              id="sort-by"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="">Original</option>
              <option value="name">Name</option>
              <option value="weight">Weight</option>
            </select>
          </label>
        </section>

        <form className="hog-form" onSubmit={handleAddHog}>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
          />

          <label htmlFor="weight">Weight:</label>
          <input
            id="weight"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleFormChange}
          />

          <label htmlFor="specialty">Specialty:</label>
          <input
            id="specialty"
            name="specialty"
            value={formData.specialty}
            onChange={handleFormChange}
          />

          <label htmlFor="greased">Greased?</label>
          <input
            id="greased"
            name="greased"
            type="checkbox"
            checked={formData.greased}
            onChange={handleFormChange}
          />

          <button type="submit">Add Hog</button>
        </form>

        <section className="ui grid container">
          {displayedHogs.map((hog) => (
            <div className="ui eight wide column" key={hog.name}>
              <div aria-label="hog card" className="ui card">
                <div className="image">
                  <img src={hog.image} alt={`Photo of ${hog.name}`} />
                </div>

                <div className="content" onClick={() => toggleDetails(hog.name)}>
                  <h3>{hog.name}</h3>

                  {expandedHogs.includes(hog.name) && (
                    <div className="description">
                      <p>Specialty: {hog.specialty}</p>
                      <p>{hog.weight}</p>
                      <p>{hog.greased ? "Greased" : "Nongreased"}</p>
                      <p>{hog["highest medal achieved"]}</p>
                    </div>
                  )}
                </div>

                <div className="extra content">
                  <button onClick={() => hideHog(hog.name)}>Hide Me</button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;