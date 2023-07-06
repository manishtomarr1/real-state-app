import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/cards/UserCard";
export default function Agents() {
  //state
  const [agents, setAgents] = useState();
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      const { data } = await axios.get("/agents"); //request jayege /ads route pe wha se data milega or set jaiga
      setAgents(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  //effect
  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Agents</h1>

      <div className="container">
        <div className="row">
          {agents?.map((agent) => (
           <UserCard user={agent} key={agent._id}/>
          ))}
        </div>
      </div>

      {/* <pre>{JSON.stringify({ adsForSell, adsForRent }, null, 4)}</pre> */}
    </div>
  );
}
