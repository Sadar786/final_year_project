import React, { useState, useEffect } from "react";
import { Button, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import EmployeeReport from "./EmployeeReport";
import { HiArrowSmRight } from "react-icons/hi";
const MonthlyReport = () => {
  const [reportData, setReportDataOfOrder] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    totalAmountByTailoring: [],
    totalSalaries: [],
  });
  const [loading, setLoading] = useState({ orders: true, employees: true });
  const [error, setError] = useState({ orders: null, employees: null });
  const { myShop } = useSelector((state) => state.shop);
  const [changeReport, setChangeReport] = useState(true);

  useEffect(() => {
    const fetchReportDataOfOrder = async () => {
      try {
        const response = await fetch(
          `/api/tailoring/monthlyReport/${myShop._id}`
        );
        const data = await response.json();
        setReportDataOfOrder(data);
      } catch (error) {
        setError((prev) => ({ ...prev, orders: "Failed to load orders data" }));
      } finally {
        setLoading((prev) => ({ ...prev, orders: false }));
      }
    };

    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(
          `/api/employee/monthlyReportEmployee/${myShop._id}`
        );
        const data = await response.json();

        // Ensure that totalAmountByTailoring and totalSalaries are arrays
        if (data.totalAmountByTailoring && data.totalSalaries) {
          setEmployeeData(data);
        } else {
          setError((prev) => ({
            ...prev,
            employees: "Invalid format for employees data",
          }));
        }
      } catch (error) {
        setError((prev) => ({
          ...prev,
          employees: "Failed to load employees data",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, employees: false }));
      }
    };

    fetchReportDataOfOrder();
    fetchEmployeeData();
  }, [myShop._id]);

  if (loading.orders || loading.employees) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error.orders || error.employees) {
    return (
      <div className="text-center py-10 text-red-500">
        {error.orders || error.employees}
      </div>
    );
  }

  // Combine order and employee data
  const combinedReport = reportData.map((order) => {
    // Extract employee data for the matching year and month
    const tailoringData =
      employeeData.totalAmountByTailoring.find(
        (item) => item._id.year === order.year && item._id.month === order.month
      ) || {};

    const salaryData =
      employeeData.totalSalaries.find(
        (item) => item._id.year === order.year && item._id.month === order.month
      ) || {};

    const totalAmountByTailoring = tailoringData.totalAmountByTailoring || 0;
    const totalSalaries = salaryData.totalSalary || 0;

    const totalRevenue = order.totalRevenue || 0;

    return {
      ...order,
      totalAmountByTailoring,
      totalSalaries,
      totalExp: totalAmountByTailoring + totalSalaries,
      netRevenue: totalRevenue - (totalAmountByTailoring + totalSalaries),
    };
  });

  const changeReportTable = () => {
    if (changeReport === false) {
      setChangeReport(true);
    } else {
      setChangeReport(false);
    }
    console.log(changeReport);
  };

  return (
    <div className=" lg:flex flex-col justify-center items-center w-full table-auto overflow-x-scroll md:ax-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {/* buttons and header */}
      <div className="flex flex-col gap-2 justify-center p-2 align-center items-center w-full">
        <button
          className="bg-gradient-to-r bg-yellow-500
                    hover:scale-105 text-sm duration-200 text-white py-1 px-3 m-2 rounded-full"
          onClick={changeReportTable}
        >
          <div className="flex w-full gap-2 justify-center items-center">


          {changeReport ? "Employees Report" : "Year Report"}
          <HiArrowSmRight size={20} />
          </div>
        </button>
        <h3 className="text-2xl font-semibold mb-4">
          {" "}
          {changeReport
            ? `Financial Report for ${new Date().getFullYear().toString()}`
            : `Employees Financial Report ${new Date()
                .getFullYear()
                .toString()}`}
        </h3>
      </div>
      {changeReport ? (
        // full year report

        <Table hoverable={true} striped={true} className="w-full">
          <Table.Head className="font-bold text-bold">
            <Table.HeadCell className="text-bold p-4 text-left text-sm">
              <span className="font-extrabold">Month</span>
            </Table.HeadCell>
            <Table.HeadCell className="text-bold font-bold p-4 text-left text-sm">
              <p>Completed</p> Orders
            </Table.HeadCell>
            <Table.HeadCell className="font-bold text-bold p-4 text-left text-sm">
              <span className="">
                <p>Total</p> Revenue
              </span>
            </Table.HeadCell>
            <Table.HeadCell className="font-bold text-bold p-4 text-left text-sm">
              <p>Employees</p>
              <p>Tailoring</p>
              Revenue
            </Table.HeadCell>
            <Table.HeadCell className="font-bold text-bold p-4 text-left text-sm">
              <p>Total</p>
              <p>Employees</p>
              Salaries
            </Table.HeadCell>
            <Table.HeadCell className="font-bold text-bold p-4 text-left text-sm">
              <span className="font-bold text-bold p-4 text-left text-sm">
                Total <br />
                Expenses
              </span>
            </Table.HeadCell>
            <Table.HeadCell className="font-bold 0 text-bold p-4 text-left text-sm">
              <span className=" font-bold">Net Revenue</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {combinedReport.map((item, index) => (
              <Table.Row key={index} className="hover:bg-gray-100">
                <Table.Cell className="p-4 text-sm">
                  <span className="font-bold">
                    {`${item.year}-${item.month.toString().padStart(2, "0")}`}
                  </span>
                </Table.Cell>
                <Table.Cell className="p-4 text-sm">
                  {item.totalOrders}
                </Table.Cell>
                <Table.Cell className="p-4 text-sm">
                  <span className="text-yellow-600 dark:text-yellow-500">
                    {item.totalRevenue.toFixed(2)}
                  </span>
                </Table.Cell>
                <Table.Cell className="p-4 text-sm">
                  {item.totalAmountByTailoring.toFixed(2)}
                </Table.Cell>
                <Table.Cell className="p-4 text-sm">
                  {item.totalSalaries.toFixed(2)}
                </Table.Cell>
                <Table.Cell className="p-4 text-sm">
                  <span className="text-red-400 font-semibold">
                    {item.totalExp.toFixed(2)}
                  </span>
                </Table.Cell>
                <Table.Cell className="p-4 text-sm">
                  <span className="text-green-500 font-bold">
                    {item.netRevenue.toFixed(2)}
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        // employee report

        <EmployeeReport />
      )}
    </div>
  );
};

export default MonthlyReport;
