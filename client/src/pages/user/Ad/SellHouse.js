import Sidebar from "../../../components/nav/SideBAr";
import AdForm from "../../../components/forms/AdForm";
export default function SellHouse() {
  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Sell House</h1>
      <Sidebar />
      <div className="container mt-2">
        <AdForm action="sell" type="House" />
      </div>
    </div>
  );
}
