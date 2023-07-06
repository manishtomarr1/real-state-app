import { useSearch } from "../../context/search";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// import { GOOGLE_PLACES_KEY } from "../../config";
import { sellPrices, rentPrices } from "../../helpers/priceLIst";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchForm() {
  const [search, setSearch] = useSearch();

  const navigate = useNavigate();

  const handleSearch = async () => {
    setSearch({ ...search, loading: true });

    try {
      const { results, page, price, ...rest } = search;
      const query = queryString.stringify(rest);
      // console.log(query)
      const { data } = await axios.get(`/search?${query}`);
      if (search?.page !== "/search") {
        setSearch((prev) => ({ ...prev, results: data, loading: false }));
        navigate("/search");
      } else {
        setSearch((prev) => ({
          ...prev,
          results: data,
          page: window.location.pathname,
          loading: false,
        }));
      }
    } catch (err) {
      console.log(err);
      setSearch({ ...search, loading: false });
    }
  };

  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-lg-12 d-flex">
            {/* <GooglePlacesAutocomplete
              apiKey={GOOGLE_PLACES_KEY}
              apiOptions={{ region: "au" }}
              selectProps={{
                defaultInputValue: search?.address,
                placeholder: "Search for address..",
                onChange: ({ value }) => {
                  setSearch({ ...search, address: value.description });
                },
              }}
            /> */}

            <input
              type="text"
              class="input"
              placeholder="Search..."
              onChange={(e) => {
                setSearch({...search,address:e.target.value});
              }}
            />
            {/* <button class="search-button">Search</button> */}
          </div>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button
            onClick={() => setSearch({ ...search, action: "sell", price: "" })}
            className="col-lg-2 btn btn-primary"
          >
            {search.action === "sell" ? "✅ Buy" : "Buy"}
          </button>
          <button
            onClick={() => setSearch({ ...search, action: "rent", price: "" })}
            className="col-lg-2 btn btn-primary"
          >
            {search.action === "rent" ? "✅ Rent" : "Rent"}
          </button>
          <button
            onClick={() => setSearch({ ...search, type: "House" })}
            className="col-lg-2 btn btn-primary"
          >
            {search.type === "House" ? "✅ House" : "House"}
          </button>
          <button
            onClick={() => setSearch({ ...search, type: "Land" })}
            className="col-lg-2 btn btn-primary"
          >
            {search.type === "Land" ? "✅ Land" : "Land"}
          </button>
          <div className="dropdown">
            {/* <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              &nbsp; Price range
            </button> */}
            <ul className="dropdown-menu    ">
              {search.action === "sell" ? (
                <>
                  {sellPrices?.map((p) => (
                    <li key={p._id} className="">
                      <a
                        className="dropdown-item pointer"
                        onClick={() =>
                          setSearch({
                            ...search,
                            price: p.name,
                            priceRange: p.array,
                          })
                        }
                      >
                        {p.name}
                      </a>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  {rentPrices?.map((p) => (
                    <li key={p._id}>
                      <a
                        className="dropdown-item pointer"
                        onClick={() =>
                          setSearch({
                            ...search,
                            price: p.name,
                            priceRange: p.array,
                          })
                        }
                      >
                        {p.name}
                      </a>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
          <button
            className="col-lg-2 btn btn-warning square"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* {JSON.stringify(search, null, 4)} */}
    </>
  );
}
