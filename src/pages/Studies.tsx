import PopupModal from "../components/PopupModal";
import { useAuth } from "../hooks/useAuth";

const Studies = () => {
const { isAuthenticated } = useAuth();
  return (
    <div>
      {!isAuthenticated && <PopupModal />}
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Active Studies
        </h1>
      </header>
    </div>
  )
}

export default Studies;