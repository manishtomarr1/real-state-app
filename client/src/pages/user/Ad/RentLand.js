import Sidebar from "../../../components/nav/SideBAr";
import AdForm from "../../../components/forms/AdForm";
export default function RentLand() {
  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Rent Land</h1>
      <Sidebar />
      <div className="container mt-2">
        <AdForm action="rent" type="Land" />
      </div>
    </div>
  );
}
