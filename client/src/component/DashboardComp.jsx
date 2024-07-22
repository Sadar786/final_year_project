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

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStore, setTotalStores] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthShops, setLastMonthShops] = useState(0);
  const [lastMonthProducts, setLastMonthProducts] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getUsers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/product/getProducts?limit=5`);
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
    const fetchShops = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setShops(data.posts);
          setTotalStores(data.totalPosts);
          setLastMonthShops(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUsers();
    fetchProducts();
    fetchShops();
    console.log(users);
  }, [currentUser.isAdmin]);
  return (
    <div className="p-3 md:mx-auto max-w-screen-md">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="justify-between flex">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
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
              <h3 className="text-gray-500 text-md uppercase">Total Stores</h3>
              <p className="text-2xl">{totalStore}</p>
            </div>
            <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green flex items-center">
              <HiArrowNarrowUp />
              {lastMonthShops}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>

{/* lower part */}
      <div className="flex flex-wrap mx-auto gap-4 py-3 justify-center">
        <div className="flex  flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to="/dashboard?tab=users">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head >
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>
                        {user.username}
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
              <Link to="/dashboard?tab=allproduct">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>products Contents</Table.HeadCell>
              <Table.HeadCell>name</Table.HeadCell>
            </Table.Head>
            {products &&
              products.map((prod) => (
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
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Stores</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to="/dashboard?tab=shops">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Logo</Table.HeadCell>
              <Table.HeadCell>name</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {shops &&
              shops.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt="post"
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">
                        {post.title}
                    </Table.Cell>
                    <Table.Cell className="w-5">
                        {post.category}
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
