import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Table, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function Employee() {
  const { currentUser } = useSelector((state) => state.user);
  const { myShop } = useSelector((state) => state.shop);
  const [employee, setEmployee] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`/api/employee/getMyEmployees/${myShop._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch employee");
        }
        const data = await response.json();
        setEmployee(data);

        if (data.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    // Fetch employee only if currentUser is admin or currentUser owns a empl
    if (currentUser.isAdmin || currentUser.haveAShop) {
      fetchEmployee();
    }
  }, [currentUser, myShop._id]);

  const handleShowMore = async () => {
    const startIndex = employee.length;

    try {
      const res = await fetch(
        `/api/employee/getmyShopoyee/${myShop._id}?startIndex=${startIndex}`

      );
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data.employee)) {
          setEmployee((prev) => [...prev, ...data.employee]);
          if (data.employee.length < 9) {
            setShowMore(false);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Failed to fetch employee");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteEmployee = async () => {
    setShowModal(false);
  
    try {
      console.log("Employee id delete " + employeeIdToDelete);
      console.log("current user id delete " + currentUser._id);
      console.log('my empl id ' + myShop._id);
      
      const res = await fetch(`/api/employee/deleteEmployee/${employeeIdToDelete}/${currentUser._id}/${myShop._id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setEmployee((prev) => prev.filter((empl) => empl._id !== employeeIdToDelete));
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div  className="lg:flex flex-col justify-center items-center w-full table-auto overflow-x-scroll md:ax-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex mx-auto items-center justify-center">
        <Link to={"/dashboard?tab=addemployee"}>
          <button className="bg-gradient-to-r text-sm bg-yellow-500
                    hover:scale-105 duration-200 text-white py-1 px-3 m-2 rounded-full">Add A Employee</button>
        </Link>
      </div>
      { currentUser.haveAShop ? (
        employee.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date</Table.HeadCell>
                 <Table.HeadCell>Employee Name</Table.HeadCell>
                <Table.HeadCell>Type</Table.HeadCell>
                <Table.HeadCell>Fixed Salary</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
               </Table.Head>
              {employee.map((empl, index) => (
                <Table.Body key={index} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {console.log(new Date(empl.updatedAt).toLocaleDateString())}
                    {new Date(empl.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                      //  to={`/empl/${empl.slug}`}
                      >
                        <span onTouchMove={()=> alert("tuch me")}> 

                        {empl.name}
                        </span>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                       // to={`/empl/${empl.slug}`}
                      >
                        {empl.role}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{empl.salary}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setEmployeeIdToDelete(empl._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {showMore && (
              <button
                className="text-teal-500 self-center text-sm py-7 w-full"
                onClick={handleShowMore}
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>You have no employee yet.</p>
        )
      ) : (
        <p>Only shopOwner and empl owners can view employee.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size={"md"}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Employee?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeleteEmployee}>
                Yes, I'm sure.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
