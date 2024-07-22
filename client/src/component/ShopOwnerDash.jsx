import { Button, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiDuplicate,
  HiOutlineDocument,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ShopOwnerDash() {
  const [Orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmplyee] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [lastMonthOrders, setLastMonthOrders] = useState(0);
  const [lastMonthEmployees, setLastMonthEmployees] = useState(0);
  const [lastMonthProducts, setLastMonthProducts] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const {myShop } = useSelector((state)=> state.shop)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/order/getOrders?shopId=${myShop._id}`);
        const data = await res.json();
        if (res.ok) {
          setOrders(data.Orders);
          setTotalOrders(data.totalOrders);
          setLastMonthOrders(data.lastMonthOrders);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchProducts = async () => {
     
      const url = `/api/product/getProducts?shopId=${myShop._id}`;
      console.log("Fetching products from URL:", url);
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          setTotalProducts(data.totalProducts);
          setLastMonthProducts(data.lastMonthProducts);
         }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`/api/employee/getEmployees?shopId=${myShop._id}`);
        const data = await res.json();
        if (res.ok) {
          setEmplyee(data.Employees);
          setTotalEmployees(data.totalEmployees);
          setLastMonthEmployees(data.lastMonthEmployees);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchOrders();
    fetchProducts();
    fetchEmployees();
    console.log(Orders);
  }, [currentUser.isAdmin]);
  return (
    <div className="p-3 md:mx-auto max-w-screen-md">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="justify-between flex">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Orders</h3>
              <p className="text-2xl">{totalOrders}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green flex items-center">
              <HiArrowNarrowUp />
              {lastMonthOrders}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="justify-between flex">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total products
              </h3>
              <p className="text-2xl">{totalProducts}</p>
            </div>
            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green flex items-center">
              <HiArrowNarrowUp />
              {lastMonthProducts}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="justify-between flex">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Employees</h3>
              <p className="text-2xl">{totalEmployees}</p>
            </div>
            <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green flex items-center">
              <HiArrowNarrowUp />
              {lastMonthEmployees}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>

{/* lower part */}
      <div className="flex flex-wrap mx-auto gap-4 py-3 justify-center">
        <div className="flex  flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Orders</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to="/dashboard?tab=order">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head >
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Delivery Address</Table.HeadCell>
            </Table.Head>
            {Orders &&
              Orders.slice(0,5).map((order) => (
                <Table.Body key={order._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                   {order?.status}
                    </Table.Cell>
                    <Table.Cell>
                        {order?.deliveryAddress}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent products</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to="/dashboard?tab=products">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>products Contents</Table.HeadCell>
              <Table.HeadCell>name</Table.HeadCell>
            </Table.Head>
            {products &&
             products.slice(0, 5).map((prod) => (
                
                <Table.Body key={prod._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-95">
                      <img className="w-16" src={prod.image} alt="" />
                    </Table.Cell>
                    <Table.Cell>
                        {prod.name}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              )
              )}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Employees</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to="/dashboard?tab=employee">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>name</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
            </Table.Head>
            {employees &&
              employees.slice(0,5).map((employee) => (
                <Table.Body key={employee._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                   
                    <Table.Cell className="w-96">
                        {employee.name}
                    </Table.Cell>
                    <Table.Cell className="w-5">
                        {employee.role}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
