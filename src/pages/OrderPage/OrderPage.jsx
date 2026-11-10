import NavBar from '../../components/NavBar/NavBar'
import AdminOrdersview from "../../components/DashbordPage/AdminOrdersView"

const OrderPage = () => {
  return (
    <div>
        <NavBar/>
        <AdminOrdersview showSummary={false}/>
    </div>
  )
}

export default OrderPage