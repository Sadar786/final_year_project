import React, { useState, useEffect } from "react";
import { Select, Table, Label } from "flowbite-react";
import { useSelector } from "react-redux";

export default function EmployeeReport() {
  const { myShop } = useSelector((state) => state.shop);
  const [employeeData, setEmployeeData] = useState([]);
  const [mDate, setMDate] = useState({ month:'' });
  const [newData, setNewData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employee/employeeReport/${myShop._id}`);
        if (!res.ok) {
          console.log(res.statusText);
          return;
        }
        const data = await res.json();
        console.log('Fetched data:', data);  // Log the fetched data
        setEmployeeData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [myShop._id]);

  const showMonthWise = () => {
    console.log("Filtering data for:", mDate);  // Log the selected date
    const filteredData = employeeData.filter((employee) =>
      employee.year === new Date().getFullYear() && employee.month === parseInt(mDate.month)
    );
    console.log("Filtered data:", filteredData);  // Log the filtered data
    setNewData(filteredData);
  };

  return (
    <div>
    
      <div className="max-w-md mb-10">
        <div className="mb-2 block">
          <Label htmlFor="years" value="Select Month" />
        </div>
        <div className="flex w-full items-center gap-3 m-3 ml-0">
          

          <Select
            id="months"
            onChange={(e) => {
              setMDate({ ...mDate, month: e.target.value });
            }}
            required
          >
            <option value=''>Select Month</option>
            <option value="1">1 January</option>
            <option value="2">2 February</option>
            <option value="3">3 March</option>
            <option value="4">4 April</option>
            <option value="5">5 May</option>
            <option value="6">6 June</option>
            <option value="7">7 July</option>
            <option value="8">8 August</option>
            <option value="9">9 September</option>
            <option value="10">10 October</option>
            <option value="11">11 November</option>
            <option value="12">12 December</option>
          </Select>
          <button 
        className="bg-gradient-to-r md:text-sm text-xs bg-yellow-500 hover:scale-105 duration-200 text-white py-1 px-3 m-2 rounded-full"
        onClick={showMonthWise}
      >
        Show Report
      </button>
        </div>
     
      </div>
      <Table hoverable={true} striped={true} className="w-full">
        <Table.Head className="font-bold text-bold">
          <Table.HeadCell className="text-bold p-4 text-left text-sm">
            Employee <br /> Name
          </Table.HeadCell>
          <Table.HeadCell className="font-bold text-bold p-4 text-left text-sm">
            Assigned <br /> Orders
          </Table.HeadCell>
          <Table.HeadCell className="font-bold text-bold p-4 text-left text-sm">
            Completed <br /> Orders
          </Table.HeadCell>
          <Table.HeadCell className="font-bold text-bold p-4 text-left text-sm">
            Total <br /> Amount By <br /> Tailoring
          </Table.HeadCell>
          <Table.HeadCell className="font-bold text-bold p-4 text-left text-sm">
            Salary
          </Table.HeadCell>
          <Table.HeadCell   className="font-bold text-green-400 text-bold p-4 text-left text-sm">
             <p className="text-green-400">
                Net Revenue
              </p> 
          </Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {newData && newData.length > 0 ? (
            newData.map((employee, index) => (
              <Table.Row key={index} className="hover:bg-gray-100">
                <Table.Cell className="p-4 text-sm">
                <span className="dark:text-white text-black">
                {employee.name}
                  </span> 
                  </Table.Cell>
                <Table.Cell className="p-4 text-sm">{employee.totalClothesAssign}</Table.Cell>
                <Table.Cell className="p-4 text-sm">{employee.totalClothesCompleted}</Table.Cell>
                <Table.Cell className="p-4 text-sm">{employee.totalAmountByTailoring.toFixed(2)}</Table.Cell>
                <Table.Cell className="p-4 text-sm">{employee.salary}</Table.Cell>
                <Table.Cell className="p-4 text-sm">
                <span className="text-green-400 text-bold">
                {(employee.salary + employee.totalAmountByTailoring).toFixed(2)}
              </span> 
                 </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan="6" className="p-4 text-center text-sm">No data available for the selected month and year</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}
