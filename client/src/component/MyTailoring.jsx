import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { Button, Table, Modal, Select, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

// lsff5poOWZCrU6kgm

export default function MyTailoring() {
  const { currentUser } = useSelector((state) => state.user);
  const { myShop } = useSelector((state) => state.shop);
  const [MyTailoring, setMyTailoring] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [tailoringIdToDelete, setTailoringIdToDelete] = useState("");
  const [tailoringsIdToUpdate, setTailoringsIdToUpdate] = useState("");
  const [updateData, setUpdateDate] = useState({});
  const navigate = useNavigate();
  const [showTailors, setShowTailors] = useState(false);
  const [tailors, setTailors] = useState([]);
  const [orderIdToAssign, setOrderIdToAssign] = useState("");
  const [employeeIdToUpdate, setEmployeeIdToUpdate] = useState("");
  const [tailorName, setTailorName] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [showAmountInput, setShowAmountInput] = useState(false)
  const [totalAmountByTailoring, setTotalAmountByTailoring] = useState(1);
  const [showAsk, setShowAsk] = useState(false)
  const [customerEmail, setCutomerEmail] = useState('')
  const [tStatus, setTStatus] = useState('')

  let employeeUpdateData = {};

  employeeUpdateData = {
    ...employeeUpdateData,
    orderIdToAssign: orderIdToAssign,
  };


  useEffect(()=>{
    if(updateData.status !== "Completed"){
     setTotalAmountByTailoring(0)
    }
  },[updateData])

  useEffect(() => {
    const fetchMyTailoring = async () => {
      try {
        const response = await fetch(
          `/api/tailoring/getTailoring?shopId=${myShop._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch MyTailoring");
        }
        const data = await response.json();
        setMyTailoring(data.Tailorings);

        if (data.Tailorings.length < 0) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error)
      }
    };

    if (currentUser.haveAShop) {
      fetchMyTailoring();
      console.log("fron useE: " +MyTailoring.length)

    }
  }, [currentUser, myShop._id  ]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          `/api/employee/getEmployees?shopId=${myShop._id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch MyTailoring");
        }
        const data = await res.json();
        setTailors(data.Employees);
        if (data.Employees.length > 0) {
          console.log("tailors from fetchEmployees " + tailors[0].name);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.haveAShop) {
      fetchEmployees();
    }
  }, [currentUser, myShop._id, tailors.length]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const tailoringsWithCustomers = await Promise.all(
        MyTailoring.map(async (tailoring) => {
          const res = await fetch(`/api/user/getUser/${tailoring.customerId}`);
          const data = await res.json();
          return { ...tailoring, customerData: data };
        })
      );
      setMyTailoring(tailoringsWithCustomers);
    };

    if (MyTailoring.length > 0) {
      fetchCustomerData();
    }
  }, [MyTailoring.length]);

  const handleShowMore = async () => {
    const startIndex = MyTailoring.length;
    console.log("the starting index : " + startIndex)
    
    try {
      const res = await fetch(
        `/api/tailoring/getTailoring?shopId=${myShop._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      
      if (res.ok) {
        if (Array.isArray(data.Tailorings)) {
          setMyTailoring((prev) => [...prev, ...data.Tailorings]);
          if (data.Tailorings.length < 9) {
            setShowMore(false);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Failed to fetch tailorings");
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleDeletetailorings = async () => {
    setShowModal(false);
    console.log("The id to be deleted: " + tailoringIdToDelete);
    try {
      const res = await fetch(
        `/api/tailoring/deleteTailoring/${tailoringIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message)
      } else {
        if(employeeIdToUpdate){
          await removeTailoringOrderFromEmployeeOnDelete();

        }
        setMyTailoring((prev) =>
          prev.filter((tailoring) => tailoring._id !== tailoringIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleApproval = async () => {
    try {
      console.log("Approval method is called");
  
      // Update the tailoring status
      const res = await fetch(
        `/api/tailoring/updateTailoring/${tailoringsIdToUpdate}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );
  
      // Check if the response is successful
      if (res.ok) {
        const updatedTailoring = await res.json();
      await   setTStatus(updatedTailoring.status)

        // Update the local state with the new tailoring data
        setMyTailoring((prevTailorings) =>
          prevTailorings.map((tailoring) =>
            tailoring._id === updatedTailoring._id
              ? updatedTailoring
              : tailoring
          )
        );
  
        const shopName = myShop.title;
        console.log(currentUser.email)
        // Send email notification if the status is "Completed"
        if (updatedTailoring.status === 'Completed') {
          const emailRes = await fetch('/api/email/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shopEmail: currentUser.email,
              toName: updatedTailoring.customerName,
              fromName: shopName,
              message: `The tailoring job ID: ${updatedTailoring._id} has been marked as completed.`,
              toEmail: customerEmail
            })
          });
  
          if (emailRes.ok) {
            const result = await emailRes.json();
            console.log('Email sent:', result.message);
          } else {
            const error = await emailRes.json();
            console.error('Email sending error:', error.error);
          }
        }
      } else {
        // Handle non-200 responses from the API
        const error = await res.json();
        console.error('Update failed:', error.message);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Something went wrong:', error.message);
    }
  };
  

  const handleViewOrder = (tailoring) => {
    navigate("/tailoring", { state: { tailoring } });
  };

  const goToMeasurement = () => {
    navigate(`/addtailoring/${myShop._id}`);
  };

  const markOrderAssign = async () => {
    let updatedOrder = {};
    updatedOrder = {
      ...updatedOrder,
      assignToTailor: true,
      tailorName: tailorName,
      tailorId: employeeIdToUpdate,
    };
    try {
      console.log("approval method is called");
      const res = await fetch(
        `/api/tailoring/updateTailoring/${tailoringsIdToUpdate}/${currentUser._id}`,
        {
          method: "PUT", // Corrected 'tailoring' to 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrder),
        }
      );
      if (res.ok) {
        const markedAssigned = await res.json();
        setMyTailoring((prevtailorings) =>
          prevtailorings.map((tailoring) =>
            tailoring._id === markedAssigned._id ? markedAssigned : tailoring
          )
        );
      } else {
        const error = await res.json();
        console.log(error.message);
      }
    } catch (error) {
      console.log("something went wrong " + error.message);
    }
  };

  const handleAssignToTailor = async () => {
    try {
      const res = await fetch(
        `/api/employee/updateEmployee/${employeeIdToUpdate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeUpdateData),
        }
      );

      if (!res.ok) {
        console.log("Some error occurred: " + res.statusText);
        return;
      }

      const data = await res.json();
      await markOrderAssign();
      

      console.log(data);
      setShowTailors(false);
    } catch (error) {
      console.log("Error: " + error.message);
      // setTailorName('')
    }
  };
  const giveMoneyTotailor = async () => {
    try {
      console.log( " give moye stauts  " + tStatus )
      const res = await fetch(
        `/api/employee/updateEmployee/${employeeIdToUpdate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            {
             
              totalAmountByTailoring: totalAmountByTailoring,
              tailoringStatus : tStatus
            }
          ),
        }
      );

      if (!res.ok) {
        console.log("Some error occurred: " + res.statusText);
        return;
      }

      const data = await res.json();
      await markOrderAssign();

      console.log(data);
      setShowTailors(false);
    } catch (error) {
      console.log("Error: " + error.message);
    }
  };

  const removeTailoringOrderFromEmployeeOnDelete = async () => {
    try {
      console.log("tailoringIdToDelete:  ");
      const res = await fetch(
        `/api/employee/removeOrderFormEmp/${employeeIdToUpdate}/${tailoringIdToDelete}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus: orderStatus }),
        }
      );

      if (!res.ok) {
        console.error(
          "Error occurred while removing the order from employee assignment"
        );
        return;
      }

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };




  return (
    <div className="table-auto md:flex items-center flex-col justify-center w-full overflow-x-scroll md:ax-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex w-full  items-center justify-between">
        <h3 className="font-bold text-slate-500 text-sm sm:text-lg" >
          My Tailoring Orders
        </h3>
        <span onClick={() => goToMeasurement()}>
          <button
            className="bg-gradient-to-r text-sm bg-yellow-500
                    hover:scale-105 duration-200 text-white py-1 px-3 m-2 rounded-full"
            color={"gray"}
          >
            Add Tailoring
          </button>
        </span>
        <Link to={`/shop/${myShop.slug}`}>
          <img
            className="w-14 hidden sm:inline rounded-full"
            src={myShop.image}
            alt=""
          />
        </Link>
      </div>
      {currentUser.haveAShop ? (
        MyTailoring.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Sr</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Customer</Table.HeadCell>
                <Table.HeadCell>Payment Method</Table.HeadCell>
                <Table.HeadCell>Tailoring price</Table.HeadCell>
                <Table.HeadCell>Delivery Address</Table.HeadCell>
                <Table.HeadCell>
                  <span className="text-gray-900 dark:text-white hover:underline">
                    Assign to Tailor
                  </span>
                </Table.HeadCell>
                <Table.HeadCell>Tailoring Status</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {MyTailoring.map((tailoring, index) => (
                <Table.Body key={index} className="divide-y">
                  <Table.Row
                    key={index}
                    className="bg-white dark:btailoring-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                     {index+1}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(tailoring.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                   
                    <Table.Cell>
                      <div
                        onClick={() => handleViewOrder(tailoring)}
                        className="hover:underline dark:hover:text-white rounded-md cursor-pointer"
                      >
                        <img
                          className="w-14 rounded-full"
                          src={tailoring.customerData?.profilePicUrl}
                          alt={tailoring.customerData?.username}
                        />
                        <p>
                          {tailoring.customerName && tailoring.customerName}
                        </p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{tailoring.paymentMethod}</Table.Cell>
                    <Table.Cell>{tailoring.tailoringPrice}</Table.Cell>
                    <Table.Cell>{tailoring.costumerAddress}</Table.Cell>
                    <Table.Cell>
                      {!tailoring.assignToTailor ? (
                        <div
                          onClick={() => {
                            {
                              setShowTailors(true);
                              setOrderIdToAssign(tailoring._id);
                              setTailoringsIdToUpdate(tailoring._id);
                            }
                          }}
                          className="text-gray-900 cursor-pointer hover:p-1 items-center justify-center w-full flex dark:text-white "
                        >
                          {<FaTimes className="text-red-500" />}
                        </div>
                      ) : (
                        <div className="text-gray-900 cursor-pointer items-center justify-center w-full flex dark:text-white ">
                          {tailoring?.tailorName || (
                            <FaCheck className="text-green-400" />
                          )}
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {
                        (tailoring.assignToTailor && tailoring.status !== 'Completed')  ?(
                      <span className="hover:underline dark:hover:text-white rounded-md cursor-pointer text-gray-900  dark:text-white"
                      style={{ cursor: "pointer" }}
                      onClick={ async () => {
                        setShowModal1(true);
                        setTailoringsIdToUpdate(tailoring._id);
                        setEmployeeIdToUpdate(tailoring.tailorId)
                        setCutomerEmail(tailoring.customerEmail)

                      }}>
                        {tailoring.status}
                      </span>
                        ):
                        (
                          <span className={tailoring.status === 'Completed' ? 'text-green-500 font-bold' : ''}>
                          {tailoring.status}
                        </span>
                        
                        )
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setTailoringIdToDelete(tailoring._id);
                          setEmployeeIdToUpdate(tailoring.tailorId)
                          setOrderStatus(tailoring.status);
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
          <p className="text-3xl pt-5 font-light">
            You don't have any tailoring orders yet
          </p>
        )
      ) : (
        <p className="text-3xl pt-5 font-light">
          You don't have a shop yet. Please create a shop to view your tailoring
          orders.
        </p>
      )}
      <Modal
        show={showModal}
        size="md"
        popup
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this tailoring order?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletetailorings}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* modal for update */}
      <Modal
        show={showModal1}
        onClose={() => setShowModal1(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <Select
              onChange={(e) => {
                setUpdateDate({
                  ...updateData,
                  status: e.target.value,
                });
              }}
            >
              <option>tailoring Status</option>
              <option value="Pending">Pending</option>
              <option value="Proccessing">Proccessing</option>
              <option value="Completed">Completed</option>
            </Select>

            <div className="flex justify-between items-center mt-2">
              <Button color="red" onClick={() => setShowModal1(false)}>
                Cancel
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setShowModal1(false);
                  if(updateData.status === "Completed") {
                    setShowAmountInput(true);
                  } else{
                    handleApproval();
                  }
                
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* model for showing tailors */}
      <Modal
        show={showTailors}
        onClose={() => setShowTailors(false)}
        popup
        size={"md"}
      >
        <Modal.Header>Select one to assign</Modal.Header>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Tailor name</Table.HeadCell>
              <Table.HeadCell>Rule</Table.HeadCell>
              <Table.HeadCell>Total Assigned Tasks</Table.HeadCell>
              <Table.HeadCell>
                <span className="text-green-500 text-bold">
                Completed Tasks
                  </span></Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {tailors && tailors.length > 0 ? (
              tailors.map((tailor) => {
                if (
                  (tailor && tailor.role === "tailor") ||
                  (tailor && tailor.role === "hybrid")
                ) {
                  return (
                    <Table.Body className="divide-y" key={tailor._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          <span
                            className="hover:underline cursor-pointer"
                            onClick={() => {
                              setShowAsk(true)
                              setEmployeeIdToUpdate(tailor._id);
                              setTailorName(tailor.name);
                              console.log(tailor.name)
                            }}
                          >
                            {tailor?.name || "N/A"}
                          </span>
                        </Table.Cell>
                        <Table.Cell>{tailor?.role || "N/A"}</Table.Cell>
                        <Table.Cell>
                          {tailor?.totalClothesAssign || "N/A"}
                        </Table.Cell>
                        <Table.Cell>
                          {tailor?.totalClothesCompleted || "0"}
                        </Table.Cell>
                       
                      </Table.Row>
                    </Table.Body>
                  );
                }
              })
            ) : (
              <div className="flex justify-center items-center w-full">
                <p className="text-center text-xl ">
                  You have not any tailor now{" "}
                </p>
              </div>
            )}
          </Table>
        </div>
      </Modal>


      {/* modal for input Amount  */}
      <Modal show={showAmountInput} size="md" onClose={() => setShowAmountInput(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Enter the Amount to add to the Tailor for this Tailoring.
            </h3>
            <TextInput
            type="number"
            placeholder="Enter Amount"
            value={totalAmountByTailoring}
            onChange={(e) => setTotalAmountByTailoring(e.target.value)}
          />
            <div className="flex justify-center gap-4">
              <Button color="Success" onClick={async() => {
                setShowAmountInput(false)
              await  handleApproval();
               await giveMoneyTotailor();
                }}>
                {"Ok Done"}
              </Button>
              <Button color="gray" onClick={() => setShowAmountInput(false)}>
                Skip this
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showAsk} size="md" onClose={() => setShowAsk(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {"Do You realy Want to assign to " + {tailorName}}
            </h3>
            
            <div className="flex justify-center gap-4">
              <Button color="Success" onClick={() => {
                handleAssignToTailor();
                setShowAsk(false)
                }}>
                yes I Do.
              </Button>
              <Button color="gray" onClick={() => setShowAsk(false)}>
                Skip this
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
