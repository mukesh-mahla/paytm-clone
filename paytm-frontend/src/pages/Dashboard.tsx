import { Appbar } from "../components/appBar"
import { Balance } from "../components/balance"
import { Users } from "../components/users"

export const Dashboard = () => {
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={"10,000"} />
            <Users />
        </div>
    </div>
}